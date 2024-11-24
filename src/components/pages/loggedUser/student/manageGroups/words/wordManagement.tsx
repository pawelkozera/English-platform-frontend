import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AddWord } from "./addWord"

export function WordManagement() {
  return (
    <Tabs defaultValue="create" className="w-full max-w-4xl mx-auto">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="create">Create</TabsTrigger>
        <TabsTrigger value="edit">Edit</TabsTrigger>
        <TabsTrigger value="delete">Delete</TabsTrigger>
      </TabsList>
      <TabsContent value="create">
        <AddWord />
      </TabsContent>
      <TabsContent value="edit">
      </TabsContent>
      <TabsContent value="delete">
      </TabsContent>
    </Tabs>
  )
}