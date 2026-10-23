import JSZip from 'jszip'

/**
 * Loads a JSZip instance from various input formats (base64 string, Buffer, Uint8Array, ArrayBuffer).
 *
 * @param {string|Buffer|Uint8Array|ArrayBuffer} input
 * @returns {Promise<JSZip>}
 */
export async function loadDocxZip(input) {
  const zip = new JSZip()
  let data = input

  if (typeof input === 'string') {
    // If base64 string
    const cleanBase64 = input.replace(/^data:.*?;base64,/, '').trim()
    data = Buffer.from(cleanBase64, 'base64')
  }

  return zip.loadAsync(data)
}

/**
 * Reads document relationships from word/_rels/document.xml.rels.
 *
 * @param {JSZip} zip
 * @returns {Promise<Map<string, { id: string, type: string, target: string }>>}
 */
export async function readRelationships(zip) {
  const relsMap = new Map()
  const relsFile = zip.file('word/_rels/document.xml.rels')
  if (!relsFile) return relsMap

  const relsXml = await relsFile.async('text')
  const matchRegex = /<Relationship\s+([^>]+)\/>/gi
  let match

  while ((match = matchRegex.exec(relsXml)) !== null) {
    const attrs = match[1]
    const idMatch = attrs.match(/Id="([^"]+)"/i)
    const typeMatch = attrs.match(/Type="([^"]+)"/i)
    const targetMatch = attrs.match(/Target="([^"]+)"/i)

    if (idMatch && targetMatch) {
      const id = idMatch[1]
      const type = typeMatch ? typeMatch[1] : ''
      const target = targetMatch[1]
      relsMap.set(id, { id, type, target })
    }
  }

  return relsMap
}

/**
 * Reads media files from word/media/ and converts them to base64 data URIs.
 *
 * @param {JSZip} zip
 * @returns {Promise<Map<string, string>>} filename/target -> data URI
 */
export async function readMediaFiles(zip) {
  const mediaMap = new Map()
  const mediaFolder = zip.folder('word/media')
  if (!mediaFolder) return mediaMap

  const files = []
  mediaFolder.forEach((relativePath, file) => {
    files.push({ relativePath, file })
  })

  for (const { relativePath, file } of files) {
    const ext = relativePath.split('.').pop()?.toLowerCase() || 'png'
    const mimeType = ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : `image/${ext}`
    const base64 = await file.async('base64')
    const dataUri = `data:${mimeType};base64,${base64}`

    // Map by both relative path ("image1.png") and full path ("media/image1.png")
    mediaMap.set(relativePath, dataUri)
    mediaMap.set(`media/${relativePath}`, dataUri)
    mediaMap.set(`word/media/${relativePath}`, dataUri)
  }

  return mediaMap
}

/**
 * Reads and structures all critical parts of an OOXML document.
 *
 * @param {string|Buffer|Uint8Array|ArrayBuffer} input
 * @returns {Promise<{
 *   zip: JSZip,
 *   documentXml: string,
 *   stylesXml: string|null,
 *   numberingXml: string|null,
 *   relationships: Map<string, { id: string, type: string, target: string }>,
 *   media: Map<string, string>,
 *   preservedFiles: Map<string, any>
 * }>}
 */
export async function readDocxPackage(input) {
  const zip = await loadDocxZip(input)

  const docFile = zip.file('word/document.xml')
  if (!docFile) {
    throw new Error('Invalid .docx package: word/document.xml not found')
  }
  const documentXml = await docFile.async('text')

  const stylesFile = zip.file('word/styles.xml')
  const stylesXml = stylesFile ? await stylesFile.async('text') : null

  const numFile = zip.file('word/numbering.xml')
  const numberingXml = numFile ? await numFile.async('text') : null

  const relationships = await readRelationships(zip)
  const media = await readMediaFiles(zip)

  // Collect preserved auxiliary parts (headers, footers, settings, customXml, theme)
  const preservedFiles = new Map()
  zip.forEach((path, entry) => {
    if (
      path.startsWith('word/header') ||
      path.startsWith('word/footer') ||
      path === 'word/settings.xml' ||
      path.startsWith('word/theme/') ||
      path.startsWith('customXml/')
    ) {
      preservedFiles.set(path, entry)
    }
  })

  return {
    zip,
    documentXml,
    stylesXml,
    numberingXml,
    relationships,
    media,
    preservedFiles,
  }
}
