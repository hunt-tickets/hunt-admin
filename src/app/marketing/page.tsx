"use client"

import { MarketingTabProvider } from "@/contexts/marketing-tab-context";
import { MarketingSidebar } from "@/components/marketing/marketing-sidebar";
import { MarketingContent } from "@/components/marketing/marketing-content";

export default function MarketingPage() {
  return (
    <MarketingTabProvider>
      <div className="flex">
        <MarketingSidebar />
        <div className="flex-1 ml-64 p-8">
          <MarketingContent />
        </div>
      </div>
    </MarketingTabProvider>
  );
}