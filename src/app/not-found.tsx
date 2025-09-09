import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="glassmorphism max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 text-6xl font-bold text-muted-foreground">
            404
          </div>
          <CardTitle className="text-2xl">Página No Encontrada</CardTitle>
          <CardDescription>
            Lo sentimos, la página que buscas no existe o ha sido movida.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-2">
            <Link href="/">
              <Button className="w-full" variant="default">
                <Home className="w-4 h-4 mr-2" />
                Volver al Dashboard
              </Button>
            </Link>
            <Button variant="outline" onClick={() => window.history.back()} className="w-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Página Anterior
            </Button>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Si crees que esto es un error, contacta al equipo de soporte.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}