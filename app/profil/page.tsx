import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProfilPage() {
  return (
    <MainLayout title="Profil Utilisateur">
      <Card>
        <CardHeader>
          <CardTitle>Profil Utilisateur</CardTitle>
          <CardDescription>
            Configurez votre profil, pathologies, objectifs et contraintes nutritionnelles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Cette page sera développée en Phase 3
          </p>
        </CardContent>
      </Card>
    </MainLayout>
  );
}
