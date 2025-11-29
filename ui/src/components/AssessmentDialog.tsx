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

export function AssessmentDialog({
  open,
  onClose,
  userDayId,
  volunteerName,
  dayName,
}: AssessmentDialogProps) {
  const { t } = useTranslation();
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newComment, setNewComment] = useState("");
  const [newValue, setNewValue] = useState<number>(0);
  const [editComment, setEditComment] = useState("");
  const [editValue, setEditValue] = useState<number>(0);

  const { data: assessmentsData, isLoading } = useUserDayAssessments(
    userDayId,
    open,
  );
  const addAssessmentMutation = useAddAssessment();
  const editAssessmentMutation = useEditAssessment();
  const deleteAssessmentMutation = useDeleteAssessment();

  const handleAddAssessment = async () => {
    await addAssessmentMutation.mutateAsync({
      user_day_id: userDayId,
      comment: newComment,
      value: newValue,
    });
    setNewComment("");
    setNewValue(0);
    setIsAddingNew(false);
  };

  const handleEditAssessment = async (assessmentId: number) => {
    await editAssessmentMutation.mutateAsync({
      assessmentId,
      data: {
        comment: editComment,
        value: editValue,
      },
    });
    setEditingId(null);
    setEditComment("");
    setEditValue(0);
  };

  const handleDeleteAssessment = async (assessmentId: number) => {
    await deleteAssessmentMutation.mutateAsync(assessmentId);
  };

  const startEditing = (assessment: AssessmentItem) => {
    setEditingId(assessment.assessment_id);
    setEditComment(assessment.comment);
    setEditValue(assessment.value);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditComment("");
    setEditValue(0);
  };

  const handleClose = () => {
    setIsAddingNew(false);
    setEditingId(null);
    setNewComment("");
    setNewValue(0);
    setEditComment("");
    setEditValue(0);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {t("Assessment")} - {volunteerName} ({dayName})
      </DialogTitle>
      <DialogContent>
        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {assessmentsData?.assessments &&
            assessmentsData.assessments.length > 0 ? (
              <List>
                {assessmentsData.assessments.map((assessment) => (
                  <ListItem
                    key={assessment.assessment_id}
                    sx={{
                      border: "1px solid",
                      borderColor: "divider",
                      borderRadius: 1,
                      mb: 1,
                    }}
                  >
                    {editingId === assessment.assessment_id ? (
                      <Box sx={{ width: "100%" }}>
                        <TextField
                          fullWidth
                          label={t("Comment")}
                          value={editComment}
                          onChange={(e) => setEditComment(e.target.value)}
                          size="small"
                          sx={{ mb: 1 }}
                        />
                        <TextField
                          fullWidth
                          label={t("Value")}
                          type="number"
                          value={editValue}
                          onChange={(e) => setEditValue(Number(e.target.value))}
                          size="small"
                          inputProps={{ step: "0.1" }}
                          sx={{ mb: 1 }}
                        />
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <Button
                            size="small"
                            variant="contained"
                            onClick={() =>
                              handleEditAssessment(assessment.assessment_id)
                            }
                            disabled={editAssessmentMutation.isPending}
                          >
                            {t("Save")}
                          </Button>
                          <Button
                            size="small"
                            onClick={cancelEditing}
                            disabled={editAssessmentMutation.isPending}
                          >
                            {t("Cancel")}
                          </Button>
                        </Box>
                      </Box>
                    ) : (
                      <>
                        <ListItemText
                          primary={assessment.comment}
                          secondary={`${t("Value")}: ${assessment.value}`}
                        />
                        <ListItemSecondaryAction>
                          <IconButton
                            edge="end"
                            onClick={() => startEditing(assessment)}
                            size="small"
                            sx={{ mr: 0.5 }}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            edge="end"
                            onClick={() =>
                              handleDeleteAssessment(assessment.assessment_id)
                            }
                            size="small"
                            disabled={deleteAssessmentMutation.isPending}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </>
                    )}
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography color="text.secondary" sx={{ mb: 2 }}>
                {t("No assessment")}
              </Typography>
            )}

            {isAddingNew ? (
              <Box sx={{ mt: 2 }}>
                <TextField
                  fullWidth
                  label={t("Comment")}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  size="small"
                  sx={{ mb: 1 }}
                />
                <TextField
                  fullWidth
                  label={t("Value")}
                  type="number"
                  value={newValue}
                  onChange={(e) => setNewValue(Number(e.target.value))}
                  size="small"
                  inputProps={{ step: "0.1" }}
                  sx={{ mb: 1 }}
                />
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Button
                    size="small"
                    variant="contained"
                    onClick={handleAddAssessment}
                    disabled={addAssessmentMutation.isPending}
                  >
                    {t("Save")}
                  </Button>
                  <Button
                    size="small"
                    onClick={() => {
                      setIsAddingNew(false);
                      setNewComment("");
                      setNewValue(0);
                    }}
                    disabled={addAssessmentMutation.isPending}
                  >
                    {t("Cancel")}
                  </Button>
                </Box>
              </Box>
            ) : (
              <Button
                startIcon={<AddIcon />}
                onClick={() => setIsAddingNew(true)}
                variant="outlined"
                size="small"
              >
                {t("Add")}
              </Button>
            )}
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>{t("Cancel")}</Button>
      </DialogActions>
    </Dialog>
  );
}
