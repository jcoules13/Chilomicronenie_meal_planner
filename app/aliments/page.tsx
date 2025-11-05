import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AlimentsPage() {
  return (
    <MainLayout title="Aliments">
      <Card>
        <CardHeader>
          <CardTitle>Base de Données Aliments</CardTitle>
          <CardDescription>
            Gérez votre base de données d'aliments avec leurs propriétés nutritionnelles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Cette page sera développée en Phase 2
          </p>
        </CardContent>
      </Card>
    </MainLayout>
  );
}
