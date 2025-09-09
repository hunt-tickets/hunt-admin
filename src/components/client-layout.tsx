"use client"

import { usePathname } from "next/navigation";
import { AdminSidebar } from "@/components/admin-sidebar";
import { ProfileSidebar } from "@/components/profile/profile-sidebar";
import { EventSidebar } from "@/components/eventos/event-sidebar";
import { CardHoverProvider } from "@/components/card-hover-provider";
import { AuthProvider } from "@/components/auth-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { ProfileTabProvider } from "@/contexts/profile-tab-context";
import { ProfileProducerProvider, useProfileProducer } from "@/contexts/profile-producer-context";
import { EventTabProvider } from "@/contexts/event-tab-context";
import { CurrenciesProvider } from "@/contexts/currencies-context";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

interface ClientLayoutProps {
  children: React.ReactNode;
}

export function ClientLayout({ children }: ClientLayoutProps) {
  const pathname = usePathname();
  const isProfileRoute = pathname.startsWith('/perfil');
  const isEventCreationRoute = pathname.startsWith('/eventos/crear');

  return (
    <ThemeProvider>
      <AuthProvider>
        <CurrenciesProvider>
          <ProfileTabProvider>
            <ProfileProducerProvider>
              <EventTabProvider>
                <CardHoverProvider>
                {isProfileRoute ? (
                  // Double sidebar layout for profile routes
                  <div className="flex h-screen">
                    <AdminSidebar />
                    <ProfileSidebarWrapper />
                    <div className="ml-[32rem] flex-1">
                      <div className="flex flex-1 flex-col gap-4 p-4">
                        <main className="grid flex-1 gap-4 overflow-auto p-4">
                          <div className="relative max-w-4xl mx-auto w-full">
                            {children}
                          </div>
                        </main>
                      </div>
                    </div>
                  </div>
              ) : isEventCreationRoute ? (
                // Double sidebar layout for event creation routes
                <div className="flex h-screen">
                  <AdminSidebar />
                  <EventSidebar />
                  <div className="ml-[32rem] flex-1">
                    <div className="flex flex-1 flex-col gap-4 p-4">
                      <main className="grid flex-1 gap-4 overflow-auto p-4">
                        <div className="relative max-w-4xl mx-auto w-full">
                          {children}
                        </div>
                      </main>
                    </div>
                  </div>
                </div>
              ) : (
                // Single sidebar layout for other routes
                <div className="flex">
                  <AdminSidebar />
                  <div className="flex-1 ml-64">
                    <div className="flex flex-1 flex-col gap-4 p-4">
                      <main className="grid flex-1 gap-4 overflow-auto p-4">
                        <div className="relative max-w-4xl mx-auto w-full">
                          {children}
                        </div>
                      </main>
                    </div>
                  </div>
                </div>
              )}
                </CardHoverProvider>
              </EventTabProvider>
            </ProfileProducerProvider>
          </ProfileTabProvider>
        </CurrenciesProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

function ProfileSidebarWrapper() {
  const { 
    producers, 
    currentProducerId, 
    setCurrentProducerId, 
    addProducer 
  } = useProfileProducer();

  return (
    <ProfileSidebar
      producers={producers}
      currentProducerId={currentProducerId}
      onSelectionChange={setCurrentProducerId}
      onProducerAdded={addProducer}
    />
  );
}