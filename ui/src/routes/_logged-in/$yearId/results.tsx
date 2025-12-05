import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useYearResults } from "@/data/use-admin";
import { openAuthenticatedPage } from "@/utils/download";
import { shouldBeAdmin } from "@/utils/should-be-logged-in";

export const Route = createFileRoute("/_logged-in/$yearId/results")({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    shouldBeAdmin(context);
    return {
      title: "Results",
    };
  },
});

function RouteComponent() {
  const { t } = useTranslation();
  const { yearId } = Route.useParams();
  const { data, isLoading, error } = useYearResults(yearId);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={4}>
        <Alert severity="error">
          {t("Failed to load results")}: {error.message}
        </Alert>
      </Box>
    );
  }

  const results = data?.results || [];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        p: 2,
        alignItems: "flex-start",
      }}
    >
      <Typography variant="h5" gutterBottom>
        {t("Results")}
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        {t("All registered volunteers for this year")} ({results.length}{" "}
        {t("results")})
      </Typography>

      <Box sx={{ mt: 2, mb: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={async () => {
            try {
              await openAuthenticatedPage(
                `/api/v1/admin/year/${yearId}/certificates`,
              );
            } catch (error) {
              console.error("Failed to open certificates:", error);
              alert("Failed to open certificates. Please try again.");
            }
          }}
        >
          {t("Generate Certificates")}
        </Button>
      </Box>

      {results.length === 0 ? (
        <Box sx={{ mt: 2 }}>
          <Alert severity="info">{t("No volunteers found")}</Alert>
        </Box>
      ) : (
        <Card sx={{ width: "100%", mt: 2 }}>
          <CardContent>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>{t("Volunteer")}</strong>
                  </TableCell>
                  <TableCell>
                    <strong>{t("Experience")}</strong>
                  </TableCell>
                  <TableCell>
                    <strong>{t("Assessments this year")}</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {results.map((result) => {
                  const fullNameRu = result.patronymic_ru
                    ? `${result.last_name_ru} ${result.first_name_ru} ${result.patronymic_ru}`
                    : `${result.last_name_ru} ${result.first_name_ru}`;
                  const fullNameEn = `${result.first_name_en} ${result.last_name_en}`;

                  return (
                    <TableRow key={result.user_id}>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {fullNameRu}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ fontSize: "0.75rem" }}
                        >
                          {fullNameEn}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {result.experience.toFixed(2)}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ fontSize: "0.75rem" }}
                        >
                          {t(result.rank)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {result.total_assessments.toFixed(2)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
