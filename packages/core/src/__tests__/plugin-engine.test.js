import { describe, it, expect } from 'vitest'
import {
  createPluginEngine,
  createSandboxedApi,
  executeInSandbox,
  validatePluginManifest,
  PLUGIN_PERMISSIONS,
} from '../plugins/index.js'
import wordCounterManifest from '../../../../plugins/word-counter/manifest.json'
import csvCleanerManifest from '../../../../plugins/csv-cleaner/manifest.json'

describe('Plugin System & Sandbox Engine', () => {
  describe('Manifest Validation', () => {
    it('validates correct plugin manifests', () => {
      const res = validatePluginManifest(wordCounterManifest)
      expect(res.valid).toBe(true)
      expect(res.errors.length).toBe(0)

      const res2 = validatePluginManifest(csvCleanerManifest)
      expect(res2.valid).toBe(true)
      expect(res2.errors.length).toBe(0)
    })

    it('rejects manifests missing required fields or invalid permissions', () => {
      const invalid = { id: 'bad!', name: '', version: '1.0.0' }
      const res = validatePluginManifest(invalid)
      expect(res.valid).toBe(false)
      expect(res.errors.length).toBeGreaterThan(0)

      const badPerm = {
        id: 'test-plugin',
        name: 'Test',
        version: '1.0.0',
        main: 'index.js',
        permissions: ['unauthorized:root-access'],
      }
      const res2 = validatePluginManifest(badPerm)
      expect(res2.valid).toBe(false)
      expect(res2.errors[0]).toContain('Unknown permission')
    })
  })

  describe('Permission Gated Sandbox', () => {
    it('allows permitted document reading and blocks unpermitted writing', () => {
      let docText = 'Hello Zoffice Suite'
      const context = {
        getContent: () => docText,
        setContent: (val) => {
          docText = val
        },
      }

      // Granted ONLY read permission
      const readOnlyApi = createSandboxedApi(
        'test-reader',
        [PLUGIN_PERMISSIONS.DOC_READ],
        context,
      )

      expect(readOnlyApi.document.getContent()).toBe('Hello Zoffice Suite')
      expect(() => readOnlyApi.document.setContent('Hacked!')).toThrow(/Permission denied/)
      expect(docText).toBe('Hello Zoffice Suite')

      // Granted write permission
      const readWriteApi = createSandboxedApi(
        'test-writer',
        [PLUGIN_PERMISSIONS.DOC_READ, PLUGIN_PERMISSIONS.DOC_WRITE],
        context,
      )
      readWriteApi.document.setContent('Updated Text')
      expect(docText).toBe('Updated Text')
    })

    it('isolates plugin local storage under storage permission', () => {
      const apiNoStorage = createSandboxedApi('test', [], {})
      expect(() => apiNoStorage.storage.set('key', 'val')).toThrow(/Permission denied/)

      const apiWithStorage = createSandboxedApi('test', [PLUGIN_PERMISSIONS.STORAGE], {})
      apiWithStorage.storage.set('theme', 'custom')
      expect(apiWithStorage.storage.get('theme')).toBe('custom')
      apiWithStorage.storage.remove('theme')
      expect(apiWithStorage.storage.get('theme')).toBeUndefined()
    })

    it('shadows dangerous globals inside sandbox execution', () => {
      const api = createSandboxedApi('safe-test', [], {})
      const code = `
        module.exports = {
          hasWindow: typeof window,
          hasDocument: typeof document,
          hasProcess: typeof process
        };
      `
      const result = executeInSandbox(code, api)
      expect(result.hasWindow).toBe('undefined')
      expect(result.hasDocument).toBe('undefined')
      expect(result.hasProcess).toBe('undefined')
    })
  })

  describe('Plugin Engine Registry & Contributions', () => {
    it('registers plugins and provides filtered ribbon buttons and sidebars', () => {
      const engine = createPluginEngine()

      const regWord = engine.registerPlugin(
        wordCounterManifest,
        'module.exports = { openStats: () => "stats_opened", renderSidebar: () => ({ title: "Stats" }) };',
        [PLUGIN_PERMISSIONS.DOC_READ, PLUGIN_PERMISSIONS.UI_RIBBON, PLUGIN_PERMISSIONS.UI_SIDEBAR],
      )
      expect(regWord.success).toBe(true)

      const regCsv = engine.registerPlugin(
        csvCleanerManifest,
        'module.exports = { cleanCsvData: () => "cleaned" };',
        [PLUGIN_PERMISSIONS.DOC_READ, PLUGIN_PERMISSIONS.DOC_WRITE, PLUGIN_PERMISSIONS.UI_RIBBON, PLUGIN_PERMISSIONS.FILE_HANDLER],
      )
      expect(regCsv.success).toBe(true)

      // Query buttons for ZWriter
      const writerButtons = engine.getRibbonButtons('writer')
      expect(writerButtons.length).toBe(1)
      expect(writerButtons[0].label).toBe('Word Stats')
      expect(writerButtons[0].run()).toBe('stats_opened')

      // Query buttons for ZSheets
      const sheetsButtons = engine.getRibbonButtons('sheets')
      expect(sheetsButtons.length).toBe(1)
      expect(sheetsButtons[0].label).toBe('Clean CSV')
      expect(sheetsButtons[0].run()).toBe('cleaned')

      // Query sidebars for ZWriter
      const writerPanels = engine.getSidebarPanels('writer')
      expect(writerPanels.length).toBe(1)
      expect(writerPanels[0].title).toBe('Word Frequency')
      expect(writerPanels[0].render().title).toBe('Stats')

      // Disabling plugin removes contributions
      engine.disablePlugin('zoffice-word-counter')
      expect(engine.getRibbonButtons('writer').length).toBe(0)
    })
  })

  describe('Example Plugins Execution', () => {
    it('executes Word Frequency Counter logic accurately', () => {
      let toastMessage = ''
      const hostContext = {
        getContent: () => 'The quick brown fox jumps over the lazy dog. The fox was fast and the dog was brown.',
        showToast: (msg) => {
          toastMessage = msg
        },
      }

      const api = createSandboxedApi(
        'zoffice-word-counter',
        [PLUGIN_PERMISSIONS.DOC_READ, PLUGIN_PERMISSIONS.UI_RIBBON, PLUGIN_PERMISSIONS.UI_SIDEBAR],
        hostContext,
      )

      // Load sample plugin code
      const wordCounterCode = `
        function countWords(text) {
          const plain = text.replace(/<[^>]*>/g, ' ');
          const words = plain.toLowerCase().replace(/[^\\w\\s]/g, '').split(/\\s+/).filter(w => w.length > 1);
          const counts = new Map();
          for (const w of words) counts.set(w, (counts.get(w) || 0) + 1);
          const sorted = Array.from(counts.entries()).map(([word, count]) => ({ word, count })).sort((a,b) => b.count - a.count);
          return { total: words.length, unique: counts.size, readingTimeMinutes: Math.ceil(words.length / 200), topWords: sorted.slice(0, 10) };
        }
        module.exports = {
          openStats: function() {
            const stats = countWords(zoffice.document.getContent());
            zoffice.ui.showToast("Analysis complete: " + stats.total + " words");
            return stats;
          }
        };
      `

      const instance = executeInSandbox(wordCounterCode, api)
      const stats = instance.openStats()
      expect(stats.total).toBe(18)
      expect(stats.topWords[0].word).toBe('the')
      expect(stats.topWords[0].count).toBe(4)
      expect(toastMessage).toContain('18 words')
    })

    it('executes CSV Cleaner logic accurately', () => {
      let documentData = ' Name ,  Department , Role \r\n Alice , Engineering , Dev \n Alice , Engineering , Dev \n Bob , Sales , Lead \r\n'
      let toastMessage = ''

      const hostContext = {
        getContent: () => documentData,
        setContent: (val) => {
          documentData = val
        },
        showToast: (msg) => {
          toastMessage = msg
        },
      }

      const api = createSandboxedApi(
        'zoffice-csv-cleaner',
        [PLUGIN_PERMISSIONS.DOC_READ, PLUGIN_PERMISSIONS.DOC_WRITE, PLUGIN_PERMISSIONS.UI_RIBBON],
        hostContext,
      )

      const csvCleanerCode = `
        function cleanCsv(raw) {
          const lines = raw.replace(/\\r\\n/g, '\\n').replace(/\\r/g, '\\n').split('\\n');
          const seen = new Set();
          const cleaned = [];
          for (const line of lines) {
            if (!line.trim()) continue;
            const cells = line.split(',').map(c => c.trim());
            const key = cells.join(',');
            if (!seen.has(key)) {
              seen.add(key);
              cleaned.push(key);
            }
          }
          return cleaned.join('\\n');
        }
        module.exports = {
          cleanCsvData: function() {
            const raw = zoffice.document.getContent();
            const cleaned = cleanCsv(raw);
            zoffice.document.setContent(cleaned);
            zoffice.ui.showToast('Cleaned CSV');
            return cleaned;
          }
        };
      `

      const instance = executeInSandbox(csvCleanerCode, api)
      const res = instance.cleanCsvData()
      expect(res).toBe('Name,Department,Role\nAlice,Engineering,Dev\nBob,Sales,Lead')
      expect(documentData).toBe('Name,Department,Role\nAlice,Engineering,Dev\nBob,Sales,Lead')
      expect(toastMessage).toBe('Cleaned CSV')
    })
  })
})
