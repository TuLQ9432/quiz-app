import { useContext, useMemo, useState, useCallback, useEffect } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import {
  Stack,
  Box,
  Container,
  Grid,
  Alert,
  TextField,
  MenuItem,
  Button,
  Snackbar,
  Avatar,
} from "@mui/material";
import { UserOutputContext } from "../context";
import { EditUserInput } from "../../../../models/user";
import { ApiError } from "../../../../models/error";
import userApi from "../../../../services/user";
import LoadingContent from "../../../../components/LoadingContent";
import WaitingDialog from "../../../../components/WaitingDialog";

const roles = ["admin", "user"];

export default function UserDetail() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingError, setIsLoadingError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmittingError, setIsSubmittingError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { user } = useContext(UserOutputContext);
  const { id } = useParams();
  const loadFromApi = useMemo(
    () => !(user && id && user.id === id),
    [user, id]
  );

  const [initialFormInput, setInitialFormInput] = useState<EditUserInput>();
  const {
    control,
    register,
    watch,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<EditUserInput>({
    mode: "onTouched",
  });

  useEffect(() => {
    if (loadFromApi && id) {
      setIsLoading(true);
      userApi
        .get(id)
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
    } else if (user) {
      const { id: _1, isEmailVerified: _2, score: _3, ...rest } = user;
      setInitialFormInput({ ...rest });
      setIsLoading(false);
    }
  }, [loadFromApi, id, user]);

  const getNonEmptyAvatarLink = useCallback(() => {
    const link = watch("avatar");
    return link
      ? link
      : "https://tuannodevbuckettest.s3.ap-southeast-1.amazonaws.com/avatar-default.png";
  }, [watch]);

  const handleBack = useCallback(() => {
    navigate("/admin/users");
  }, [navigate]);

  const handleSave = useCallback<SubmitHandler<EditUserInput>>(
    (data) => {
      if (id) {
        setIsSubmittingError(false);
        setIsSubmitting(true);
        userApi
          .update(id, data)
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
    [id, handleBack]
  );

  if (isLoading)
    return (
      <Box flex={1}>
        <LoadingContent text="Loading user for editing..." />
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
            initialFormInput && (
              <Stack justifyContent="center" alignItems="stretch" height="100%">
                <Stack
                  direction="column"
                  alignItems="center"
                  spacing={1}
                  my={3}
                >
                  <Controller
                    name="username"
                    control={control}
                    defaultValue={initialFormInput.username}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <TextField
                        fullWidth
                        label="Username"
                        variant="outlined"
                        size="small"
                        type="text"
                        error={!!errors.username}
                        helperText={errors.username ? "Required" : " "}
                        {...field}
                      />
                    )}
                  />
                  <Controller
                    name="email"
                    control={control}
                    defaultValue={initialFormInput.email}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <TextField
                        fullWidth
                        label="Email"
                        variant="outlined"
                        size="small"
                        type="email"
                        error={!!errors.email}
                        helperText={errors.email ? "Required" : " "}
                        {...field}
                      />
                    )}
                  />
                  <Controller
                    name="avatar"
                    control={control}
                    defaultValue={initialFormInput.avatar}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <TextField
                        fullWidth
                        label="Avatar link"
                        variant="outlined"
                        size="small"
                        type="text"
                        error={!!errors.avatar}
                        helperText={errors.avatar ? "Required" : " "}
                        {...field}
                      />
                    )}
                  />
                  <Box pb={3}>
                    <Avatar
                      alt="Avatar preview"
                      src={getNonEmptyAvatarLink()}
                      sx={{ width: "128px", height: "128px" }}
                    />
                  </Box>
                  <TextField
                    fullWidth
                    select
                    label="Role"
                    defaultValue={initialFormInput.role}
                    size="small"
                    {...register("role")}
                  >
                    {roles.map((option) => (
                      <MenuItem key={"option-" + option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>
                </Stack>
              </Stack>
            )
          )}
        </Container>
        <Container maxWidth={false} sx={{ mb: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={3} textAlign={{ xs: "center", sm: "left" }}>
              <Button type="button" variant="contained" onClick={handleBack}>
                Cancel
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} textAlign="center">
              <Button type="submit" variant="contained" disabled={!isValid}>
                Save
              </Button>
            </Grid>
          </Grid>
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
      <WaitingDialog isWaiting={isSubmitting} text="Saving user..." />
    </>
  );
}
