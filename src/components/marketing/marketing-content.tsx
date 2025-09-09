"use client"

import { useMarketingTab } from "@/contexts/marketing-tab-context";
import { EmailCampaignsTab } from "./tabs/email-campaigns-tab";
import { SMSCampaignsTab } from "./tabs/sms-campaigns-tab"; 
import { DiscountCodesTab } from "./tabs/discount-codes-tab";

export function MarketingContent() {
  const { activeTab } = useMarketingTab();

  const renderTabContent = () => {
    switch (activeTab) {
      case 'email-campaigns':
        return <EmailCampaignsTab />;
      case 'sms-campaigns':
        return <SMSCampaignsTab />;
      case 'discount-codes':
        return <DiscountCodesTab />;
      default:
        return <EmailCampaignsTab />;
    }
  };

  return (
    <div>
      {renderTabContent()}
    </div>
  );
}