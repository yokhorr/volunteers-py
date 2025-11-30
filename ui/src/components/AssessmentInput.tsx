import { Star, StarBorder } from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { AssessmentInAttendance } from "@/client/types.gen";

interface AssessmentInputProps {
  userDayId: number;
  assessments: AssessmentInAttendance[];
  canEdit: boolean;
  onAdd: (userDayId: number, value: number, comment: string) => Promise<void>;
  onEdit: (
    assessmentId: number,
    value: number | null,
    comment: string | null,
  ) => Promise<void>;
  onDelete: (assessmentId: number) => Promise<void>;
}

export function AssessmentInput({
  userDayId,
  assessments,
  canEdit,
  onAdd,
  onEdit,
  onDelete,
}: AssessmentInputProps) {
  const { t } = useTranslation();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAssessment, setEditingAssessment] =
    useState<AssessmentInAttendance | null>(null);
  const [value, setValue] = useState("");
  const [comment, setComment] = useState("");

  const averageScore =
    assessments.length > 0
      ? Math.round(
          assessments.reduce((sum, a) => sum + a.value, 0) / assessments.length,
        )
      : null;

  const handleOpenDialog = (assessment?: AssessmentInAttendance) => {
    if (assessment) {
      setEditingAssessment(assessment);
      setValue(assessment.value.toString());
      setComment(assessment.comment);
    } else {
      setEditingAssessment(null);
      setValue("");
      setComment("");
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingAssessment(null);
    setValue("");
    setComment("");
  };

  const handleSave = async () => {
    const numValue = Number.parseInt(value, 10);
    if (Number.isNaN(numValue) || numValue < 0 || numValue > 10) {
      return;
    }

    if (editingAssessment) {
      await onEdit(editingAssessment.assessment_id, numValue, comment);
    } else {
      await onAdd(userDayId, numValue, comment);
    }

    handleCloseDialog();
  };

  const handleDelete = async () => {
    if (editingAssessment) {
      await onDelete(editingAssessment.assessment_id);
      handleCloseDialog();
    }
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.5,
          justifyContent: "center",
        }}
      >
        {averageScore !== null ? (
          <Tooltip
            title={
              assessments.length > 1
                ? `${t("Average of")} ${assessments.length} ${t("assessments")}`
                : assessments[0]?.comment || t("Assessment")
            }
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                cursor: canEdit ? "pointer" : "default",
              }}
              onClick={() => {
                if (canEdit && assessments.length === 1) {
                  handleOpenDialog(assessments[0]);
                } else if (canEdit) {
                  handleOpenDialog();
                }
              }}
            >
              <Star sx={{ fontSize: 16, color: "warning.main" }} />
              <Typography variant="body2" fontWeight="medium">
                {averageScore}
              </Typography>
            </Box>
          </Tooltip>
        ) : canEdit ? (
          <Tooltip title={t("Add assessment")}>
            <IconButton
              size="small"
              onClick={() => handleOpenDialog()}
              sx={{ p: 0.5 }}
            >
              <StarBorder sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>
        ) : (
          <Typography variant="body2" color="text.secondary">
            -
          </Typography>
        )}
      </Box>

      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingAssessment ? t("Edit Assessment") : t("Add Assessment")}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
            <TextField
              label={t("Score")}
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              slotProps={{
                htmlInput: { min: 0, max: 10, step: 1 },
              }}
              fullWidth
              required
            />
            <TextField
              label={t("Comment")}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              multiline
              rows={3}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          {editingAssessment && (
            <Button onClick={handleDelete} color="error" sx={{ mr: "auto" }}>
              {t("Delete")}
            </Button>
          )}
          <Button onClick={handleCloseDialog}>{t("Cancel")}</Button>
          <Button
            onClick={handleSave}
            variant="contained"
            disabled={
              !value ||
              Number.isNaN(Number.parseInt(value, 10)) ||
              Number.parseInt(value, 10) < 0 ||
              Number.parseInt(value, 10) > 10
            }
          >
            {t("Save")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
