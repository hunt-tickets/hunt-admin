"use client"

import { VerticalTabsContainer } from "./containers/vertical-tabs-container";
import type { VerticalTabsProps } from "@/types/tabs";

export function VerticalTabs(props: VerticalTabsProps) {
  return <VerticalTabsContainer {...props} />;
}