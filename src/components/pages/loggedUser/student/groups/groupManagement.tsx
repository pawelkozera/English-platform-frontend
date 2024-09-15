import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GroupManagementJoinedGroups } from './joinedGroups/groupManagementJoinedGroups'
import { GroupManagementOwnedGroups } from './ownedGroups/groupManagementOwnedGroups'

export function GroupManagement() {
  return (
    <Tabs defaultValue="joined" className="w-full max-w-4xl mx-auto">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="joined">Joined Groups</TabsTrigger>
        <TabsTrigger value="owned">Owned Groups</TabsTrigger>
      </TabsList>
      <TabsContent value="joined">
        <GroupManagementJoinedGroups />
      </TabsContent>
      <TabsContent value="owned">
        <GroupManagementOwnedGroups />
      </TabsContent>
    </Tabs>
  )
}