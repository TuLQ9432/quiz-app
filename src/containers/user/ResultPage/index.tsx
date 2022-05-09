import { useMemo, useCallback } from "react";
import { useAppSelector, useAppDispatch } from "../../../hooks";
import {
  Stack,
  Container,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
} from "@mui/material";
import UserTopBar from "../../../components/UserTopBar";
import { QuestionId, UserResult } from "../../../models/question";
import { authActions } from "../../../store/auth/slice";

export default function ResultPage() {
  const dispatch = useAppDispatch();
  const refreshToken = useAppSelector((state) => state.auth.refreshToken);
  const { questionList, questionCount, resultList } = useAppSelector(
    (state) => state.userQuiz
  );

  const score = useMemo(
    () =>
      resultList.reduce((total, item) => (item.result ? total + 1 : total), 0),
    [resultList]
  );

  const resultMap = useMemo(() => {
    const m = new Map<QuestionId, UserResult>();
    for (const r of resultList) m.set(r.id, r);
    return m;
  }, [resultList]);

  const answerText = useCallback((questionId: QuestionId) => {
    const r = resultMap.get(questionId);
    if (r)
      return (
        <>
          Your answer: {r.correctanswer}{" "}
          {r.result ? (
            <Typography variant="button" color="#00A000">
              (right)
            </Typography>
          ) : (
            <Typography variant="button" color="#D00000">
              (wrong)
            </Typography>
          )}
        </>
      );
    return (
      <>
        You have given no answer{" "}
        <Typography variant="button" color="#D00000">
          (invalid)
        </Typography>
      </>
    );
  }, [resultMap]);

  const handleLogout = useCallback(() => {
    if (typeof refreshToken === "undefined") return;
    dispatch(authActions.logout({ refreshToken: refreshToken }));
  }, [refreshToken, dispatch]);

  return (
    <>
      <UserTopBar>
        <Typography
          component="h1"
          variant="h4"
          fontWeight="fontWeightBold"
          my={3}
          color="white"
        >
          Results
        </Typography>
      </UserTopBar>
      <Container maxWidth="md" component="main">
        <Stack alignItems="center">
          <Typography component="h2" variant="h3" my={4}>
            Your score: {score}/{questionCount}
          </Typography>
          <Box
            width="100%"
            border="2px solid #0085FF"
            borderRadius={3}
            overflow="hidden"
            mb={3}
          >
            <Box p={2} bgcolor="#0085FF">
              <Typography
                component="h3"
                variant="h6"
                fontWeight="fontWeightBold"
                color="white"
              >
                Your answers
              </Typography>
            </Box>
            <Box sx={{ height: "200px", overflowY: "auto" }}>
              <List disablePadding>
                {questionList.map((q) => (
                  <ListItem key={"question-" + q.id}>
                    <ListItemText
                      primary={q.question}
                      secondary={answerText(q.id)}
                      primaryTypographyProps={{
                        fontWeight: "fontWeightBold",
                      }}
                      secondaryTypographyProps={{
                        color: "black",
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          </Box>
          <Button variant="contained" onClick={handleLogout}>
            Log out
          </Button>
        </Stack>
      </Container>
    </>
  );
}
