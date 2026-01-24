"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Settings,
  Baby,
  UserCheck,
  Target,
  BarChart,
  UsersRound,
  ChevronRight,
  List,
  Plus,
  Gift,
  Shield,
  KeyRound,
  Activity,
  Trophy,
  MessageCircle,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarHeader,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const commonMenuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/admin",
    hasSubmenu: false,
  },
  {
    title: "Users",
    icon: Users,
    href: "/admin/users",
    hasSubmenu: true,
    submenu: [
      { title: "View All Users", href: "/admin/users", icon: List },
    ],
  },
  {
    title: "Roles",
    icon: Shield,
    href: "/admin/roles",
    hasSubmenu: true,
    submenu: [
      { title: "View All Roles", href: "/admin/roles", icon: List },
      { title: "Add New Role", href: "/admin/roles/add", icon: Plus },
    ],
  },
  {
    title: "Permissions",
    icon: KeyRound,
    href: "/admin/permissions",
    hasSubmenu: false,
  },
  {
    title: "Support",
    icon: MessageCircle,
    href: "/admin/support",
    hasSubmenu: false,
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/admin/settings",
    hasSubmenu: false,
  },
  {
    title: "Analytics",
    icon: BarChart,
    href: "/admin/analytics",
    hasSubmenu: true,
    submenu: [
      { title: "Parents & Kids Analytics", href: "/admin/parents-kids", icon: List },
      { title: "Adults Analytics", href: "/admin/adults", icon: Plus },
      { title: "Families Analytics", href: "/admin/families/dashboard", icon: Plus },
      { title: "Tracker Analytics", href: "/admin/tracker/analytics", icon: Plus },
    ],
  },
];

const parentsKidsMenuItems = [
  {
    title: "Parents & Kids",
    icon: Baby,
    href: "/admin/parents-kids",
    hasSubmenu: false,
  },
  {
    title: "Kids",
    icon: Baby,
    href: "/admin/parents-kids/kids",
    hasSubmenu: false,
  },
  {
    title: "Parents",
    icon: UserCheck,
    href: "/admin/parents-kids/parents",
    hasSubmenu: false,
  },
  {
    title: "Coin Transactions",
    icon: Gift,
    href: "/admin/parents-kids/coins/transactions",
    hasSubmenu: false,
  },
  {
    title: "Challenges",
    icon: Trophy,
    href: "/admin/parents-kids/challenges",
    hasSubmenu: false,
  },
];

const adultsMenuItems = [
  {
    title: "Adults",
    icon: Users,
    href: "/admin/adults",
    hasSubmenu: false,
  },
  {
    title: "Adult Users",
    icon: Users,
    href: "/admin/adults/users",
    hasSubmenu: false,
  },
  {
    title: "Habits",
    icon: Target,
    href: "/admin/adults/habits",
    hasSubmenu: true,
    submenu: [
      { title: "View All Habits", href: "/admin/adults/habits", icon: List },
      { title: "Add New Habit", href: "/admin/adults/habits/add", icon: Plus },
    ],
  },
  {
    title: "Adult Challenges",
    icon: Gift,
    href: "/admin/adults/adult-challenges",
    hasSubmenu: true,
    submenu: [
      { title: "View All Challenges", href: "/admin/adults/adult-challenges", icon: List },
      { title: "Add New Challenge", href: "/admin/adults/adult-challenges/add", icon: Plus },
    ],
  },
];

const familiesMenuItems = [
  {
    title: "Families",
    icon: UsersRound,
    href: "/admin/families/dashboard",
    hasSubmenu: false,
  },
  {
    title: "Family List",
    icon: List,
    href: "/admin/families/list",
    hasSubmenu: false,
  },
  {
    title: "Challenges",
    icon: Trophy,
    href: "/admin/families/challenges",
    hasSubmenu: false,
  },
];

