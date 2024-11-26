import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon } from 'lucide-react'

interface AnnouncementProps {
  title: string
  content: string
  date: string
  variant?: "default" | "important"
}

export function Announcement({ title, content, date, variant = "default" }: AnnouncementProps) {
  return (
    <Card className={`${variant === "important" ? "border-red-500" : ""}`}>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>{title}</CardTitle>
          {variant === "important" && <Badge variant="destructive">Important</Badge>}
        </div>
      </CardHeader>
      <CardContent>
        <p>{content}</p>
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        <CalendarIcon className="w-4 h-4 mr-2" />
        {date}
      </CardFooter>
    </Card>
  )
}