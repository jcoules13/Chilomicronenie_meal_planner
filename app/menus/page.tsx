import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function MenusPage() {
  return (
    <MainLayout title="Menus">
      <Card>
        <CardHeader>
          <CardTitle>Gestion des Menus</CardTitle>
          <CardDescription>
            Générez et gérez vos menus personnalisés selon vos contraintes nutritionnelles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Cette page sera développée en Phase 4
          </p>
        </CardContent>
      </Card>
    </MainLayout>
  );
}
