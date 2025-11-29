import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { AssessmentItem } from "@/client/types.gen";
import {
  useAddAssessment,
  useDeleteAssessment,
  useEditAssessment,
  useUserDayAssessments,
} from "@/data/use-admin";

interface AssessmentDialogProps {
  open: boolean;
  onClose: () => void;
  userDayId: number;
  volunteerName: string;
  dayName: string;
}

interface AssessmentFormState {
  comment: string;
  value: string;
}

export function AssessmentDialog({
  open,
  onClose,
  userDayId,
  volunteerName,
  dayName,
}: AssessmentDialogProps) {
  const { t } = useTranslation();
  const { data: assessmentsData, isLoading } = useUserDayAssessments(userDayId);
  const addAssessmentMutation = useAddAssessment();
  const editAssessmentMutation = useEditAssessment();
  const deleteAssessmentMutation = useDeleteAssessment();

  const [editingAssessment, setEditingAssessment] =
    useState<AssessmentItem | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [formState, setFormState] = useState<AssessmentFormState>({
    comment: "",
    value: "",
  });

  const resetForm = () => {
    setFormState({ comment: "", value: "" });
    setEditingAssessment(null);
    setIsAddingNew(false);
  };

  const handleStartAdd = () => {
    setIsAddingNew(true);
    setEditingAssessment(null);
    setFormState({ comment: "", value: "" });
  };

  const handleStartEdit = (assessment: AssessmentItem) => {
    setEditingAssessment(assessment);
    setIsAddingNew(false);
    setFormState({
      comment: assessment.comment,
      value: assessment.value.toString(),
    });
  };

  const parseValue = (valueStr: string): number | null => {
    const value = Number.parseFloat(valueStr);
    return Number.isNaN(value) ? null : value;
  };

  const handleSaveNew = async () => {
    const value = parseValue(formState.value);
    if (value === null) return;

    await addAssessmentMutation.mutateAsync({
      user_day_id: userDayId,
      comment: formState.comment,
      value,
    });
    resetForm();
  };

  const handleSaveEdit = async () => {
    if (!editingAssessment) return;

    const value = parseValue(formState.value);
    if (value === null) return;

    await editAssessmentMutation.mutateAsync({
      assessmentId: editingAssessment.assessment_id,
      userDayId,
      data: {
        comment: formState.comment,
        value,
      },
    });
    resetForm();
  };

  const handleDelete = async (assessmentId: number) => {
    await deleteAssessmentMutation.mutateAsync({
      assessmentId,
      userDayId,
    });
    resetForm();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const assessments = assessmentsData?.assessments ?? [];
  const isFormValid =
    formState.comment.trim() !== "" &&
    formState.value !== "" &&
    !Number.isNaN(Number.parseFloat(formState.value));
  const isSaving =
    addAssessmentMutation.isPending || editAssessmentMutation.isPending;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {t("Assessments")}: {volunteerName}
        <Typography variant="body2" color="text.secondary">
          {dayName}
        </Typography>
      </DialogTitle>
      <DialogContent>
        {isLoading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              py: 4,
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <>
            {/* Existing assessments */}
            {assessments.length > 0 && (
              <List dense>
                {assessments.map((assessment) => (
                  <ListItem
                    key={assessment.assessment_id}
                    sx={{
                      bgcolor:
                        editingAssessment?.assessment_id ===
                        assessment.assessment_id
                          ? "action.selected"
                          : "transparent",
                      borderRadius: 1,
                    }}
                  >
                    <ListItemText
                      primary={
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          <Typography variant="body2" fontWeight="medium">
                            {t("Value")}: {assessment.value}
                          </Typography>
                        </Box>
                      }
                      secondary={assessment.comment || t("No comment")}
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        aria-label="edit"
                        onClick={() => handleStartEdit(assessment)}
                        size="small"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => handleDelete(assessment.assessment_id)}
                        size="small"
                        disabled={deleteAssessmentMutation.isPending}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            )}

            {assessments.length === 0 && !isAddingNew && (
              <Typography
                color="text.secondary"
                sx={{ py: 2, textAlign: "center" }}
              >
                {t("No assessments")}
              </Typography>
            )}

            {/* Add/Edit form */}
            {(isAddingNew || editingAssessment) && (
              <Box
                sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}
              >
                <TextField
                  label={t("Value")}
                  type="number"
                  value={formState.value}
                  onChange={(e) =>
                    setFormState((prev) => ({ ...prev, value: e.target.value }))
                  }
                  size="small"
                  fullWidth
                  inputProps={{ step: "0.1" }}
                />
                <TextField
                  label={t("Comment")}
                  value={formState.comment}
                  onChange={(e) =>
                    setFormState((prev) => ({
                      ...prev,
                      comment: e.target.value,
                    }))
                  }
                  size="small"
                  fullWidth
                  multiline
                  rows={2}
                />
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Button
                    variant="contained"
                    onClick={editingAssessment ? handleSaveEdit : handleSaveNew}
                    disabled={!isFormValid || isSaving}
                    size="small"
                  >
                    {isSaving ? t("Saving...") : t("Save")}
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={resetForm}
                    size="small"
                    disabled={isSaving}
                  >
                    {t("Cancel")}
                  </Button>
                </Box>
              </Box>
            )}

            {/* Add button */}
            {!isAddingNew && !editingAssessment && (
              <Box sx={{ mt: 2 }}>
                <Button
                  startIcon={<AddIcon />}
                  onClick={handleStartAdd}
                  variant="outlined"
                  size="small"
                >
                  {t("Add Assessment")}
                </Button>
              </Box>
            )}
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>{t("Close")}</Button>
      </DialogActions>
    </Dialog>
  );
}
