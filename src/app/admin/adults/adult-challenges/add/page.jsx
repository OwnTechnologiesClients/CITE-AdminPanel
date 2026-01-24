import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import AdultChallengeForm from "@/components/admin/forms/AdultChallengeForm";

export default function AddAdultChallengePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/adults/adult-challenges">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="size-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add New Adult Challenge</h1>
          <p className="text-muted-foreground mt-2">
            Create a new challenge for adult users
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Challenge Information</CardTitle>
          <CardDescription>
            Enter the details for the new challenge
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AdultChallengeForm />
        </CardContent>
      </Card>
    </div>
  );
}

