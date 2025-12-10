import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import UserForm from "@/components/admin/forms/UserForm";

// Mock data - replace with actual API call
async function getUser(id) {
  return {
    id: id,
    name: "John Doe",
    email: "john.doe@example.com",
    role: "Parent",
    family: "Doe Family",
    status: "active",
    phone: "+1 234 567 8900",
  };
}

export default async function EditUserPage({ params }) {
  const { id } = await params;
  const user = await getUser(id);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/admin/users/${id}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="size-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit User</h1>
          <p className="text-muted-foreground mt-2">
            Update user information
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Information</CardTitle>
          <CardDescription>
            Update the details for this user
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UserForm initialData={user} />
        </CardContent>
      </Card>
    </div>
  );
}

