import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function Content() {
  return (
      <main className="flex-1 p-8 overflow-auto">
        <h2 className="text-3xl font-bold mb-6">Welcome!</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Latest Lesson</CardTitle>
              <CardDescription>Continue where you left off</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Lesson 5: Advanced Conversation Techniques</p>
              <Button>Resume Lesson</Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Vocabulary Review</CardTitle>
              <CardDescription>Words due for repetition</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">15 words waiting for review</p>
              <Button>Start Review</Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Popular Game</CardTitle>
              <CardDescription>Improve your skills while having fun</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Word Scramble: Intermediate Level</p>
              <Button>Play Now</Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Your Progress</CardTitle>
              <CardDescription>Track your learning journey</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">You've completed 60% of the course</p>
              <Button>View Details</Button>
            </CardContent>
          </Card>
        </div>
      </main>
  )
}