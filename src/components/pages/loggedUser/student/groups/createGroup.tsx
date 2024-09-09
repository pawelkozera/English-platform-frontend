import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CreateGroupForm } from "./createGroupForm"
import { useUser } from '@/components/utils/UserContext';

export function CreateGroup() {
	const { groups, selectedGroup, setSelectedGroup } = useUser();

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
								{groups.map((group) => (
									<div key={group.id} className="flex justify-between items-center mb-2">
									<span>{group.groupName}</span>
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
						{selectedGroup && (
							<>
								<p>Name: {selectedGroup.groupName}</p>
							</>
						)}
						</CardContent>
					</Card>
        </div>
			</CardContent>
    </Card>
  )
}