import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TaskCreator } from "./taskCreator"
import { TaskDelete } from "./taskDelete"

export function TaskManagement() {
  return (
    <Tabs defaultValue="create" className="w-full max-w-4xl mx-auto">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="create">Create</TabsTrigger>
        <TabsTrigger value="delete">Delete</TabsTrigger>
      </TabsList>
      <TabsContent value="create">
        <TaskCreator />
      </TabsContent>
      <TabsContent value="delete">
        <TaskDelete />
      </TabsContent>
    </Tabs>
  )
}