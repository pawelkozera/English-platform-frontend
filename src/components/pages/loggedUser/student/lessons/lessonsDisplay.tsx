import { useState } from "react"
import { useQuery } from "react-query"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { fetchLessonsForDisplay } from "@/lib/api/lessonApi"

interface LessonDisplay {
  lessonId: number
  title: string
  completedTasks: number
  totalTasks: number
}

export function LessonsDisplay() {
  const [page, setPage] = useState(0)
  const pageSize = 25

  const { data, isLoading, error } = useQuery({
    queryKey: ["lessons", page],
    queryFn: () => fetchLessonsForDisplay(page, pageSize),
  })

  const lessons: LessonDisplay[] = data?._embedded?.lessonsDisplayResponseList || []
  const totalPages = data?.page?.totalPages || 1

  if (isLoading) return <div className="flex justify-center items-center h-64">Loading...</div>
  if (error) return <div className="text-center text-red-500">Error loading lessons</div>

  const handleLessonClick = (lessonId: number) => {
    console.log("Lesson clicked:", lessonId)
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Lessons</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {lessons.map((lesson: LessonDisplay) => (
          <Card
            key={lesson.lessonId}
            className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleLessonClick(lesson.lessonId)}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{lesson.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Progress value={lesson.totalTasks > 0 ? (lesson.completedTasks / lesson.totalTasks) * 100 : 0} className="h-2" />
                <p className="text-sm text-muted-foreground">
                  {lesson.completedTasks} of {lesson.totalTasks} tasks completed
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="flex justify-between items-center mt-6">
        <Button
          onClick={() => setPage((p) => Math.max(0, p - 1))}
          disabled={page === 0}
          variant="outline"
          size="sm"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>
        <span className="text-sm text-muted-foreground">
          Page {page + 1} of {totalPages}
        </span>
        <Button
          onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
          disabled={page >= totalPages - 1}
          variant="outline"
          size="sm"
        >
          Next
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}
