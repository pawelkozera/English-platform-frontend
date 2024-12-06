import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LaunchTest } from "./launchTest"
import { TestCreator } from "./testCreator"
import { DeleteTest } from "./deleteTest"

export function TestsManagement() {
  return (
    <Tabs defaultValue="launch" className="w-full max-w-4xl mx-auto">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="launch">Launch</TabsTrigger>
        <TabsTrigger value="create">Create</TabsTrigger>
        <TabsTrigger value="delete">Delete</TabsTrigger>
      </TabsList>
      <TabsContent value="launch">
        <LaunchTest />
      </TabsContent>
      <TabsContent value="create">
        <TestCreator />
      </TabsContent>
      <TabsContent value="delete">
        <DeleteTest />
      </TabsContent>
    </Tabs>
  )
}