import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AddLessonToGroup } from './addLessonToGroup'
import { CreateGroup } from './createGroup'

import { TaskCreator } from "./taskCreator/taskCreator"
import { AddLesson } from "./addLesson"
import { AddWord } from "./addWord"

export function GroupManagementOwnedGroups() {
  return (
    <Tabs defaultValue="createGroup" className="w-full max-w-4xl mx-auto">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="createGroup">Create group</TabsTrigger>
        <TabsTrigger value="addTask">Task creator</TabsTrigger>
        <TabsTrigger value="addWord">Create word</TabsTrigger>
        <TabsTrigger value="addLesson">Create lesson</TabsTrigger>
        <TabsTrigger value="addLessonToGroup">Add lesson to group</TabsTrigger>
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
    </Tabs>
  )
}