import JSZip from 'jszip'

/**
 * Injects preserved unknown/auxiliary parts (headers, footers, settings, customXml, theme)
 * into a generated .docx package buffer to prevent data loss.
 *
 * @param {Buffer|Uint8Array} generatedBuffer
 * @param {Map<string, any>} [preservedFiles]
 * @returns {Promise<Buffer>}
 */
export async function injectPreservedParts(generatedBuffer, preservedFiles) {
  if (!preservedFiles || preservedFiles.size === 0) {
    return Buffer.from(generatedBuffer)
  }

  const zip = new JSZip()
  await zip.loadAsync(generatedBuffer)

  for (const [path, fileEntry] of preservedFiles.entries()) {
    // Only copy if not already in newly generated docx (or if auxiliary header/footer/setting)
    if (
      path.startsWith('word/header') ||
      path.startsWith('word/footer') ||
      path === 'word/settings.xml' ||
      path.startsWith('word/theme/') ||
      path.startsWith('customXml/')
    ) {
      const data = await fileEntry.async('uint8array')
      zip.file(path, data)
    }
  }

  return zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' })
}
