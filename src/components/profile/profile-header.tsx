"use client"

import { Building2, Home, User } from "lucide-react";
// Removed Card import - using glassmorphism instead
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface Producer {
  id: string;
  name: string;
  description?: string;
}

interface ProfileHeaderProps {
  producer: Producer;
  children?: React.ReactNode;
}

export function ProfileHeader({ producer, children }: ProfileHeaderProps) {
  const bannerUrl = `https://db.hunt-tickets.com/storage/v1/object/public/producers/${producer.id}/logos/logo_banner.png`;
  const defaultBannerUrl = "https://db.hunt-tickets.com/storage/v1/object/public/default/assets/producer_default.jpg";
  
  return (
    <div className="bg-surface-secondary backdrop-blur-xl border border-border-primary rounded-xl overflow-hidden">
      {/* Banner Section */}
      <div className="relative h-48 rounded-t-xl overflow-hidden">
        <img 
          src={bannerUrl}
          alt={`${producer.name} banner`}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = defaultBannerUrl;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/70"></div>
      </div>
      
      <div className="p-6 space-y-4">
        {/* Breadcrumb */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/" className="text-text-secondary hover:text-text-primary flex items-center gap-2">
                <Home className="h-4 w-4" />
                Inicio
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/perfil" className="text-text-secondary hover:text-text-primary flex items-center gap-2">
                <User className="h-4 w-4" />
                Perfil
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-text-primary font-medium flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                {producer.name}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        
        <div className="flex items-center gap-4">
          {/* Profile Logo */}
          <div className="w-16 h-16 border border-border-secondary rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden bg-surface-tertiary">
            <img 
              src={`https://db.hunt-tickets.com/storage/v1/object/public/producers/${producer.id}/logos/logo.png`}
              alt={`${producer.name} logo`}
              className="w-full h-full object-cover rounded-xl"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
            <Building2 className="h-8 w-8 text-text-secondary hidden" />
          </div>
          
          {/* Profile Name */}
          <div>
            <h1 className="text-3xl font-bold text-text-primary">{producer.name}</h1>
            {producer.description && (
              <p className="text-text-secondary mt-1">{producer.description}</p>
            )}
          </div>
        </div>
        
        {/* Bottom content (KPIs) */}
        {children && children}
      </div>
    </div>
  );
}