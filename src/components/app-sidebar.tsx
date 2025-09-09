"use client";

import * as React from "react";
import {
  Calendar,
  BarChart3,
  Users,
  Megaphone,
  UserCheck,
  Settings,
  LogOut,
  Building2,
  DollarSign,
  Globe,
  Wallet,
  Zap,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";

const data = {
  navigation: [
    {
      title: "Eventos",
      url: "/eventos",
      icon: Calendar,
    },
    {
      title: "Reportes",
      url: "/reportes",
      icon: BarChart3,
    },
    {
      title: "Clientes",
      url: "/clientes",
      icon: Users,
    },
    {
      title: "Campañas",
      url: "/campanas",
      icon: Megaphone,
    },
    {
      title: "Equipo",
      url: "/equipo",
      icon: UserCheck,
    },
    {
      title: "Payment Gateway",
      url: "/payment-gateway",
      icon: Wallet,
    },
    {
      title: "Integraciones",
      url: "/integraciones",
      icon: Zap,
    },
    {
      title: "Organizaciones",
      url: "/perfil",
      icon: Building2,
    },
  ],
  huntTickets: [
    {
      title: "Monedas",
      url: "/hunt-tickets/currencies",
      icon: DollarSign,
    },
    {
      title: "Países",
      url: "/hunt-tickets/countries",
      icon: Globe,
    },
  ],
};

// Custom Hunt Logo Component
function HuntLogo() {
  return (
    <div className="flex items-center space-x-2">
      <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
        <span className="text-primary-foreground font-bold text-sm">H</span>
      </div>
      <span className="font-semibold text-lg">Hunt</span>
    </div>
  );
}

// User Profile Component
function UserProfile() {
  const { user } = useAuth();

  if (!user) return null;

  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : user.email[0].toUpperCase();

  return (
    <div className="flex items-center space-x-3 p-3 rounded-lg bg-sidebar-accent hover-float">
      <div className="w-10 h-10 bg-gradient-to-r from-chart-1 to-chart-2 rounded-full flex items-center justify-center">
        <span className="text-white font-semibold text-sm">{initials}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-sidebar-foreground">
          {user.name}
        </p>
        <p className="text-xs text-muted-foreground">{user.email}</p>
      </div>
    </div>
  );
}

// Logout Button Component
function LogoutButton() {
  const { logout } = useAuth();

  return (
    <SidebarMenuButton asChild className="hover-float">
      <button
        onClick={logout}
        className="flex items-center space-x-3 text-destructive w-full"
      >
        <LogOut className="h-4 w-4" />
        <span>Cerrar Sesión</span>
      </button>
    </SidebarMenuButton>
  );
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      variant="inset"
      className="border-r border-border/50"
      style={{ backgroundColor: "#0a0a0a" }}
      {...props}
    >
      <SidebarHeader className="p-4 border-b border-border/20">
        <HuntLogo />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.navigation.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="hover-float">
                    <a href={item.url} className="flex items-center space-x-3">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>Hunt Tickets</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.huntTickets.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="hover-float">
                    <a href={item.url} className="flex items-center space-x-3">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 space-y-4">
        <SidebarSeparator />

        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="hover-float">
              <a href="/configuracion" className="flex items-center space-x-3">
                <Settings className="h-4 w-4" />
                <span>Configuración</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <LogoutButton />
          </SidebarMenuItem>
        </SidebarMenu>

        <div className="mt-2">
          <UserProfile />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
