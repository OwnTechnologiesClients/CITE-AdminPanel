"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FamilyInfoTab from "@/components/admin/tabs/family/FamilyInfoTab";
import FamilyEventsTab from "@/components/admin/tabs/family/FamilyEventsTab";
import FamilyMealsTab from "@/components/admin/tabs/family/FamilyMealsTab";
import FamilyListsTab from "@/components/admin/tabs/family/FamilyListsTab";
import FamilyMediaTab from "@/components/admin/tabs/family/FamilyMediaTab";
import FamilyCalendarTab from "@/components/admin/tabs/family/FamilyCalendarTab";
import FamilyTrackerTab from "@/components/admin/tabs/family/FamilyTrackerTab";
import FamilyRecipesTab from "@/components/admin/tabs/family/FamilyRecipesTab";
import FamilySchedulesTab from "@/components/admin/tabs/family/FamilySchedulesTab";
import { 
  getFamilyById, 
  getFamilyStats, 
  getFamilyMembers,
  getFamilyEvents,
  getFamilyMeals,
  getFamilyRecipes,
  getFamilyLists,
  getFamilyMedia,
  getFamilyMediaFolders,
  getFamilySchedules
} from "@/lib/api/families";

export default function FamilyDetailPage() {
  const params = useParams();
  const familyId = params.id;
  const [family, setFamily] = useState(null);
  const [stats, setStats] = useState(null);
  const [members, setMembers] = useState([]);
  const [events, setEvents] = useState([]);
  const [meals, setMeals] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [lists, setLists] = useState([]);
  const [media, setMedia] = useState([]);
  const [folders, setFolders] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchFamilyData() {
      try {
        setLoading(true);
        setError(null);

        // Fetch all family data in parallel
        const [familyData, statsData, membersData, eventsData, mealsData, recipesData, listsData, mediaData, foldersData, schedulesData] = await Promise.all([
          getFamilyById(familyId),
          getFamilyStats(familyId).catch(() => null),
          getFamilyMembers(familyId).catch(() => []),
          getFamilyEvents(familyId).catch(() => []),
          getFamilyMeals(familyId).catch(() => []),
          getFamilyRecipes(familyId).catch(() => []),
          getFamilyLists(familyId).catch(() => []),
          getFamilyMedia(familyId).catch(() => []),
          getFamilyMediaFolders(familyId).catch(() => []),
          getFamilySchedules(familyId).catch(() => []),
        ]);

        setFamily(familyData);
        setStats(statsData);
        setMembers(membersData);
        setEvents(eventsData);
        setMeals(mealsData);
        setRecipes(recipesData);
        setLists(listsData);
        setMedia(mediaData);
        setFolders(foldersData);
        setSchedules(schedulesData);
      } catch (err) {
        console.error("Error fetching family data:", err);
        setError(err.message || "Failed to load family data");
      } finally {
        setLoading(false);
      }
    }

    if (familyId) {
      fetchFamilyData();
    }
  }, [familyId]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12 text-muted-foreground">
          <Loader2 className="size-8 animate-spin mx-auto mb-4" />
          <p>Loading family data...</p>
        </div>
      </div>
    );
  }

  if (error || !family) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12 text-destructive">
          {error || "Family not found"}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/families/list">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="size-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{family.name || "Family"}</h1>
          <p className="text-muted-foreground mt-2">
            View family information
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
              <TabsTrigger value="calendar">Calendar</TabsTrigger>
              <TabsTrigger value="events">Events ({events.length})</TabsTrigger>
              <TabsTrigger value="meals">Meals ({meals.length})</TabsTrigger>
              <TabsTrigger value="recipes">Recipes ({recipes.length})</TabsTrigger>
              <TabsTrigger value="lists">Lists ({lists.length})</TabsTrigger>
              <TabsTrigger value="schedules">Timetable ({schedules.length})</TabsTrigger>
              <TabsTrigger value="media">Media ({media.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="info" className="mt-6">
              <FamilyInfoTab 
                family={family} 
                stats={stats}
                members={members}
                eventsCount={events.length}
                mealsCount={meals.length}
                recipesCount={recipes.length}
                listsCount={lists.length}
              />
            </TabsContent>

            <TabsContent value="events" className="mt-6">
              <FamilyEventsTab events={events} />
            </TabsContent>

            <TabsContent value="meals" className="mt-6">
              <FamilyMealsTab meals={meals} />
            </TabsContent>

            <TabsContent value="recipes" className="mt-6">
              <FamilyRecipesTab recipes={recipes} />
            </TabsContent>

            <TabsContent value="lists" className="mt-6">
              <FamilyListsTab lists={lists} />
            </TabsContent>

            <TabsContent value="schedules" className="mt-6">
              <FamilySchedulesTab schedules={schedules} />
            </TabsContent>

            <TabsContent value="media" className="mt-6">
              <FamilyMediaTab media={media} folders={folders} />
            </TabsContent>

            <TabsContent value="calendar" className="mt-6">
              <FamilyCalendarTab 
                familyId={familyId}
                events={events} 
                meals={meals} 
                lists={lists} 
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
