"use client";

import * as React from "react";
import {
  AudioWaveform,
  Bot,
  Command,
  GalleryVerticalEnd,
  SquareTerminal,
} from "lucide-react";

import Link from "next/link";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Elite Sale",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Movit.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Elite Sale.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Sales Dashboard",
          url: "/salesDashboard",
          icon: Bot,
        },
        {
          title: "Customers Dashboard",
          url: "/customerDashboard",
          icon: Bot,
        },

        {
          title: "Route Dashboard",
          url: "/routeDashboard",
          icon: Bot,
        },
        {
          title: "Order Dashboard",
          url: "/orderDashboard",
          icon: Bot,
        },
        {
          title: "Material Dashboard",
          url: "/materialDashboard",
          icon: Bot,
        },
        {
          title: "Finance Dashboard",
          url: "/financeDashboard",
          icon: Bot,
        },

        {
          title: "Survey Dashboard",
          url: "/surveyDashboards",
          icon: Bot,
        },

        {
          title: "Asset Dashboard",
          url: "/assetDashboard",
          icon: Bot,
        },
        {
          title: "EFRIS Dashboard",
          url: "/EFRISHDashboard",
          icon: Bot,
        },
        {
          title: "SAP Dashboard",
          url: "/sapDashboard",
          icon: Bot,
        },
      ],
    },
    {
      title: "Report",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Stock Laser Report",
          url: "/stock-laser-report",
          icon: Bot,
        },
        {
          title: "Salesman Location Tracking ",
          url: "/salesman-location-tracking",
          icon: Bot,
        },
        {
          title: "Trip Stock Reconcialiation",
          url: "/trip-stock-reconcialiation",
          icon: Bot,
        },
        {
          title: "Sm Weekly Sales Report",
          url: "/sm-weekly-sales-report",
          icon: Bot,
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props} className="bg-[#022235] text-white">
      <SidebarHeader className="bg-[#022235] text-white">
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent className="bg-[#022235] text-white">
        <NavMain items={data.navMain} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter className="bg-[#022235] text-white">
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
// jdnhj
