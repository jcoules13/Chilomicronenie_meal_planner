import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AnalysesPage() {
  return (
    <MainLayout title="Analyses Médicales">
      <Card>
        <CardHeader>
          <CardTitle>Suivi Médical & Analyses</CardTitle>
          <CardDescription>
            Suivez l'évolution de vos biomarqueurs dans le temps
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Cette page sera développée en Phase 8
          </p>
        </CardContent>
      </Card>
    </MainLayout>
  );
}
