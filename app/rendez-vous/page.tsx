import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function RendezVousPage() {
  return (
    <MainLayout title="Rendez-vous Médicaux">
      <Card>
        <CardHeader>
          <CardTitle>Rendez-vous Médicaux</CardTitle>
          <CardDescription>
            Gérez vos rendez-vous médicaux et consultations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Cette page sera développée en Phase 9
          </p>
        </CardContent>
      </Card>
    </MainLayout>
  );
}
