import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TestsDisplay } from "./activeTests/testsDisplay"
import { TestsHistoryDisplay } from "./historyTests/testsHistoryDisplay"

export function TestsManagement() {
  return (
    <Tabs defaultValue="active" className="w-full max-w-4xl mx-auto">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="active">Active tests</TabsTrigger>
        <TabsTrigger value="history"> Test history</TabsTrigger>
      </TabsList>
      <TabsContent value="active">
        <TestsDisplay />
      </TabsContent>
      <TabsContent value="history">
        <TestsHistoryDisplay />
      </TabsContent>
    </Tabs>
  )
}