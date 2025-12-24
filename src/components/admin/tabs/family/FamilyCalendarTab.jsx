"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Calendar as CalendarIcon, Clock, MapPin, User, ChevronLeft, ChevronRight, Utensils, List } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function FamilyCalendarTab({ familyId, events = [], meals = [], lists = [] }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  // Get first day of month and number of days
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();
  
  // Helper function to normalize date format
  const normalizeDate = (dateString) => {
    if (!dateString) return null;
    // Handle both date strings (YYYY-MM-DD) and ISO timestamps
    let dateObj;
    if (dateString.includes('T')) {
      // ISO timestamp - parse directly
      dateObj = new Date(dateString);
    } else {
      // Date string - add time to avoid timezone issues
      dateObj = new Date(dateString + 'T00:00:00');
    }
    if (isNaN(dateObj.getTime())) return null;
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Group all items by date
  const itemsByDate = {};
  
  // Add events
  events.forEach((event) => {
    const dateKey = normalizeDate(event.startDate);
    if (dateKey) {
      if (!itemsByDate[dateKey]) {
        itemsByDate[dateKey] = { events: [], meals: [], lists: [] };
      }
      itemsByDate[dateKey].events.push({ ...event, type: 'event' });
    }
  });
  
  // Add meals
  meals.forEach((meal) => {
    const dateKey = normalizeDate(meal.date);
    if (dateKey) {
      if (!itemsByDate[dateKey]) {
        itemsByDate[dateKey] = { events: [], meals: [], lists: [] };
      }
      itemsByDate[dateKey].meals.push({ ...meal, type: 'meal' });
    }
  });
  
  // Add lists
  lists.forEach((list) => {
    const dateKey = normalizeDate(list.createdAt);
    if (dateKey) {
      if (!itemsByDate[dateKey]) {
        itemsByDate[dateKey] = { events: [], meals: [], lists: [] };
      }
      itemsByDate[dateKey].lists.push({ ...list, type: 'list' });
    }
  });
  
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  
  // Generate year options (current year ± 5 years)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);
  
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };
  
  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };
  
  const handleMonthChange = (selectedMonth) => {
    setCurrentDate(new Date(year, parseInt(selectedMonth), 1));
  };
  
  const handleYearChange = (selectedYear) => {
    setCurrentDate(new Date(parseInt(selectedYear), month, 1));
  };
  
  const formatDateKey = (day) => {
    const date = new Date(year, month, day);
    const yearStr = date.getFullYear();
    const monthStr = String(date.getMonth() + 1).padStart(2, '0');
    const dayStr = String(date.getDate()).padStart(2, '0');
    return `${yearStr}-${monthStr}-${dayStr}`;
  };
  
  const getItemsForDay = (day) => {
    const dateKey = formatDateKey(day);
    return itemsByDate[dateKey] || { events: [], meals: [], lists: [] };
  };
  
  const getTotalItemsForDay = (day) => {
    const items = getItemsForDay(day);
    return items.events.length + items.meals.length + items.lists.length;
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="size-5" />
              Calendar
            </CardTitle>
            <div className="flex items-center gap-3">
              {/* Month Selector */}
              <Select value={month.toString()} onValueChange={handleMonthChange}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue>{monthNames[month]}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {monthNames.map((name, index) => (
                    <SelectItem key={index} value={index.toString()}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {/* Year Selector */}
              <Select value={year.toString()} onValueChange={handleYearChange}>
                <SelectTrigger className="w-[100px]">
                  <SelectValue>{year}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {years.map((y) => (
                    <SelectItem key={y} value={y.toString()}>
                      {y}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {/* Month Navigation Buttons */}
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={goToPreviousMonth}>
                  <ChevronLeft className="size-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={goToNextMonth}>
                  <ChevronRight className="size-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-0.5 text-xs">
            {/* Day headers */}
            {dayNames.map((day) => (
              <div key={day} className="p-1.5 text-center text-xs font-semibold text-muted-foreground">
                {day}
              </div>
            ))}
            
            {/* Empty cells for days before month starts */}
            {Array.from({ length: startingDayOfWeek }).map((_, index) => (
              <div key={`empty-${index}`} className="h-16" />
            ))}
            
            {/* Days of the month */}
            {Array.from({ length: daysInMonth }).map((_, index) => {
              const day = index + 1;
              const dayItems = getItemsForDay(day);
              const totalItems = getTotalItemsForDay(day);
              const isToday = 
                new Date().getDate() === day &&
                new Date().getMonth() === month &&
                new Date().getFullYear() === year;
              
              const hasItems = totalItems > 0;
              
              const dayCell = (
                <div
                  className={`h-16 p-1 border rounded cursor-pointer hover:bg-muted transition-colors ${
                    isToday ? "bg-primary/10 border-primary" : "border-border"
                  } ${hasItems ? "bg-blue-50 dark:bg-blue-950/20" : ""}`}
                >
                  <div className="flex flex-col h-full">
                    <div className={`text-xs font-medium ${isToday ? "text-primary" : ""}`}>
                      {day}
                    </div>
                    {hasItems && (
                      <div className="flex-1 overflow-hidden mt-0.5 flex flex-col gap-0.5">
                        {dayItems.events.length > 0 && (
                          <div className="text-[10px] p-0.5 rounded bg-blue-200 dark:bg-blue-800 truncate">
                            {dayItems.events.length} {dayItems.events.length === 1 ? "event" : "events"}
                          </div>
                        )}
                        {dayItems.meals.length > 0 && (
                          <div className="text-[10px] p-0.5 rounded bg-green-200 dark:bg-green-800 truncate">
                            {dayItems.meals.length} {dayItems.meals.length === 1 ? "meal" : "meals"}
                          </div>
                        )}
                        {dayItems.lists.length > 0 && (
                          <div className="text-[10px] p-0.5 rounded bg-purple-200 dark:bg-purple-800 truncate">
                            {dayItems.lists.length} {dayItems.lists.length === 1 ? "list" : "lists"}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
              
              if (!hasItems) {
                return <div key={day}>{dayCell}</div>;
              }
              
              return (
                <Tooltip key={day}>
                  <Popover>
                    <TooltipTrigger asChild>
                      <PopoverTrigger asChild>
                        <div>{dayCell}</div>
                      </PopoverTrigger>
                    </TooltipTrigger>
                    <TooltipContent className="w-72 p-3 bg-popover border shadow-lg" side="top">
                      <div className="space-y-2.5">
                        <div className="font-semibold text-xs text-foreground border-b border-border pb-1.5">
                          {formatDate(formatDateKey(day))}
                        </div>
                        <div className="space-y-2.5">
                          {/* Events */}
                          {dayItems.events.slice(0, 2).map((event) => (
                            <div key={event._id} className="text-xs space-y-1.5">
                              <div className="font-medium text-foreground flex items-center gap-1.5">
                                <CalendarIcon className="size-3 text-blue-500" />
                                <span className="font-semibold">{event.title || "N/A"}</span>
                              </div>
                              {event.location && (
                                <div className="text-muted-foreground flex items-center gap-1.5">
                                  <MapPin className="size-3" />
                                  <span>{event.location}</span>
                                </div>
                              )}
                              {event.createdBy && (
                                <div className="text-muted-foreground flex items-center gap-1.5">
                                  <User className="size-3" />
                                  <span>by {event.createdBy.fullName || event.createdBy.username || "N/A"}</span>
                                </div>
                              )}
                            </div>
                          ))}
                          {/* Meals */}
                          {dayItems.meals.slice(0, 2).map((meal) => (
                            <div key={meal._id} className="text-xs space-y-1.5">
                              <div className="font-medium text-foreground flex items-center gap-1.5">
                                <Utensils className="size-3 text-green-500" />
                                <span className="font-semibold">{meal.title || "N/A"}</span>
                              </div>
                              {meal.description && (
                                <div className="text-muted-foreground pl-4">
                                  {meal.description}
                                </div>
                              )}
                              {meal.createdBy && (
                                <div className="text-muted-foreground flex items-center gap-1.5">
                                  <User className="size-3" />
                                  <span>by {meal.createdBy.fullName || meal.createdBy.username || "N/A"}</span>
                                </div>
                              )}
                            </div>
                          ))}
                          {/* Lists */}
                          {dayItems.lists.slice(0, 2).map((list) => (
                            <div key={list._id} className="text-xs space-y-1.5">
                              <div className="font-medium text-foreground flex items-center gap-1.5">
                                <List className="size-3 text-purple-500" />
                                <span className="font-semibold">{list.name || "N/A"}</span>
                              </div>
                              {list.createdBy && (
                                <div className="text-muted-foreground flex items-center gap-1.5">
                                  <User className="size-3" />
                                  <span>by {list.createdBy.fullName || list.createdBy.username || "N/A"}</span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                        {(dayItems.events.length > 2 || dayItems.meals.length > 2 || dayItems.lists.length > 2) && (
                          <div className="text-xs text-muted-foreground pt-2 border-t border-border">
                            +{totalItems - 2} more {totalItems - 2 === 1 ? "item" : "items"}
                          </div>
                        )}
                      </div>
                    </TooltipContent>
                    <PopoverContent className="w-80" align="start">
                      <div className="space-y-3">
                        <div className="font-semibold text-sm">
                          {formatDate(formatDateKey(day))}
                        </div>
                        <div className="space-y-3">
                          {/* Events */}
                          {dayItems.events.length > 0 && (
                            <div className="space-y-2">
                              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                Events ({dayItems.events.length})
                              </div>
                              {dayItems.events.map((event) => (
                                <div key={event._id} className="p-2 rounded-lg border space-y-1">
                                  <div className="font-medium text-sm">{event.title || "N/A"}</div>
                                  {event.description && (
                                    <p className="text-xs text-muted-foreground">{event.description}</p>
                                  )}
                                  <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                                    {event.startDate && (
                                      <div className="flex items-center gap-1">
                                        <Clock className="size-3" />
                                        <span>{formatDate(event.startDate)}</span>
                                      </div>
                                    )}
                                    {event.location && (
                                      <div className="flex items-center gap-1">
                                        <MapPin className="size-3" />
                                        <span>{event.location}</span>
                                      </div>
                                    )}
                                    {event.createdBy && (
                                      <div className="flex items-center gap-1">
                                        <User className="size-3" />
                                        <span>by {event.createdBy.fullName || event.createdBy.username || "N/A"}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                          {/* Meals */}
                          {dayItems.meals.length > 0 && (
                            <div className="space-y-2">
                              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                Meals ({dayItems.meals.length})
                              </div>
                              {dayItems.meals.map((meal) => (
                                <div key={meal._id} className="p-2 rounded-lg border space-y-1">
                                  <div className="font-medium text-sm">{meal.title || "N/A"}</div>
                                  {meal.description && (
                                    <p className="text-xs text-muted-foreground">{meal.description}</p>
                                  )}
                                  <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                                    {meal.time && (
                                      <div className="flex items-center gap-1">
                                        <Clock className="size-3" />
                                        <span>{meal.time}</span>
                                      </div>
                                    )}
                                    {meal.type && (
                                      <div className="flex items-center gap-1">
                                        <Utensils className="size-3" />
                                        <span className="capitalize">{meal.type}</span>
                                      </div>
                                    )}
                                    {meal.createdBy && (
                                      <div className="flex items-center gap-1">
                                        <User className="size-3" />
                                        <span>by {meal.createdBy.fullName || meal.createdBy.username || "N/A"}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                          {/* Lists */}
                          {dayItems.lists.length > 0 && (
                            <div className="space-y-2">
                              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                Lists ({dayItems.lists.length})
                              </div>
                              {dayItems.lists.map((list) => (
                                <div key={list._id} className="p-2 rounded-lg border space-y-1">
                                  <div className="font-medium text-sm">{list.name || "N/A"}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {list.items?.length || 0} {list.items?.length === 1 ? "item" : "items"}
                                  </div>
                                  {list.createdBy && (
                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                      <User className="size-3" />
                                      <span>by {list.createdBy.fullName || list.createdBy.username || "N/A"}</span>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </Tooltip>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

