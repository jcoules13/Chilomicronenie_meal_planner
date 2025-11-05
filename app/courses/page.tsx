import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function CoursesPage() {
  return (
    <MainLayout title="Listes de Courses">
      <Card>
        <CardHeader>
          <CardTitle>Listes de Courses</CardTitle>
          <CardDescription>
            Générez automatiquement vos listes de courses à partir de vos menus
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Cette page sera développée en Phase 5
          </p>
        </CardContent>
      </Card>
    </MainLayout>
  );
}
