import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CreateGroupForm } from './createGroupForm'

const mockOwnedGroups = [
  { id: 4, name: 'Programming 101', members: 25, lessons: 20 },
  { id: 5, name: 'Literature Circle', members: 12, lessons: 8 },
]

const mockLessons = [
  { id: 1, name: 'Introduction to Algebra' },
  { id: 2, name: 'World War II Overview' },
  { id: 3, name: 'Basic Programming Concepts' },
]

export function GroupManagementOwnedGroups() {
  const [selectedOwnedGroup, setSelectedOwnedGroup] = useState(mockOwnedGroups[0])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Owned Groups</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <CreateGroupForm />
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Owned Groups</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[200px]">
                {mockOwnedGroups.map((group) => (
                  <div key={group.id} className="flex justify-between items-center mb-2">
                    <span>{group.name}</span>
                    <Button variant="outline" size="sm" onClick={() => setSelectedOwnedGroup(group)}>
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
              <p>Name: {selectedOwnedGroup.name}</p>
              <p>Members: {selectedOwnedGroup.members}</p>
              <p>Lessons: {selectedOwnedGroup.lessons}</p>
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Add Lessons to Group</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-2">
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select a lesson" />
                </SelectTrigger>
                <SelectContent>
                  {mockLessons.map((lesson) => (
                    <SelectItem key={lesson.id} value={lesson.id.toString()}>
                      {lesson.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button>Add Lesson</Button>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>        
  )
}