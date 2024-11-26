import { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useUser } from "@/components/utils/UserContext"
import { Send } from "./send/send";
import { Received } from "./receive/received";

export function AnnouncementsManagement() {
  const {selectedGroup} = useUser();

  const [activeTab, setActiveTab] = useState("received");

  useEffect(() => {
    if (!selectedGroup?.owner) {
      setActiveTab("received");
    }
  }, [selectedGroup]);

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-4xl mx-auto">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="received">Received Announcements</TabsTrigger>
        <TabsTrigger value="send" disabled={!selectedGroup?.owner}>Send Announcement</TabsTrigger>
      </TabsList>
      <TabsContent value="received">
				<Received />
      </TabsContent>
      <TabsContent value="send">
				<Send />
      </TabsContent>
    </Tabs>
  )
}