import { useState, useEffect } from "react"
import { useQuery } from "react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { fetchTestInstancesForDisplay } from "@/lib/api/testInstanceApi"
import { useUser } from "@/components/utils/UserContext"
import { Pagination } from "@/components/common/pagination"
import { useNavigate } from 'react-router-dom';

interface TestDisplay {
	testInstanceId: number
  testName: string
  activationTime: Date
	endTime: Date
}

export function TestsDisplay() {
  const { selectedGroup } = useUser()
  const [page, setPage] = useState(0)
  const pageSize = 25
  const navigate = useNavigate(); 

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["tests", page],
    queryFn: () => { 
      if (!selectedGroup) return
      return fetchTestInstancesForDisplay(selectedGroup.id, page, pageSize)
    },
    refetchOnWindowFocus: false,
  })

  useEffect(() => {
    if (selectedGroup?.id) {
      setPage(0)
      refetch()
    }
  }, [selectedGroup?.id, refetch])

  const tests: TestDisplay[] = data?._embedded?.testInstanceDisplayResponseList || []
  const totalPages = data?.page?.totalPages || 1

  if (isLoading) return <div className="flex justify-center items-center h-64">Loading...</div>
  if (error) return <div className="text-center text-red-500">Error loading lessons</div>

  const handleTestClick = (testInstanceId: number) => {
    navigate(`/tests/${testInstanceId}`);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Tests</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tests.map((test: TestDisplay) => (
          <Card
            key={test.testInstanceId}
            className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleTestClick(test.testInstanceId)}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-lg mb-4">{test.testName}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <strong>Start Time:</strong>
                <p className="pb-4"> {new Date(test.activationTime).toLocaleString()} </p>
                <strong>End Time:</strong>
                <p>{new Date(test.endTime).toLocaleString()}</p>
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
