import { useState } from 'react'
import { useQuery, useMutation } from 'react-query'
import { fetchTestTemplatesOwnedByUser } from '@/lib/api/testTemplateApi'
import { deleteTestTemplateById } from '@/lib/api/testTemplateApi'
import { TaskResponse } from '@/lib/types'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/hooks/use-toast"
import { useUser } from '@/components/utils/UserContext'

export interface TestTemplateResponse {
  name: string
  id: number
  tasks: TaskResponse[]
}

export function DeleteTest() {
  const [selectedTemplate, setSelectedTemplate] = useState<number | "">("")
	const { selectedGroup } = useUser()

  const { data: templatesData, isLoading: templatesLoading, error: templatesError, refetch } = useQuery({
    queryKey: ['templatesOwnedByUser'],
    queryFn: () => fetchTestTemplatesOwnedByUser(0, 10),
    refetchOnWindowFocus: false,
  })

  const templates: TestTemplateResponse[] = templatesData?._embedded?.testTemplateResponseList || []

  const mutation = useMutation(deleteTestTemplateById, {
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: "Test launched successfully!",
      })
      console.log("Test launched", data)
      refetch()
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to launch test. Please try again.",
        variant: "destructive",
      })
      console.error("Error during test launch", error)
    },
  })

  const handleDeleteTest = () => {
		if (!selectedGroup) {
			return;
		}

    if (!selectedTemplate) {
      toast({
        title: "Incomplete Form",
        description: "Please fill in all fields.",
        variant: "destructive",
      })
      return
    }

    mutation.mutate(selectedTemplate);
  }

  if (templatesLoading) return <div className="text-muted-foreground">Loading test templates...</div>
  if (templatesError) return <div className="text-destructive">Error loading test templates</div>

  return (
    <Card className="w-full max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle>Delete Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="template">Test Template</Label>
          <Select value={selectedTemplate.toString()} onValueChange={(value) => setSelectedTemplate(Number(value) || "")}>
            <SelectTrigger id="template">
              <SelectValue placeholder="Select Template" />
            </SelectTrigger>
            <SelectContent>
              {templates.map((template: TestTemplateResponse) => (
                <SelectItem key={template.id} value={template.id.toString()}>
                  {template.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

      </CardContent>
      <CardFooter>
        <Button
          onClick={handleDeleteTest}
          className="w-full"
          disabled={!selectedTemplate}
        >
          Delete Test
        </Button>
      </CardFooter>
    </Card>
  )
}