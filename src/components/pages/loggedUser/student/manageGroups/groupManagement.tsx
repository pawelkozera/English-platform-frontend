import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CreateGroup } from "./group/createGroup"
import { TaskManagement } from "./taskCreator/taskManagement"
import { WordManagement } from "./words/wordManagement"
import { LessonManagement } from "./lessons/lessonManagement"
import { TestsManagement } from "./tests/testsManagement"

export function GroupManagement() {
  return (
    <Tabs defaultValue="create" className="w-full max-w-4xl mx-auto">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="create">Create Group</TabsTrigger>
        <TabsTrigger value="tasks">Manage Tasks</TabsTrigger>
        <TabsTrigger value="words">Manage Words</TabsTrigger>
        <TabsTrigger value="lessons">Manage Lessons</TabsTrigger>
        <TabsTrigger value="tests">Manage Tests</TabsTrigger>
      </TabsList>
      <TabsContent value="create">
        <CreateGroup />
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