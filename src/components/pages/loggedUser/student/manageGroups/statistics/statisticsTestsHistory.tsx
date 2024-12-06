import { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from "@/components/utils/UserContext";
import { fetchTestInstancesForGroup } from "@/lib/api/testInstanceApi";
import { fetchTestHistoryForInstanceIdAndGroupId } from "@/lib/api/testHistory";

interface TestInstancesForGroup {
  id: number;
  activationTime: Date;
  endTime: Date;
  name: string;
}

interface TestHistory {
  userId: number;
  userName: string;
  score: number;
  suspiciousActivityDetected: boolean;
  suspiciousActivities: { timestamp: string; description: string; occurrenceCount: number }[];
  totalScore: number;
}

export function StatisticsTestsHistory() {
  const { selectedGroup } = useUser();
  const [selectedTest, setSelectedTest] = useState<number | null>(null);

  const { data: tests, isLoading, error, refetch } = useQuery({
    queryKey: ["testsHistory"],
    queryFn: () => {
      if (!selectedGroup) return;
      return fetchTestInstancesForGroup(selectedGroup.id);
    },
    refetchOnWindowFocus: false,
  });

  const {
    data: testHistory,
    isLoading: historyLoading,
    error: historyError,
  } = useQuery({
    queryKey: ["testHistory", selectedTest],
    queryFn: () => {
      if (!selectedTest || !selectedGroup) return;
      return fetchTestHistoryForInstanceIdAndGroupId(selectedTest, selectedGroup.id);
    },
    enabled: !!selectedTest,
  });

  useEffect(() => {
    if (selectedGroup?.id) {
      refetch();
    }
  }, [selectedGroup?.id, refetch]);

  const handleTestClick = (testId: number) => {
    setSelectedTest((prev) => (prev === testId ? null : testId));
  };

  if (isLoading) return <p>Loading tests...</p>;
  if (error) return <p>Failed to load tests.</p>;

  return (
    <div className="w-full max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Tests</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tests?.map((test: TestInstancesForGroup) => (
          <Card
            key={test.id}
            className={`cursor-pointer ${
              selectedTest === test.id ? "border border-primary" : ""
            }`}
            onClick={() => handleTestClick(test.id)}
          >
            <CardHeader>
              <CardTitle>{test.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                <strong>Activation:</strong>{" "}
                {new Date(test.activationTime).toLocaleString()}
              </p>
              <p>
                <strong>End:</strong> {new Date(test.endTime).toLocaleString()}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedTest && (
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-4">Test Details</h2>
          {historyLoading ? (
            <p>Loading test history...</p>
          ) : historyError ? (
            <p>Failed to load test history.</p>
          ) : (
            <div>
              {testHistory?.map((entry: TestHistory) => (
                <div key={entry.userId} className="border-b pb-4 mb-4">
                  <p>
                    <strong>User:</strong> {entry.userName}
                  </p>
                  <p>
                    <strong>Score:</strong> {entry.score} / {entry.totalScore}
                  </p>
                  <p>
                    <strong>Suspicious Activity:</strong>{" "}
                    {entry.suspiciousActivityDetected ? "Yes" : "No"}
                  </p>
                  {entry.suspiciousActivityDetected && (
                    <ul className="mt-2">
                      {entry.suspiciousActivities.map((activity, index) => (
                        <li key={index} className="mb-4">
                          <strong>Time:</strong> {new Date(activity.timestamp).toLocaleString()}
                          <p>
                            <strong>Description:</strong>{" "}
                            {(() => {
                              switch (activity.description) {
                                case "WINDOW_RESIZE":
                                  return "Window resize detected.";
                                case "VISIBILITY_HIDDEN":
                                  return "User hidden the window.";
                                case "PAGE_TRANSLATION":
                                  return "Page translation detected.";
                                case "IDLE_TIMEOUT":
                                  return "User was idle for too long.";
                                case "WINDOW_FOCUS_LOST":
                                  return "Window focus lost (user clicked outside the window).";
                                default:
                                  return activity.description;
                              }
                            })()}{" "}
                            ({activity.occurrenceCount} occurrence
                            {activity.occurrenceCount > 1 ? "s" : ""})
                          </p>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}