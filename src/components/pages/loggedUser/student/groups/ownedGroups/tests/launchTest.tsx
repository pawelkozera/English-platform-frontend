import { useState } from 'react'
import { useQuery, useMutation } from 'react-query'
import { fetchTestTemplatesOwnedByUser } from '@/lib/api/testTemplateApi'
import { launchTest } from '@/lib/api/testInstanceApi'
import { useUser } from '@/components/utils/UserContext'
import { TaskResponse } from '@/lib/types'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/hooks/use-toast"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

export interface TestTemplateResponse {
  name: string
  id: number
  tasks: TaskResponse[]
}

export function LaunchTest() {
  const [selectedTemplate, setSelectedTemplate] = useState<number | "">("")
  const [selectedGroup, setSelectedGroup] = useState<number | null>(null)
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)

  const { groups } = useUser()

  const userGroups = groups.filter(group => group.owner)

  const { data: templatesData, isLoading: templatesLoading, error: templatesError } = useQuery({
    queryKey: ['templatesOwnedByUser'],
    queryFn: () => fetchTestTemplatesOwnedByUser(0, 10),
    refetchOnWindowFocus: false,
  })

  const templates: TestTemplateResponse[] = templatesData?._embedded?.testTemplateResponseList || []

  const mutation = useMutation(launchTest, {
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: "Test launched successfully!",
      })
      console.log("Test launched", data)
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

  const handleLaunchTest = () => {
    if (!selectedTemplate || !selectedGroup || !startDate || !endDate) {
      toast({
        title: "Incomplete Form",
        description: "Please fill in all fields.",
        variant: "destructive",
      })
      return
    }

    mutation.mutate({
      testTemplateId: selectedTemplate,
      groupId: selectedGroup,
      activationTime: startDate.toISOString(),
      endTime: endDate.toISOString(),
    })
  }

  if (templatesLoading) return <div className="text-muted-foreground">Loading test templates...</div>
  if (templatesError) return <div className="text-destructive">Error loading test templates</div>

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Launch Test</CardTitle>
        <CardDescription>Set up and launch a new test for your group</CardDescription>
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

        <div className="space-y-2">
          <Label htmlFor="group">Select Group</Label>
          <Select value={selectedGroup?.toString() || ""} onValueChange={(value) => setSelectedGroup(Number(value))}>
            <SelectTrigger id="group">
              <SelectValue placeholder="Select Group" />
            </SelectTrigger>
            <SelectContent>
              {userGroups.map((group) => (
                <SelectItem key={group.id} value={group.id.toString()}>
                  {group.groupName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="start-date">Start Date and Time</Label>
          <div className="flex flex-col">
            <DatePicker
              selected={startDate}
              onChange={(date: Date | null) => setStartDate(date)}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="dd.MM.yyyy HH:mm"
              className="w-full p-2 border rounded text-foreground bg-background"
              placeholderText="Select start date and time"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="end-date">End Date and Time</Label>
          <div className="flex flex-col">
            <DatePicker
              selected={endDate}
              onChange={(date: Date | null) => setEndDate(date)}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="dd.MM.yyyy HH:mm"
              className="w-full p-2 border rounded text-foreground bg-background"
              placeholderText="Select end date and time"
            />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleLaunchTest}
          className="w-full"
          disabled={!selectedTemplate || !selectedGroup || !startDate || !endDate}
        >
          Launch Test
        </Button>
      </CardFooter>
    </Card>
  )
}