import {
  ChangeEventHandler,
  useState,
  useMemo,
  useCallback,
  useEffect,
} from "react";
import { useAppSelector, useAppDispatch } from "../../../hooks";
import {
  Alert,
  Link,
  Stack,
  Typography,
  Container,
  Box,
  Grid,
  Button,
  RadioGroup,
  Radio,
  FormControlLabel,
} from "@mui/material";
import UserTopBar from "../../../components/UserTopBar";
import LoadingContent from "../../../components/LoadingContent";
import WaitingDialog from "../../../components/WaitingDialog";
import { authActions } from "../../../store/auth/slice";
import { userQuizActions } from "../../../store/user/slice";

export default function QuestionPage() {
  const dispatch = useAppDispatch();
  const { user, refreshToken } = useAppSelector((state) => state.auth);
  const { isLoading, questionList, questionCount, answerList } = useAppSelector(
    (state) => state.userQuiz
  );
  const [questionNumber, setQuestionNumber] = useState(0);
  const [answer, setAnswer] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentQuestion = useMemo(
    () => questionList[questionNumber],
    [questionList, questionNumber]
  );

  const handleLogout = useCallback(() => {
    if (typeof refreshToken === "undefined") return;
    dispatch(authActions.logout({ refreshToken: refreshToken }));
  }, [refreshToken, dispatch]);

  const previousQuestion = useCallback(() => {
    setQuestionNumber((number) => number - 1);
  }, []);

  const nextQuestion = useCallback(() => {
    setQuestionNumber((number) => number + 1);
  }, []);

  const saveAnswer = useCallback(() => {
    dispatch(
      userQuizActions.saveAnswer({
        id: currentQuestion.id,
        correctanswer: answer,
      })
    );
  }, [dispatch, currentQuestion, answer]);

  const handleChooseAnswer = useCallback<ChangeEventHandler<HTMLInputElement>>(
    (event) => {
      setAnswer((event.target as HTMLInputElement).value);
    },
    []
  );

  const handlePrevious = previousQuestion;

  const handleSkip = nextQuestion;

  const handleSaveAndNext = useCallback(() => {
    saveAnswer();
    nextQuestion();
  }, [saveAnswer, nextQuestion]);

  const handleSaveAndPrevious = useCallback(() => {
    saveAnswer();
    previousQuestion();
  }, [saveAnswer, previousQuestion]);

  const handleSubmitAnswerList = useCallback(() => {
    dispatch(userQuizActions.submitAnswerList(answerList));
    setIsSubmitting(true);
  }, [dispatch, answerList]);

  useEffect(() => {
    if (answerList.length === 0) setAnswer("");
    else {
      const answerListIndex = answerList
        .map((item) => item.id)
        .indexOf(currentQuestion.id);
      if (answerListIndex === -1) setAnswer("");
      else setAnswer(answerList[answerListIndex].correctanswer);
    }
  }, [answerList, currentQuestion]);

  if (typeof user === "undefined") return <></>;

  if (isLoading) {
    dispatch(userQuizActions.getQuestionList());
    return (
      <Box height="100vh">
        <LoadingContent text="Loading quiz..." />
      </Box>
    );
  } else if (questionCount === 0) {
    return (
      <Container maxWidth="xs" sx={{ my: 4 }}>
        <Alert icon={false} severity="error">
          The quiz is currently empty.
          <br />
          Please{" "}
          <Link component="button" variant="body2" onClick={handleLogout}>
            log out
          </Link>{" "}
          and contact quiz organizer for more info.
        </Alert>
      </Container>
    );
  }

  return (
    <>
      <Stack height="100vh">
        <UserTopBar>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
          >
            <Typography
              component="h1"
              variant="h4"
              fontWeight="fontWeightBold"
              my={3}
              color="white"
            >
              Question {questionNumber + 1}/{questionCount}
            </Typography>
            <Typography component="h2" variant="h5" my="auto" color="white">
              Username: {user.username}
            </Typography>
          </Stack>
        </UserTopBar>
        <Stack component="main" flex={1} overflow="auto">
          <Container maxWidth={false} sx={{ flex: 1 }}>
            <Stack justifyContent="center" alignItems="center" height="100%">
              <Box my={3}>
                <Typography component="p" variant="h6" mb={1}>
                  {currentQuestion.question}
                </Typography>
                <RadioGroup value={answer} onChange={handleChooseAnswer}>
                  <FormControlLabel
                    value={currentQuestion.answer1}
                    control={<Radio />}
                    label={currentQuestion.answer1}
                  />
                  <FormControlLabel
                    value={currentQuestion.answer2}
                    control={<Radio />}
                    label={currentQuestion.answer2}
                  />
                  <FormControlLabel
                    value={currentQuestion.answer3}
                    control={<Radio />}
                    label={currentQuestion.answer3}
                  />
                  <FormControlLabel
                    value={currentQuestion.answer4}
                    control={<Radio />}
                    label={currentQuestion.answer4}
                  />
                </RadioGroup>
              </Box>
            </Stack>
          </Container>
          <Container maxWidth={false} sx={{ mb: 3 }}>
            <Grid container spacing={2}>
              <Grid
                item
                xs={12}
                sm={3}
                textAlign={{ xs: "center", sm: "left" }}
              >
                <Button
                  variant="contained"
                  disabled={questionNumber === 0}
                  onClick={handlePrevious}
                >
                  Previous
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} textAlign="center">
                {questionNumber === questionCount - 1 ? (
                  <Button variant="contained" onClick={handleSaveAndPrevious}>
                    Save and previous
                  </Button>
                ) : (
                  <Button variant="contained" onClick={handleSaveAndNext}>
                    Save and next
                  </Button>
                )}
              </Grid>
              <Grid
                item
                xs={12}
                sm={3}
                textAlign={{ xs: "center", sm: "right" }}
              >
                {questionNumber === questionCount - 1 ? (
                  <Button variant="contained" onClick={handleSubmitAnswerList}>
                    Submit answers
                  </Button>
                ) : (
                  <Button variant="contained" onClick={handleSkip}>
                    Skip
                  </Button>
                )}
              </Grid>
            </Grid>
          </Container>
        </Stack>
      </Stack>
      <WaitingDialog
        isWaiting={isSubmitting}
        text="Submitting your answers..."
      />
    </>
  );
}
