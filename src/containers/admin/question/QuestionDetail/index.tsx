import { useContext, useMemo, useState, useCallback, useEffect } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import {
  Stack,
  Box,
  Container,
  Grid,
  Alert,
  TextField,
  Button,
  Snackbar,
  Dialog,
  DialogContent,
  DialogContentText,
  CircularProgress,
} from "@mui/material";
import { useConfirm } from "material-ui-confirm";
import { QuestionOutputContext } from "../context";
import { AdminQuestionInput } from "../../../../models/question";
import { ApiError } from "../../../../models/error";
import questionApi from "../../../../services/question";
import LoadingContent from "../../../../components/LoadingContent";

export default function QuestionDetail() {
  const navigate = useNavigate();
  const confirm = useConfirm();
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingError, setIsLoadingError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmittingError, setIsSubmittingError] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const location = useLocation();
  const editMode = useMemo(
    () => location.pathname.substring(0, 22) === "/admin/questions/edit/",
    [location.pathname]
  );
  const { question } = useContext(QuestionOutputContext);
  const { id } = useParams();
  const loadFromApi = useMemo(
    () => editMode && !(id && question && question.id === id),
    [editMode, id, question]
  );

  const [initialFormInput, setInitialFormInput] = useState<AdminQuestionInput>({
    question: "",
    answer1: "",
    answer2: "",
    answer3: "",
    answer4: "",
    correctanswer: "",
  });
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<AdminQuestionInput>({
    mode: "onTouched",
  });

  useEffect(() => {
    if (editMode) {
      if (loadFromApi && id) {
        setIsLoading(true);
        questionApi
          .getEditQuestion(id)
          .then((response) => {
            setInitialFormInput(response);
          })
          .catch((error: ApiError) => {
            const errorResponse = error.response;
            setIsLoadingError(true);
            if (errorResponse) setErrorMessage(errorResponse.data.message);
            else setErrorMessage("Unknown error occured.");
          })
          .finally(() => {
            setIsLoading(false);
          });
      } else if (question) {
        const { id: _, ...rest } = question;
        setInitialFormInput({ ...rest });
        setIsLoading(false);
      }
    } else setIsLoading(false);
  }, [editMode, loadFromApi, id, question]);

  const handleBack = useCallback(() => {
    navigate("/admin/questions");
  }, [navigate]);

  const handleSave = useCallback<SubmitHandler<AdminQuestionInput>>(
    (data) => {
      setIsSubmittingError(false);
      setIsSubmitting(true);
      if (editMode) {
        if (id) {
          questionApi
            .updateQuestion(id, data)
            .then(handleBack)
            .catch((error: ApiError) => {
              const errorResponse = error.response;
              setIsSubmittingError(true);
              if (errorResponse) setErrorMessage(errorResponse.data.message);
              else setErrorMessage("Unknown error occured.");
            })
            .finally(() => {
              setIsSubmitting(false);
            });
        }
      } else {
        questionApi
          .createQuestion(data)
          .then(handleBack)
          .catch((error: ApiError) => {
            const errorResponse = error.response;
            setIsSubmittingError(true);
            if (errorResponse) setErrorMessage(errorResponse.data.message);
            else setErrorMessage("Unknown error occured.");
          })
          .finally(() => {
            setIsSubmitting(false);
          });
      }
    },
    [editMode, id, handleBack]
  );

  const askDelete = useCallback(() => {
    if (id) {
      confirm({
        title: "Are you sure?",
        description: "This question will be deleted permanently.",
        confirmationText: "Yes",
        cancellationText: "No",
        confirmationButtonProps: {
          variant: "contained",
          color: "error",
        },
        cancellationButtonProps: {
          variant: "contained",
        },
        allowClose: false,
      })
        .then(() => {
          setIsDeleting(true);
          questionApi.deleteQuestion(id).finally(handleBack);
        })
        .catch(() => null);
    }
  }, [id, confirm, handleBack]);

  if (isLoading)
    return (
      <Box flex={1}>
        <LoadingContent text="Loading question for editing..." />
      </Box>
    );

  return (
    <>
      <Stack
        direction="column"
        alignItems="center"
        flex={1}
        component="form"
        onSubmit={handleSubmit(handleSave)}
      >
        <Container maxWidth="sm" sx={{ flex: 1 }}>
          {isLoadingError ? (
            <Container maxWidth="xs" sx={{ my: 3 }}>
              <Alert icon={false} severity="error">
                {errorMessage}
              </Alert>
            </Container>
          ) : (
            <Stack justifyContent="center" alignItems="stretch" height="100%">
              <Stack direction="column" spacing={1} my={3}>
                <Controller
                  name="question"
                  control={control}
                  defaultValue={initialFormInput.question}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <TextField
                      fullWidth
                      label="Question"
                      variant="outlined"
                      size="small"
                      type="text"
                      error={!!errors.question}
                      helperText={errors.question ? "Required" : " "}
                      {...field}
                    />
                  )}
                />
                <Controller
                  name="answer1"
                  control={control}
                  defaultValue={initialFormInput.answer1}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <TextField
                      fullWidth
                      label="Answer 1"
                      variant="outlined"
                      size="small"
                      type="text"
                      error={!!errors.answer1}
                      helperText={errors.answer1 ? "Required" : " "}
                      {...field}
                    />
                  )}
                />
                <Controller
                  name="answer2"
                  control={control}
                  defaultValue={initialFormInput.answer2}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <TextField
                      fullWidth
                      label="Answer 2"
                      variant="outlined"
                      size="small"
                      type="text"
                      error={!!errors.answer2}
                      helperText={errors.answer2 ? "Required" : " "}
                      {...field}
                    />
                  )}
                />
                <Controller
                  name="answer3"
                  control={control}
                  defaultValue={initialFormInput.answer3}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <TextField
                      fullWidth
                      label="Answer 3"
                      variant="outlined"
                      size="small"
                      type="text"
                      error={!!errors.answer3}
                      helperText={errors.answer3 ? "Required" : " "}
                      {...field}
                    />
                  )}
                />
                <Controller
                  name="answer4"
                  control={control}
                  defaultValue={initialFormInput.answer4}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <TextField
                      fullWidth
                      label="Answer 4"
                      variant="outlined"
                      size="small"
                      type="text"
                      error={!!errors.answer4}
                      helperText={errors.answer4 ? "Required" : " "}
                      {...field}
                    />
                  )}
                />
                <Controller
                  name="correctanswer"
                  control={control}
                  defaultValue={initialFormInput.correctanswer}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <TextField
                      fullWidth
                      label="Correct answer"
                      variant="outlined"
                      size="small"
                      type="text"
                      error={!!errors.correctanswer}
                      helperText={errors.correctanswer ? "Required" : " "}
                      {...field}
                    />
                  )}
                />
              </Stack>
            </Stack>
          )}
        </Container>
        <Container maxWidth={false} sx={{ mb: 3 }}>
          {isLoadingError ? (
            <Stack direction="row" justifyContent="center">
              <Button type="button" variant="contained" onClick={handleBack}>
                Back
              </Button>
            </Stack>
          ) : (
            <Grid container spacing={2}>
              <Grid
                item
                xs={12}
                sm={3}
                textAlign={{ xs: "center", sm: "left" }}
              >
                <Button type="button" variant="contained" onClick={handleBack}>
                  Cancel
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} textAlign="center">
                <Button type="submit" variant="contained" disabled={!isValid}>
                  Save
                </Button>
              </Grid>
              {editMode && (
                <Grid
                  item
                  xs={12}
                  sm={3}
                  textAlign={{ xs: "center", sm: "right" }}
                >
                  <Button
                    type="button"
                    variant="contained"
                    color="error"
                    onClick={askDelete}
                  >
                    Delete
                  </Button>
                </Grid>
              )}
            </Grid>
          )}
        </Container>
      </Stack>
      <Snackbar
        open={isSubmittingError}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert icon={false} severity="error">
          {errorMessage}
        </Alert>
      </Snackbar>
      <Dialog open={isSubmitting}>
        <DialogContent sx={{ textAlign: "center" }}>
          <CircularProgress sx={{ mb: 1 }} />
          <DialogContentText>Saving question...</DialogContentText>
        </DialogContent>
      </Dialog>
      <Dialog open={isDeleting}>
        <DialogContent sx={{ textAlign: "center" }}>
          <CircularProgress sx={{ mb: 1 }} />
          <DialogContentText>Deleting question...</DialogContentText>
        </DialogContent>
      </Dialog>
    </>
  );
}
