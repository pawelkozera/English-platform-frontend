import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Link } from "react-router-dom";
import { useUser } from "@/components/utils/UserContext";

export function Content() {
  const { repetitionCounts, selectedGroup } = useUser();

  return (
      <main className="flex-1 p-8 overflow-auto">
        <h2 className="text-3xl font-bold mb-6">Welcome!</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Lessons</CardTitle>
              <CardDescription>Start learning new lessons to improve your skills.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4"></p>
              <Link to={"/lessons"} >
                <Button>Go to lessons</Button>
              </Link>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Vocabulary Review</CardTitle>
              <CardDescription>Words due for repetition</CardDescription>
            </CardHeader>
            <CardContent>
              {selectedGroup && repetitionCounts && repetitionCounts[selectedGroup.id] && repetitionCounts[selectedGroup.id] > 0 ? (
                <>
                  <p className="mb-4">{repetitionCounts[selectedGroup.id]} words waiting for review</p>
                  <Link to={"/repetitions"} >
                    <Button>Start Review</Button>
                  </Link>
                </>
              ) : (
                <>
                  <p className="text-green-500 mb-4">Congratulations!</p>
                  <p className="mb-4">No words waiting for review</p>
                </>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Join a Group</CardTitle>
              <CardDescription>Become a part of a group to start collaborating with others.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4"></p>
              <Link to={"/groups"} >
                <Button>Join Group</Button>
              </Link>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Create a Group</CardTitle>
              <CardDescription>Want to create your own group and invite others? Start here.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4"></p>
              <Link to={"/groupsManagement"} >
                <Button>Create Group</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
  )
}