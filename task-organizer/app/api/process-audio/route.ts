import { type NextRequest, NextResponse } from "next/server"
import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"

export async function POST(req: NextRequest) {
  try {
    // Process the multipart form data
    const formData = await req.formData()
    const audioFile = formData.get("audio") as File

    if (!audioFile) {
      return NextResponse.json({ error: "No audio file provided" }, { status: 400 })
    }

    // Convert the file to a buffer
    const buffer = Buffer.from(await audioFile.arrayBuffer())

    // Create a unique ID for this processing job
    const processingId = Date.now().toString()

    // Store the audio file temporarily (in a real app, you'd use a proper storage solution)
    // For this example, we'll simulate storage and just process it directly

    // First, transcribe the audio using OpenAI Whisper
    const formDataForOpenAI = new FormData()
    formDataForOpenAI.append("file", new Blob([buffer]), "audio.webm")
    formDataForOpenAI.append("model", "whisper-1")

    const transcriptionResponse = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: formDataForOpenAI,
    })

    if (!transcriptionResponse.ok) {
      const errorData = await transcriptionResponse.json()
      console.error("OpenAI Transcription Error:", errorData)
      return NextResponse.json({ error: "Failed to transcribe audio" }, { status: 500 })
    }

    const { text: transcription } = await transcriptionResponse.json()

    // Now analyze the transcription to extract and categorize tasks
    const prompt = `
      You are a project management assistant. Below is a transcription of a conversation where a project manager is delegating tasks.
      
      Transcription:
      ${transcription}
      
      Please analyze this conversation and:
      1. Extract all tasks being delegated
      2. Categorize each task by the team that should handle it (e.g., Design, Development, Marketing, etc.)
      3. For each task, identify any mentioned deadlines, priorities, or dependencies
      
      Format your response as a JSON object with the following structure:
      {
        "teams": [
          {
            "name": "Team Name",
            "tasks": [
              {
                "description": "Task description",
                "deadline": "Deadline if mentioned, otherwise null",
                "priority": "Priority if mentioned, otherwise 'Medium'",
                "dependencies": ["Any dependencies mentioned"]
              }
            ]
          }
        ]
      }
    `

    const { text: analysisResult } = await generateText({
      model: openai("gpt-4o"),
      prompt,
    })

    // Parse the JSON response
    let parsedResult
    try {
      parsedResult = JSON.parse(analysisResult)
    } catch (error) {
      console.error("Error parsing OpenAI response:", error)
      return NextResponse.json({ error: "Failed to parse task analysis" }, { status: 500 })
    }

    // In a real application, you would store this result in a database
    // For this example, we'll simulate storage by returning the ID
    // that would be used to retrieve the results

    // Store the results in a database or cache (simulated here)
    // In a real app, you'd use a database like MongoDB, PostgreSQL, etc.

    // Return the processing ID that the client can use to fetch results
    return NextResponse.json({
      id: processingId,
      transcription,
      analysis: parsedResult,
    })
  } catch (error) {
    console.error("Error processing audio:", error)
    return NextResponse.json({ error: "Failed to process audio" }, { status: 500 })
  }
}

