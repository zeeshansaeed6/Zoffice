/**
 * ZNotes audio recorder — Web Audio API based recording.
 * @module audio-recorder
 */

/**
 * @typedef {Object} AudioRecording
 * @property {string} dataUrl - Base64 data URL of the recording
 * @property {number} duration - Duration in seconds
 * @property {number} timestamp - When the recording was made
 */

/**
 * Create an audio recorder instance.
 * Uses MediaRecorder API if available.
 * @returns {Object}
 */
export function createAudioRecorder() {
  let mediaRecorder = null
  let chunks = []
  let startTime = 0
  let stream = null

  return {
    /**
     * Start recording audio.
     * @returns {Promise<boolean>}
     */
    async start() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' })
        chunks = []
        startTime = Date.now()

        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) chunks.push(e.data)
        }

        mediaRecorder.start(100) // Collect data every 100ms
        return true
      } catch {
        return false
      }
    },

    /**
     * Stop recording and return the audio data.
     * @returns {Promise<AudioRecording|null>}
     */
    async stop() {
      if (!mediaRecorder || mediaRecorder.state === 'inactive') return null

      return new Promise((resolve) => {
        mediaRecorder.onstop = () => {
          const duration = (Date.now() - startTime) / 1000
          const blob = new Blob(chunks, { type: 'audio/webm' })
          const reader = new FileReader()
          reader.onloadend = () => {
            resolve({
              dataUrl: reader.result,
              duration,
              timestamp: Date.now(),
            })
          }
          reader.readAsDataURL(blob)

          // Clean up stream
          if (stream) {
            stream.getTracks().forEach((t) => t.stop())
            stream = null
          }
        }

        mediaRecorder.stop()
      })
    },

    /** Check if currently recording */
    isRecording() {
      return mediaRecorder?.state === 'recording'
    },

    /** Get elapsed time in seconds */
    getElapsedTime() {
      if (!startTime || !mediaRecorder || mediaRecorder.state !== 'recording') return 0
      return (Date.now() - startTime) / 1000
    },

    /** Cancel recording without saving */
    cancel() {
      if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop()
      }
      if (stream) {
        stream.getTracks().forEach((t) => t.stop())
        stream = null
      }
      chunks = []
      startTime = 0
    },
  }
}

/**
 * Format seconds into MM:SS string.
 * @param {number} seconds
 * @returns {string}
 */
export function formatDuration(seconds) {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}
