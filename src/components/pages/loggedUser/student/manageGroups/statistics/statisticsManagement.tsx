import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StatisticsTestsHistory } from "./statisticsTestsHistory"

export function StatisticsManagement() {
  return (
    <Tabs defaultValue="tests" className="w-full max-w-4xl mx-auto">
      <TabsList className="grid w-full grid-cols-1">
        <TabsTrigger value="tests">Tests</TabsTrigger>
      </TabsList>
      <TabsContent value="tests">
				<StatisticsTestsHistory	/>
      </TabsContent>
    </Tabs>
  )
}