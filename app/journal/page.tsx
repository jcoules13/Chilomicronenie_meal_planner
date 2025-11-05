import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function JournalPage() {
  return (
    <MainLayout title="Journal Quotidien">
      <Card>
        <CardHeader>
          <CardTitle>Journal Quotidien</CardTitle>
          <CardDescription>
            Suivez quotidiennement votre poids, sommeil, énergie et symptômes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Cette page sera développée en Phase 7
          </p>
        </CardContent>
      </Card>
    </MainLayout>
  );
}
