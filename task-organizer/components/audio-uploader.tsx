"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Upload, Play, X } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface AudioUploaderProps {
  onAudioCaptured: (blob: Blob) => void
}

export default function AudioUploader({ onAudioCaptured }: AudioUploaderProps) {
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [audioURL, setAudioURL] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null)

    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]

      // Check if file is an audio file
      if (!file.type.startsWith("audio/")) {
        setError("Please upload an audio file.")
        return
      }

      setAudioFile(file)

      // Create URL for the audio file
      if (audioURL) {
        URL.revokeObjectURL(audioURL)
      }

      const url = URL.createObjectURL(file)
      setAudioURL(url)

      // Convert File to Blob and pass to parent
      file.arrayBuffer().then((buffer) => {
        const blob = new Blob([buffer], { type: file.type })
        onAudioCaptured(blob)
      })
    }
  }

  const clearFile = () => {
    if (audioURL) {
      URL.revokeObjectURL(audioURL)
    }

    setAudioFile(null)
    setAudioURL(null)

    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const playAudio = () => {
    if (audioURL) {
      const audio = new Audio(audioURL)
      audio.play()
    }
  }

  return (
    <Card className="p-6">
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col items-center space-y-4">
        {!audioFile ? (
          <>
            <input type="file" accept="audio/*" onChange={handleFileChange} className="hidden" ref={fileInputRef} />

            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              className="w-full h-32 border-dashed"
            >
              <div className="flex flex-col items-center">
                <Upload className="h-8 w-8 mb-2" />
                <span>Click to upload audio file</span>
                <span className="text-xs text-muted-foreground mt-1">MP3, WAV, M4A, or WEBM</span>
              </div>
            </Button>
          </>
        ) : (
          <div className="w-full">
            <div className="flex items-center justify-between p-3 border rounded-md">
              <div className="truncate max-w-[200px]">{audioFile.name}</div>

              <div className="flex space-x-2">
                <Button size="sm" variant="ghost" onClick={playAudio}>
                  <Play className="h-4 w-4" />
                </Button>

                <Button size="sm" variant="ghost" onClick={clearFile}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}

