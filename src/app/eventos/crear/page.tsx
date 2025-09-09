"use client"

import { useEventTab } from "@/contexts/event-tab-context";
import { EventHeader } from "@/components/eventos/event-header";
import { EventGeneralForm } from "@/components/eventos/event-general-form";
import { EventAccessibilityForm } from "@/components/eventos/event-accessibility-form";

export default function CrearEventoPage() {
  const { activeTab } = useEventTab();

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return <EventGeneralForm />;
      case 'accessibility':
        return <EventAccessibilityForm />;
      default:
        return <EventGeneralForm />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Event Header */}
      <EventHeader 
        eventName="Nuevo Evento"
        eventDescription="Configura los detalles de tu evento"
        isNew={true}
      />

      {/* Tab Content */}
      <div className="mt-6">
        {renderTabContent()}
      </div>
    </div>
  );
}