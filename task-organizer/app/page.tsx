// pages/index.tsx

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Mic, Upload, Loader2 } from "lucide-react"
import AudioRecorder from "@/components/audio-recorder"
import AudioUploader from "@/components/audio-uploader"
import { useRouter } from "next/navigation"
import TaskList from "@/components/TaskList" // Import the TaskList component

export default function Home() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [tasks, setTasks] = useState<string[]>([])
  const router = useRouter()

  const handleAudioCaptured = (blob: Blob) => {
    setAudioBlob(blob)
  }

  const handleProcessAudio = async () => {
    if (!audioBlob) return

    setIsProcessing(true)

    const formData = new FormData()
    formData.append("audio", audioBlob)

    try {
      const response = await fetch("/api/process-audio", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        const { id, tasks } = await response.json()
        setTasks(tasks)
        router.push(`/results/${id}`)
      } else {
        throw new Error("Failed to process audio")
      }
    } catch (error) {
      console.error("Error processing audio:", error)
      setIsProcessing(false)
    }
  }

  return (
      <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
        <Card className="w-full max-w-3xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Task Organizer</CardTitle>
            <CardDescription>
              Record or upload a conversation where tasks are being delegated, and we'll organize them by team.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="record" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="record">
                  <Mic className="mr-2 h-4 w-4" />
                  Record Audio
                </TabsTrigger>
                <TabsTrigger value="upload">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Audio
                </TabsTrigger>
              </TabsList>
              <TabsContent value="record" className="mt-4">
                <AudioRecorder onAudioCaptured={handleAudioCaptured} />
              </TabsContent>
              <TabsContent value="upload" className="mt-4">
                <AudioUploader onAudioCaptured={handleAudioCaptured} />
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-center">
                <Button
                    onClick={handleProcessAudio}
                    disabled={!audioBlob || isProcessing}
                    className="w-full max-w-xs"
                >
                  {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                  ) : (
                      "Process Conversation"
                  )}
                </Button>
            <Button onClick={() => setTasks([])} className="w-full max-w-xs mt-4">
                Show Tasks
            </Button>
          </CardFooter>
        </Card>
      </main>
  )
}
