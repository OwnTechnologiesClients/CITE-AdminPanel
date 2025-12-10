import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, User, Calendar, Coins, CheckCircle2, Clock } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// Mock data - replace with actual API call
async function getTask(id) {
  return {
    id: id,
    title: "Complete Math Homework",
    assignedTo: "Emma Johnson",
    assignedBy: "John Doe",
    family: "Doe Family",
    type: "Kid Task",
    status: "completed",
    dueDate: "2024-12-10",
    completedDate: "2024-12-09",
    coins: 50,
    description: "Complete all math problems on page 45-46",
  };
}

export default async function ViewTaskPage({ params }) {
  const { id } = await params;
  const task = await getTask(id);

  const statusConfig = {
    completed: { label: "Completed", icon: CheckCircle2, variant: "default", color: "text-green-600" },
    in_progress: { label: "In Progress", icon: Clock, variant: "secondary", color: "text-blue-600" },
    pending: { label: "Pending", icon: Clock, variant: "outline", color: "text-yellow-600" },
  };

  const status = statusConfig[task.status] || statusConfig.pending;
  const StatusIcon = status.icon;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/tasks">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="size-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Task Details</h1>
            <p className="text-muted-foreground mt-2">
              View and manage task information
            </p>
          </div>
        </div>
        <Link href={`/admin/tasks/${id}/edit`}>
          <Button>
            <Edit className="mr-2 size-4" />
            Edit Task
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>{task.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-3">
              <Badge variant={status.variant} className="gap-1">
                <StatusIcon className={`size-3 ${status.color}`} />
                {status.label}
              </Badge>
              <Badge variant="outline">{task.type}</Badge>
            </div>

            <Separator />

            {task.description && (
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground">{task.description}</p>
              </div>
            )}

            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center gap-3">
                <User className="size-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Assigned To</p>
                  <p className="font-medium">{task.assignedTo}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <User className="size-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Assigned By</p>
                  <p className="font-medium">{task.assignedBy}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="size-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Due Date</p>
                  <p className="font-medium">{new Date(task.dueDate).toLocaleDateString()}</p>
                </div>
              </div>
              {task.completedDate && (
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="size-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Completed Date</p>
                    <p className="font-medium">{new Date(task.completedDate).toLocaleDateString()}</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Task Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Family</p>
              <p className="font-medium">{task.family}</p>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted">
              <div className="flex items-center gap-3">
                <Coins className="size-5 text-yellow-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Reward</p>
                  <p className="text-2xl font-bold">{task.coins} coins</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

