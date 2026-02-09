import type { ReactNode } from "react";
import { Container, Divider } from "@/components/ui";
import { AppHeader } from "@/components/AppHeader";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <Container>
      <AppHeader />
      <Divider />
      {children}
    </Container>
  );
}
