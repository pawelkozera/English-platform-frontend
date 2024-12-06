import { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CreateGroup } from "./group/createGroup"
import { TaskManagement } from "./taskCreator/taskManagement"
import { WordManagement } from "./words/wordManagement"
import { LessonManagement } from "./lessons/lessonManagement"
import { TestsManagement } from "./tests/testsManagement"
import { useUser } from "@/components/utils/UserContext"
import { StatisticsManagement } from "./statistics/statisticsManagement"

export function GroupManagement() {
  const {selectedGroup} = useUser();

  const [activeTab, setActiveTab] = useState("create");

  useEffect(() => {
    if (!selectedGroup?.owner) {
      setActiveTab("create");
    }
  }, [selectedGroup]);

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-4xl mx-auto">
      <TabsList className="grid w-full grid-cols-6">
        <TabsTrigger value="create">Create Group</TabsTrigger>
        <TabsTrigger value="statistics" disabled={!selectedGroup?.owner}>Statistics</TabsTrigger>
        <TabsTrigger value="tasks" disabled={!selectedGroup?.owner}>Manage Tasks</TabsTrigger>
        <TabsTrigger value="words" disabled={!selectedGroup?.owner}>Manage Words</TabsTrigger>
        <TabsTrigger value="lessons" disabled={!selectedGroup?.owner}>Manage Lessons</TabsTrigger>
        <TabsTrigger value="tests" disabled={!selectedGroup?.owner}>Manage Tests</TabsTrigger>
      </TabsList>
      <TabsContent value="create">
        <CreateGroup />
      </TabsContent>
      <TabsContent value="statistics">
        <StatisticsManagement />
      </TabsContent>
      <TabsContent value="tasks">
        <TaskManagement />
      </TabsContent>
      <TabsContent value="words">
        <WordManagement />
      </TabsContent>
      <TabsContent value="lessons">
        <LessonManagement />
      </TabsContent>
      <TabsContent value="tests">
        <TestsManagement />
      </TabsContent>
    </Tabs>
  )
}