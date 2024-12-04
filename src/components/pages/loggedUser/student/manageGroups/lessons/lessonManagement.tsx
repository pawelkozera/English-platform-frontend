import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AddLesson } from "./addLesson"
import { AddLessonToGroup } from "./addLessonToGroup"
import { EditLesson } from "./editLesson"

export function LessonManagement() {
  return (
    <Tabs defaultValue="create" className="w-full max-w-4xl mx-auto">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="create">Create</TabsTrigger>
        <TabsTrigger value="add">Add to group</TabsTrigger>
        <TabsTrigger value="edit">Edit</TabsTrigger>
        <TabsTrigger value="delete">Delete</TabsTrigger>
      </TabsList>
      <TabsContent value="create">
        <AddLesson />
      </TabsContent>
      <TabsContent value="add">
        <AddLessonToGroup />
      </TabsContent>
      <TabsContent value="edit">
        <EditLesson />
      </TabsContent>
      <TabsContent value="delete">
      </TabsContent>
    </Tabs>
  )
}