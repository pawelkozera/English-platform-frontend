import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AddLessonToGroup } from './lessons/addLessonToGroup'
import { CreateGroup } from "./group/createGroup"

import { TaskCreator } from "./taskCreator/taskCreator"
import { AddLesson } from "./lessons/addLesson"
import { AddWord } from "./words/addWord"
import { TestCreator } from "./tests/testCreator"
import { LaunchTest } from "./tests/launchTest"

export function GroupManagementOwnedGroups() {
  return (
    <Tabs defaultValue="createGroup" className="w-full max-w-4xl mx-auto">
      <TabsList className="grid w-full grid-cols-7">
        <TabsTrigger value="createGroup">Create group</TabsTrigger>
        <TabsTrigger value="addTask">Task creator</TabsTrigger>
        <TabsTrigger value="addWord">Create word</TabsTrigger>
        <TabsTrigger value="addLesson">Create lesson</TabsTrigger>
        <TabsTrigger value="addLessonToGroup">Add lesson to group</TabsTrigger>
        <TabsTrigger value="createTestTemplate">Create test</TabsTrigger>
        <TabsTrigger value="launchTest">Launch test</TabsTrigger>
      </TabsList>
      <TabsContent value="createGroup">
        <CreateGroup />
      </TabsContent>
      <TabsContent value="addTask">
        <TaskCreator />
      </TabsContent>
      <TabsContent value="addWord">
        <AddWord />
      </TabsContent>
      <TabsContent value="addLesson">
        <AddLesson />
      </TabsContent>
      <TabsContent value="addLessonToGroup">
        <AddLessonToGroup />
      </TabsContent>
      <TabsContent value="createTestTemplate">
        <TestCreator />
      </TabsContent>
      <TabsContent value="launchTest">
        <LaunchTest />
      </TabsContent>
    </Tabs>
  )
}