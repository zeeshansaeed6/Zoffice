/**
 * ZNotes audio block — displays and plays recorded audio.
 */

import React, { useState, useMemo, useRef, useCallback } from 'react'
import { Mic, Square, Play, Pause } from 'lucide-react'
import { formatDuration } from '../core/audio-recorder.js'

/**
 * Audio block — record and play back audio clips.
 * @param {Object} props
 * @param {import('../core/notebook-model.js').Block} props.block
 * @param {boolean} props.isActive
 * @param {(updates: Object) => void} props.onUpdate
 */
export function AudioBlock({ block, isActive: _isActive, onUpdate }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const audioRef = useRef(null)
  const recorderRef = useRef(null)
  const timerRef = useRef(null)
  const chunksRef = useRef([])

  const data = useMemo(() => {
    try {
      return JSON.parse(block.content)
    } catch {
      return { dataUrl: '', duration: 0 }
    }
  }, [block.content])

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' })
      chunksRef.current = []

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        const reader = new FileReader()
        reader.onloadend = () => {
          onUpdate({
            content: JSON.stringify({
              dataUrl: reader.result,
              duration: elapsed,
              timestamp: Date.now(),
            }),
          })
        }
        reader.readAsDataURL(blob)
        stream.getTracks().forEach((t) => t.stop())
      }

      recorderRef.current = recorder
      recorder.start(100)
      setIsRecording(true)
      setElapsed(0)

      const start = Date.now()
      timerRef.current = setInterval(() => {
        setElapsed((Date.now() - start) / 1000)
      }, 200)
    } catch {
      // Microphone access denied
    }
  }, [elapsed, onUpdate])

  const stopRecording = useCallback(() => {
    if (recorderRef.current?.state === 'recording') {
      recorderRef.current.stop()
    }
    clearInterval(timerRef.current)
    setIsRecording(false)
  }, [])

  const togglePlay = useCallback(() => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }, [isPlaying])

  if (!data.dataUrl) {
    return (
      <div className="flex items-center gap-3 px-3 py-3" data-testid="audio-block">
        <Mic size={16} className="text-violet-500" />
        {isRecording ? (
          <>
            <div className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
            <span className="text-xs font-medium text-red-500">{formatDuration(elapsed)}</span>
            <button
              type="button"
              onClick={stopRecording}
              className="rounded bg-red-500 p-1 text-white hover:bg-red-600"
            >
              <Square size={12} />
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={startRecording}
            className="rounded bg-violet-600 px-3 py-1 text-xs font-medium text-white hover:bg-violet-700"
          >
            Record Audio
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3 px-3 py-3" data-testid="audio-block">
      <button
        type="button"
        onClick={togglePlay}
        className="rounded-full bg-violet-600 p-1.5 text-white hover:bg-violet-700"
      >
        {isPlaying ? <Pause size={12} /> : <Play size={12} />}
      </button>
      <span className="text-xs text-neutral-500">🎙️ {formatDuration(data.duration || 0)}</span>
      <audio ref={audioRef} src={data.dataUrl} onEnded={() => setIsPlaying(false)} />
    </div>
  )
}
