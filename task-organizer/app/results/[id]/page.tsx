"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Loader2, Calendar, Flag, LinkIcon, Download, Home } from "lucide-react"
import Link from "next/link"

interface Task {
  description: string
  deadline: string | null
  priority: string
  dependencies: string[]
}

interface Team {
  name: string
  tasks: Task[]
}

interface AnalysisResult {
  teams: Team[]
}

export default function ResultsPage() {
  const params = useParams()
  const id = params.id as string

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [transcription, setTranscription] = useState<string>("")
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)

  useEffect(() => {
    // In a real application, you would fetch the results from your API
    // For this example, we'll simulate fetching the results

    // Simulating API call delay
    const timer = setTimeout(() => {
      // This is where you would normally fetch the data
      // For demo purposes, we're using the data passed in the URL
      // In a real app, you'd fetch from an API endpoint

      // Simulated data for demonstration
      const mockData = {
        transcription:
          "Let's assign tasks for our new product launch. Sarah, I need you to work on the landing page design by next Friday. It's high priority. John, can you handle the backend API development? That needs to be done before the frontend team can start their work. Marketing team needs to prepare social media assets and a press release by the end of the month. Emily, please coordinate with the QA team to set up testing protocols. We should also have someone from the DevOps team prepare the deployment pipeline.",
        analysis: {
          teams: [
            {
              name: "Design",
              tasks: [
                {
                  description: "Create landing page design",
                  deadline: "Next Friday",
                  priority: "High",
                  dependencies: [],
                },
              ],
            },
            {
              name: "Development",
              tasks: [
                {
                  description: "Backend API development",
                  deadline: null,
                  priority: "Medium",
                  dependencies: [],
                },
                {
                  description: "Frontend implementation",
                  deadline: null,
                  priority: "Medium",
                  dependencies: ["Backend API development"],
                },
              ],
            },
            {
              name: "Marketing",
              tasks: [
                {
                  description: "Prepare social media assets",
                  deadline: "End of the month",
                  priority: "Medium",
                  dependencies: [],
                },
                {
                  description: "Write press release",
                  deadline: "End of the month",
                  priority: "Medium",
                  dependencies: [],
                },
              ],
            },
            {
              name: "QA",
              tasks: [
                {
                  description: "Set up testing protocols",
                  deadline: null,
                  priority: "Medium",
                  dependencies: [],
                },
              ],
            },
            {
              name: "DevOps",
              tasks: [
                {
                  description: "Prepare deployment pipeline",
                  deadline: null,
                  priority: "Medium",
                  dependencies: [],
                },
              ],
            },
          ],
        },
      }

      setTranscription(mockData.transcription)
      setAnalysis(mockData.analysis)
      setLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
    }
  }

  const exportToCSV = () => {
    if (!analysis) return

    let csv = "Team,Task,Deadline,Priority,Dependencies\n"

    analysis.teams.forEach((team) => {
      team.tasks.forEach((task) => {
        const deadline = task.deadline || "N/A"
        const dependencies = task.dependencies.length ? task.dependencies.join("; ") : "None"
        csv += `"${team.name}","${task.description}","${deadline}","${task.priority}","${dependencies}"\n`
      })
    })

    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.setAttribute("hidden", "")
    a.setAttribute("href", url)
    a.setAttribute("download", `tasks-${id}.csv`)
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
        <Card className="w-full max-w-3xl">
          <CardContent className="flex flex-col items-center justify-center p-12">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-lg font-medium">Analyzing conversation...</p>
            <p className="text-sm text-muted-foreground">This may take a moment</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
        <Card className="w-full max-w-3xl">
          <CardContent className="flex flex-col items-center justify-center p-12">
            <p className="text-lg font-medium text-red-600">Error: {error}</p>
            <Button asChild className="mt-4">
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
      <Card className="w-full max-w-5xl">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl font-bold">Task Analysis Results</CardTitle>
              <CardDescription>Tasks extracted and categorized by team</CardDescription>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Home
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="tasks">
            <TabsList className="mb-4">
              <TabsTrigger value="tasks">Categorized Tasks</TabsTrigger>
              <TabsTrigger value="transcription">Transcription</TabsTrigger>
            </TabsList>

            <TabsContent value="tasks">
              {analysis && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {analysis.teams.map((team, teamIndex) => (
                    <Card key={teamIndex}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{team.name} Team</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-3">
                          {team.tasks.map((task, taskIndex) => (
                            <li key={taskIndex} className="border rounded-md p-3">
                              <p className="font-medium">{task.description}</p>
                              <div className="flex flex-wrap gap-2 mt-2">
                                {task.deadline && (
                                  <Badge variant="outline" className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {task.deadline}
                                  </Badge>
                                )}
                                <Badge
                                  variant="outline"
                                  className={`flex items-center gap-1 ${getPriorityColor(task.priority)}`}
                                >
                                  <Flag className="h-3 w-3" />
                                  {task.priority}
                                </Badge>
                                {task.dependencies.length > 0 && (
                                  <Badge variant="outline" className="flex items-center gap-1">
                                    <LinkIcon className="h-3 w-3" />
                                    {task.dependencies.join(", ")}
                                  </Badge>
                                )}
                              </div>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="transcription">
              <Card>
                <CardContent className="pt-6">
                  <p className="whitespace-pre-wrap">{transcription}</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button onClick={exportToCSV} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export to CSV
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

