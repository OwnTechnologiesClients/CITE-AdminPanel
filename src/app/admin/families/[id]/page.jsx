"use client";

import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { sampleFamily } from "@/lib/sampleData/families";
import FamilyInfoTab from "@/components/admin/tabs/family/FamilyInfoTab";
import FamilyEventsTab from "@/components/admin/tabs/family/FamilyEventsTab";
import FamilyMealsTab from "@/components/admin/tabs/family/FamilyMealsTab";
import FamilyListsTab from "@/components/admin/tabs/family/FamilyListsTab";
import FamilyMediaTab from "@/components/admin/tabs/family/FamilyMediaTab";
import FamilyCalendarTab from "@/components/admin/tabs/family/FamilyCalendarTab";
import FamilyTrackerTab from "@/components/admin/tabs/family/FamilyTrackerTab";
import FamilyRecipesTab from "@/components/admin/tabs/family/FamilyRecipesTab";

export default function FamilyDetailPage() {
  const params = useParams();
  const familyId = parseInt(params.id);
  const family = sampleFamily; // In real app, fetch by familyId

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/families">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="size-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{family.name}</h1>
          <p className="text-muted-foreground mt-2">
            View and manage family information
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Family Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="info" className="w-full">
            <TabsList>
              <TabsTrigger value="info">Info</TabsTrigger>
              <TabsTrigger value="events">Events ({family.events.length})</TabsTrigger>
              <TabsTrigger value="meals">Meals ({family.meals.length})</TabsTrigger>
              <TabsTrigger value="recipes">Recipes ({family.recipes.length})</TabsTrigger>
              <TabsTrigger value="lists">Lists ({family.lists.length})</TabsTrigger>
              <TabsTrigger value="media">Media</TabsTrigger>
              <TabsTrigger value="calendar">Calendar</TabsTrigger>
              <TabsTrigger value="tracker">Tracker</TabsTrigger>
            </TabsList>

            <TabsContent value="info" className="mt-6">
              <FamilyInfoTab family={family} />
            </TabsContent>

            <TabsContent value="events" className="mt-6">
              <FamilyEventsTab events={family.events} />
            </TabsContent>

            <TabsContent value="meals" className="mt-6">
              <FamilyMealsTab meals={family.meals} />
            </TabsContent>

            <TabsContent value="recipes" className="mt-6">
              <FamilyRecipesTab recipes={family.recipes} />
            </TabsContent>

            <TabsContent value="lists" className="mt-6">
              <FamilyListsTab lists={family.lists} />
            </TabsContent>

            <TabsContent value="media" className="mt-6">
              <FamilyMediaTab media={family.media} />
            </TabsContent>

            <TabsContent value="calendar" className="mt-6">
              <FamilyCalendarTab 
                events={family.events} 
                meals={family.meals} 
                lists={family.lists} 
              />
            </TabsContent>

            <TabsContent value="tracker" className="mt-6">
              <FamilyTrackerTab tracker={family.tracker} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
