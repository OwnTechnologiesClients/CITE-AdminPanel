import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import TaskForm from "@/components/admin/forms/TaskForm";

// Mock data - replace with actual API call
async function getTask(id) {
  return {
    id: id,
    title: "Complete Math Homework",
    assignedTo: "Emma Johnson",
    assignedBy: "John Doe",
    family: "Doe Family",
    type: "Kid Task",
    status: "pending",
    dueDate: "2024-12-10",
    coins: 50,
    description: "Complete all math problems on page 45-46",
  };
}

export default async function EditTaskPage({ params }) {
  const { id } = await params;
  const task = await getTask(id);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/admin/tasks/${id}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="size-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Task</h1>
          <p className="text-muted-foreground mt-2">
            Update task information
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Task Information</CardTitle>
          <CardDescription>
            Update the details for this task
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TaskForm initialData={task} />
        </CardContent>
      </Card>
    </div>
  );
}

