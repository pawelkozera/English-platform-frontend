import { useState, useEffect } from "react"
import { useQuery } from "react-query"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { fetchLessonsForDisplay } from "@/lib/api/lessonApi"
import { useUser } from "@/components/utils/UserContext"
import { Pagination } from "@/components/common/pagination"
import { useNavigate } from 'react-router-dom';

interface LessonDisplay {
  lessonId: number
  title: string
  completedTasks: number
  totalTasks: number
}

export function LessonsDisplay() {
  const { selectedGroup } = useUser()
  const [page, setPage] = useState(0)
  const pageSize = 25
  const navigate = useNavigate(); 

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["lessons", page],
    queryFn: () => { 
      if (!selectedGroup) return
      return fetchLessonsForDisplay(selectedGroup.id, page, pageSize)
    },
    refetchOnWindowFocus: false,
  })

  useEffect(() => {
    if (selectedGroup?.id) {
      setPage(0)
      refetch()
    }
  }, [selectedGroup?.id, refetch])

  const lessons: LessonDisplay[] = data?._embedded?.lessonsDisplayResponseList || []
  const totalPages = data?.page?.totalPages || 1

  if (isLoading) return <div className="flex justify-center items-center h-64">Loading...</div>
  if (error) return <div className="text-center text-red-500">Error loading lessons</div>

  const handleLessonClick = (lessonId: number) => {
    navigate(`/lessons/${lessonId}`);
  };

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

      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  )
}
