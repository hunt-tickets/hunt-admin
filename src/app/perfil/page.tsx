"use client"

import { Building2, Calendar, Users } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ProfileHeader } from "@/components/profile/profile-header";
import { StatsCard } from "@/components/ui/stats-card";
import { TabContentRenderer } from "@/components/profile/containers/tab-content-renderer";
import { useProfileTab } from "@/contexts/profile-tab-context";
import { useProfileProducer } from "@/contexts/profile-producer-context";
import type { Producer } from "@/types/producer";

export default function PerfilPage() {
  const { activeTab } = useProfileTab();
  const { currentProducer, currentProducerId, loading } = useProfileProducer();

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <ProfileHeader 
        producer={currentProducer || { id: '', name: 'Sin productor' }}
      />

      {/* Tab Content - Now rendered in the main content area */}
      <div className="mt-6">
        <TabContentRenderer 
          activeTab={activeTab}
          producerId={currentProducerId}
          currentProducer={currentProducer}
        />
      </div>
    </div>
  );
}