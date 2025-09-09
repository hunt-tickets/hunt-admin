"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import type { Producer } from "@/types/producer";
import { getEffectiveLogoUrl, validateImageExists } from "@/lib/logo-utils";

interface LogoAvatarProps {
  producer: Producer | null | undefined;
  size?: "sm" | "md" | "lg";
  variant?: "header" | "social" | "default";
  className?: string;
  fallbackColors?: {
    from: string;
    to: string;
  };
}

const sizeClasses = {
  sm: "w-6 h-6 text-xs",
  md: "w-8 h-8 text-xs", 
  lg: "w-12 h-12 text-sm"
};

const defaultColors = {
  header: { from: "from-purple-500", to: "to-blue-500" },
  social: { from: "from-green-400", to: "to-green-600" },
  default: { from: "from-gray-400", to: "to-gray-600" }
};

export function LogoAvatar({ 
  producer, 
  size = "md", 
  variant = "default", 
  className,
  fallbackColors
}: LogoAvatarProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageExists, setImageExists] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  const sizeClass = sizeClasses[size];
  const colors = fallbackColors || defaultColors[variant];
  
  // Force re-render when producer changes by using key-like dependency
  const avatarKey = `${producer?.id || 'no-producer'}-${producer?.logoUrl || 'no-logo'}`;
  
  useEffect(() => {
    if (!producer) {
      setImageUrl(null);
      setImageExists(false);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    
    // Get the effective logo URL (from DB or constructed)
    const effectiveUrl = getEffectiveLogoUrl(producer);
    
    if (effectiveUrl) {
      // Validate if the image actually exists
      validateImageExists(effectiveUrl).then((exists) => {
        setImageUrl(effectiveUrl);
        setImageExists(exists);
        setIsLoading(false);
      });
    } else {
      setImageUrl(null);
      setImageExists(false);
      setIsLoading(false);
    }
  }, [producer?.id, producer?.logoUrl]); // Re-run when producer changes

  // Show fallback while loading or if no valid image
  if (isLoading || !imageExists || !imageUrl) {
    return (
      <div
        key={avatarKey}
        className={cn(
          sizeClass,
          `bg-gradient-to-br ${colors.from} ${colors.to}`,
          "rounded-lg flex items-center justify-center border border-white/10",
          variant === "social" && "rounded-full", // Social avatars are circular
          isLoading && "animate-pulse", // Show loading state
          className
        )}
      >
        <span className="text-white font-bold">
          {producer?.name?.charAt(0)?.toUpperCase() || 'P'}
        </span>
      </div>
    );
  }

  // Show actual image
  return (
    <img
      key={avatarKey}
      src={imageUrl}
      alt={`${producer.name} logo`}
      className={cn(
        sizeClass,
        "object-cover border border-white/10",
        variant === "social" ? "rounded-full" : "rounded-lg",
        className
      )}
      onError={() => {
        // If image fails to load, mark as non-existent
        setImageExists(false);
      }}
    />
  );
}