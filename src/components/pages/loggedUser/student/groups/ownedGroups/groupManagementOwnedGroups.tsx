import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AddLessonToGroup } from './addLessonToGroup'
import { CreateGroup } from './createGroup'

import { AddTask } from "./addTask"
import { AddLesson } from "./addLesson"

export function GroupManagementOwnedGroups() {
  return (
    <Tabs defaultValue="createGroup" className="w-full max-w-4xl mx-auto">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="createGroup">Create group</TabsTrigger>
        <TabsTrigger value="addLesson">Add lesson</TabsTrigger>
      </TabsList>
      <TabsContent value="createGroup">
        <CreateGroup />
      </TabsContent>
      <TabsContent value="addLesson">
        <AddLessonToGroup />
        <AddLesson />
        <AddTask />
      </TabsContent>
    </Tabs>
  )
}