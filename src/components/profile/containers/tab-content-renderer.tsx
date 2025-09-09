"use client"

import { Card } from "@/components/ui/card";
import { TeamTab } from "@/components/profile/tabs/team-tab";
import { SocialMediaTab } from "@/components/profile/tabs/social-media-tab";
import { BrandingTab } from "@/components/profile/tabs/branding-tab";
import { PoliticasTab } from "@/components/profile/tabs/politicas-tab";
import { WebsiteTab } from "@/components/profile/tabs/website-tab";
import { EmailsBloqueadosTab } from "@/components/profile/tabs/emails-bloqueados-tab";
import { PlantillasEmailsTab } from "@/components/profile/tabs/plantillas-emails-tab";
import { CheckoutFeesTab } from "@/components/profile/tabs/checkout-fees-tab";
import { SettingsTab } from "@/components/profile/tabs/settings-tab";
import type { TabId, TabContentProps } from "@/types/tabs";

interface TabContentRendererProps extends TabContentProps {
  activeTab: TabId;
}

export function TabContentRenderer({ activeTab, producerId, currentProducer }: TabContentRendererProps) {
  const renderContent = () => {
    const commonProps = { producerId, currentProducer };
    
    switch (activeTab) {
      case "team":
        return <TeamTab {...commonProps} />;
      case "social":
        return <SocialMediaTab {...commonProps} />;
      case "branding":
        return <BrandingTab {...commonProps} />;
      case "politicas":
        return <PoliticasTab {...commonProps} />;
      case "website":
        return <WebsiteTab {...commonProps} />;
      case "emails-bloqueados":
        return <EmailsBloqueadosTab {...commonProps} />;
      case "plantillas-emails":
        return <PlantillasEmailsTab {...commonProps} />;
      case "checkout-fees":
        return <CheckoutFeesTab {...commonProps} />;
      case "settings":
        return <SettingsTab {...commonProps} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex-1">
      {activeTab === "branding" || activeTab === "politicas" || activeTab === "social" || activeTab === "website" || activeTab === "emails-bloqueados" || activeTab === "checkout-fees" || activeTab === "settings" || activeTab === "team" ? (
        renderContent()
      ) : (
        <Card className="p-6">
          {renderContent()}
        </Card>
      )}
    </div>
  );
}