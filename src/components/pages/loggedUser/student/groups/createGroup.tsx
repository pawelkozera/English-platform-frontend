import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CreateGroupForm } from "./createGroupForm"

const mockOwnedGroups = [
  { id: 4, name: 'Programming 101', members: 25, lessons: 20 },
  { id: 5, name: 'Literature Circle', members: 12, lessons: 8 },
]

export function CreateGroup() {
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
			</CardContent>
    </Card>
  )
}