const trackerMenuItems = [
  {
    title: "Activity Tracker",
    icon: Activity,
    href: "/admin/tracker",
    hasSubmenu: false,
  },
  {
    title: "Steps Tracking",
    icon: Activity,
    href: "/admin/tracker/steps",
    hasSubmenu: false,
  },
  {
    title: "Tracker Analytics",
    icon: BarChart,
    href: "/admin/tracker/analytics",
    hasSubmenu: false,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState(() => {
    const expanded = {};
    const allItems = [...commonMenuItems, ...parentsKidsMenuItems, ...adultsMenuItems, ...familiesMenuItems, ...trackerMenuItems];
    allItems.forEach((item) => {
      if (item.hasSubmenu && pathname.startsWith(item.href)) {
        expanded[item.href] = true;
      }
    });
    return expanded;
  });

  const toggleExpanded = (href) => {
    setExpandedItems((prev) => ({
      ...prev,
      [href]: !prev[href],
    }));
  };

  const renderMenuItem = (item) => {
    const Icon = item.icon;
    // For items without submenu, only match exact path
    // For items with submenu, match if pathname starts with href
    const isActive = item.hasSubmenu
      ? (pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href)))
      : pathname === item.href;
    const isExpanded = expandedItems[item.href];

    if (!item.hasSubmenu) {
      return (
        <SidebarMenuItem key={item.href}>
          <SidebarMenuButton
            asChild
            isActive={isActive}
            tooltip={item.title}
            className={cn(
              "w-full justify-start gap-3 h-10 px-3 rounded-md transition-colors",
              isActive 
                ? "bg-primary text-primary-foreground font-medium shadow-sm" 
                : "hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <Link href={item.href} className="flex items-center gap-3 w-full">
              <Icon className="size-4 shrink-0" />
              <span className="flex-1">{item.title}</span>
              {item.badge && (
                <Badge 
                  variant={isActive ? "secondary" : "outline"} 
                  className="ml-auto h-5 px-1.5 text-xs font-medium"
                >
                  {item.badge}
                </Badge>
              )}
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      );
    }

    return (
      <SidebarMenuItem key={item.href}>
        <SidebarMenuButton
          onClick={() => toggleExpanded(item.href)}
          isActive={isActive}
          tooltip={item.title}
          className={cn(
            "w-full justify-between gap-3 h-10 px-3 rounded-md transition-colors",
            isActive 
              ? "bg-primary text-primary-foreground font-medium shadow-sm" 
              : "hover:bg-accent hover:text-accent-foreground"
          )}
        >
          <div className="flex items-center gap-3 flex-1">
            <Icon className="size-4 shrink-0" />
            <span className="flex-1">{item.title}</span>
            {item.badge && (
              <Badge 
                variant={isActive ? "secondary" : "outline"} 
                className="h-5 px-1.5 text-xs font-medium"
              >
                {item.badge}
              </Badge>
            )}
          </div>
          <ChevronRight 
            className={cn(
              "size-4 shrink-0 transition-transform",
              isExpanded && "rotate-90"
            )} 
          />
        </SidebarMenuButton>
        {isExpanded && (
          <SidebarMenuSub>
            {item.submenu.map((subItem, index) => {
              const SubIcon = subItem.icon;
              const isSubActive = pathname === subItem.href || 
                (subItem.href !== item.href && pathname.startsWith(subItem.href));
              
              return (
                <SidebarMenuSubItem key={`${item.href}-${subItem.href}-${subItem.title}-${index}`}>
                  <SidebarMenuSubButton
                    asChild
                    isActive={isSubActive}
                  >
                    <Link href={subItem.href} className="flex items-center gap-2">
                      <SubIcon className="size-3" />
                      <span>{subItem.title}</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              );
            })}
          </SidebarMenuSub>
        )}
      </SidebarMenuItem>
    );
  };

  return (
    <Sidebar variant="inset">
      <SidebarHeader className="px-6 py-6 border-b">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <LayoutDashboard className="size-5" />
          </div>
          <div>
            <h1 className="text-lg font-semibold">Admin Panel</h1>
            <p className="text-xs text-muted-foreground">Family Productivity</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="px-4 py-4">
        {/* Common/Admin Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
            Common
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {commonMenuItems.map(renderMenuItem)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator className="my-4" />

        {/* Parents & Kids Module */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
            Parents & Kids
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {parentsKidsMenuItems.map(renderMenuItem)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator className="my-4" />

        {/* Adult Module */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
            Adult Module
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {adultsMenuItems.map(renderMenuItem)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator className="my-4" />

        {/* Family Module */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
            Family Module
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {familiesMenuItems.map(renderMenuItem)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator className="my-4" />

        {/* Tracker Module */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
            Tracker Module
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {trackerMenuItems.map(renderMenuItem)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
