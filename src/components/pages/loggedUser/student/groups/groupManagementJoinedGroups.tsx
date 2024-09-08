import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

const mockGroups = [
  { id: 1, name: 'Math Study Group', members: 15, lessons: 10 },
  { id: 2, name: 'History Club', members: 8, lessons: 5 },
  { id: 3, name: 'Science Enthusiasts', members: 20, lessons: 15 },
]

export function GroupManagementJoinedGroups() {
  const [selectedGroup, setSelectedGroup] = useState(mockGroups[0])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Joined Groups</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex space-x-2">
          <Input placeholder="Enter group code" />
          <Input placeholder="Enter group password" />
          <Button>Join Group</Button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Groups</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[200px]">
                {mockGroups.map((group) => (
                  <div key={group.id} className="flex justify-between items-center mb-2">
                    <span>{group.name}</span>
                    <Button variant="outline" size="sm" onClick={() => setSelectedGroup(group)}>
                      Select
                    </Button>
                  </div>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Group Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Name: {selectedGroup.name}</p>
              <p>Members: {selectedGroup.members}</p>
              <p>Lessons: {selectedGroup.lessons}</p>
              <Button className="mt-4" variant="destructive">Leave Group</Button>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  )
}