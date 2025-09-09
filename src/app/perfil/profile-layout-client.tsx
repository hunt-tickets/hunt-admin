"use client"

export function ProfileLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  // The double sidebar layout is now handled by ClientLayout
  // This component just passes through the children
  return <>{children}</>;
}