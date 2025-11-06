import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SportPage() {
  return (
    <MainLayout title="Programme Sportif">
      <Card>
        <CardHeader>
          <CardTitle>Programme Sportif Personnalisé</CardTitle>
          <CardDescription>
            Votre programme sportif sur 24 semaines avec zones cardiaques
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Cette page sera développée en Phase 6
          </p>
        </CardContent>
      </Card>
    </MainLayout>
  );
}
