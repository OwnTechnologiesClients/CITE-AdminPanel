import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import KidForm from "@/components/admin/forms/KidForm";

export default async function AddKidPage({ searchParams }) {
  const params = await searchParams;
  const parentId = params?.parentId || null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/parents-kids/kids">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="size-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add New Kid</h1>
          <p className="text-muted-foreground mt-2">
            Create a new kid account in the Parents & Kids module
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Kid Information</CardTitle>
          <CardDescription>
            Enter the details for the new kid
            {parentId && " - Parent is pre-selected"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <KidForm parentId={parentId} />
        </CardContent>
      </Card>
    </div>
  );
}

