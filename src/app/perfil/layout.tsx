import { ProfileLayoutClient } from "./profile-layout-client";

export default function PerfilLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProfileLayoutClient>{children}</ProfileLayoutClient>;
}