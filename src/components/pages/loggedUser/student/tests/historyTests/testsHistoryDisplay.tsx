import { useState, useEffect } from "react"
import { useQuery } from "react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { fetchTestHistoryForDisplay } from "@/lib/api/testTemplateApi"
import { useUser } from "@/components/utils/UserContext"
import { Pagination } from "@/components/common/pagination"

interface TestHistoryDisplay {
  testName: string
  activationTime: Date
  endTime: Date
  timeDuration: number
  score: number
  totalScore: number
}

export function TestsHistoryDisplay() {
  const { selectedGroup } = useUser()
  const [page, setPage] = useState(0)
  const pageSize = 25

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["tests", page],
    queryFn: () => { 
      if (!selectedGroup) return
      return fetchTestHistoryForDisplay(selectedGroup.id, page, pageSize)
    },
    refetchOnWindowFocus: false,
  })

  useEffect(() => {
    if (selectedGroup?.id) {
      setPage(0)
      refetch()
    }
  }, [selectedGroup?.id, refetch])

  const tests: TestHistoryDisplay[] = data?._embedded?.testHistoryDisplayResponseList || []
  const totalPages = data?.page?.totalPages || 1

  if (isLoading) return <div className="flex justify-center items-center h-64">Loading...</div>
  if (error) return <div className="text-center text-red-500">Error loading lessons</div>

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tests.map((test: TestHistoryDisplay) => (
          <Card
            className="overflow-hidden hover:shadow-md transition-shadow"
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-lg mb-4">{test.testName}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <strong>Start Time:</strong>
                <p className="pb-4"> {new Date(test.activationTime).toLocaleString()} </p>

                <strong>End Time:</strong>
                <p className="pb-4">{new Date(test.endTime).toLocaleString()}</p>

                <strong>Time Duration:</strong>
                <p className="pb-8">{test.timeDuration} minutes</p>

                <strong>Your score:</strong>
                <p>{test.score} / {test.totalScore}</p>
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