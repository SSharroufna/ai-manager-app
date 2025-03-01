"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Mic, Square, Play, Loader2, MicOff, RefreshCw } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface AudioRecorderProps {
  onAudioCaptured: (blob: Blob) => void
}

export default function AudioRecorder({ onAudioCaptured }: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [audioURL, setAudioURL] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [permissionStatus, setPermissionStatus] = useState<PermissionState | null>(null)
  const [isCheckingPermission, setIsCheckingPermission] = useState(true)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const streamRef = useRef<MediaStream | null>(null)

  // Check for microphone permission on component mount
  useEffect(() => {
    checkMicrophonePermission()
  }, [])

  // Cleanup function
  useEffect(() => {
    return () => {
      cleanup()
    }
  }, [])

  const cleanup = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
    if (audioURL) {
      URL.revokeObjectURL(audioURL)
    }
    stopMediaTracks()
  }

  const checkMicrophonePermission = async () => {
    setIsCheckingPermission(true)
    setError(null)

    try {
      // First try to get the actual microphone stream
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      stream.getTracks().forEach((track) => track.stop()) // Stop the stream immediately
      setPermissionStatus("granted")

      // Also set up the permission change listener
      if (navigator.permissions && navigator.permissions.query) {
        const result = await navigator.permissions.query({ name: "microphone" as PermissionName })

        result.addEventListener("change", () => {
          setPermissionStatus(result.state)
          if (result.state === "denied") {
            setError("Microphone access was denied. Please enable it in your browser settings.")
            stopRecording()
          }
        })
      }
    } catch (err) {
      console.error("Error checking microphone permission:", err)
      if (err instanceof DOMException) {
        if (err.name === "NotAllowedError") {
          setPermissionStatus("denied")
          setError("Microphone access was denied. Please enable it in your browser settings.")
        } else if (err.name === "NotFoundError") {
          setError("No microphone found. Please connect a microphone and try again.")
        } else {
          setError("Error accessing microphone: " + err.message)
        }
      } else {
        setError("Could not access microphone. Please check your device settings.")
      }
    } finally {
      setIsCheckingPermission(false)
    }
  }

  const stopMediaTracks = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
  }

  const requestMicrophoneAccess = async () => {
    setError(null)
    setIsCheckingPermission(true)

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      stream.getTracks().forEach((track) => track.stop())
      await checkMicrophonePermission()
      return true
    } catch (err) {
      console.error("Error requesting microphone access:", err)
      if (err instanceof DOMException && err.name === "NotAllowedError") {
        setError("Microphone access was denied. Please enable it in your browser settings and refresh the page.")
      } else {
        setError("Could not access microphone. Please ensure your device has a working microphone.")
      }
      return false
    } finally {
      setIsCheckingPermission(false)
    }
  }

  const startRecording = async () => {
    setError(null)
    chunksRef.current = []

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      })

      streamRef.current = stream
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: "audio/webm;codecs=opus",
      })

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data)
        }
      }

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" })
        const url = URL.createObjectURL(audioBlob)
        setAudioURL(url)
        onAudioCaptured(audioBlob)
        stopMediaTracks()
      }

      mediaRecorderRef.current.onerror = (event) => {
        console.error("MediaRecorder error:", event)
        setError("An error occurred while recording. Please try again.")
        stopRecording()
      }

      mediaRecorderRef.current.start()
      setIsRecording(true)
      setRecordingTime(0)

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)
    } catch (err) {
      console.error("Error starting recording:", err)
      if (err instanceof DOMException) {
        switch (err.name) {
          case "NotAllowedError":
            setError("Microphone access was denied. Please enable it in your browser settings and refresh the page.")
            setPermissionStatus("denied")
            break
          case "NotFoundError":
            setError("No microphone found. Please connect a microphone and try again.")
            break
          case "NotReadableError":
            setError("Could not access your microphone. Please check if another application is using it.")
            break
          default:
            setError(`Could not start recording: ${err.message}`)
        }
      } else {
        setError("Could not start recording. Please check your microphone connection and try again.")
      }
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)

      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }

  const playRecording = () => {
    if (audioURL) {
      const audio = new Audio(audioURL)
      audio.play()
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const retryPermission = async () => {
    cleanup()
    setAudioURL(null)
    setError(null)
    await checkMicrophonePermission()
  }

  if (isCheckingPermission) {
    return (
      <Card className="p-6">
        <div className="flex flex-col items-center justify-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p>Checking microphone access...</p>
        </div>
      </Card>
    )
  }

  if (permissionStatus === "denied") {
    return (
      <Card className="p-6">
        <Alert variant="destructive">
          <MicOff className="h-4 w-4" />
          <AlertTitle>Microphone Access Required</AlertTitle>
          <AlertDescription className="space-y-4">
            <p>Please enable microphone access in your browser settings and refresh the page.</p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={requestMicrophoneAccess}>
                Request Access
              </Button>
              <Button variant="outline" onClick={retryPermission}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Retry
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription className="flex flex-col gap-2">
            {error}
            <Button variant="outline" onClick={retryPermission} className="w-fit">
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col items-center space-y-4">
        <div className="text-4xl font-mono">{formatTime(recordingTime)}</div>

        <div className="flex space-x-4">
          {!isRecording && !audioURL && (
            <Button
              onClick={startRecording}
              variant="default"
              size="lg"
              disabled={permissionStatus === "denied" || isCheckingPermission}
            >
              <Mic className="mr-2 h-4 w-4" />
              Start Recording
            </Button>
          )}

          {isRecording && (
            <Button onClick={stopRecording} variant="destructive" size="lg">
              <Square className="mr-2 h-4 w-4" />
              Stop Recording
            </Button>
          )}

          {audioURL && !isRecording && (
            <>
              <Button onClick={playRecording} variant="outline" size="lg">
                <Play className="mr-2 h-4 w-4" />
                Play
              </Button>

              <Button onClick={startRecording} variant="default" size="lg">
                <Mic className="mr-2 h-4 w-4" />
                Record Again
              </Button>
            </>
          )}
        </div>

        {isRecording && (
          <div className="flex items-center mt-2 text-red-500">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Recording in progress...
          </div>
        )}
      </div>
    </Card>
  )
}

