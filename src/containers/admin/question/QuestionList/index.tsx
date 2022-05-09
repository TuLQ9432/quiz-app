import {
  useRef,
  useState,
  Dispatch,
  SetStateAction,
  useEffect,
  useContext,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";
import { useConfirm } from "material-ui-confirm";
import {
  Stack,
  Container,
  Box,
  Alert,
  List,
  ListItem,
  ListItemText,
  Button,
  Typography,
  Dialog,
  DialogContent,
  DialogContentText,
  CircularProgress,
} from "@mui/material";
import LoadingContent from "../../../../components/LoadingContent";
import { QuestionOutputContext } from "../context";
import { AdminQuestionOutput } from "../../../../models/question";
import questionApi from "../../../../services/question";

function QuestionListItemActions({
  item,
  setIsDeleting,
  resetList,
}: {
  item: AdminQuestionOutput;
  setIsDeleting: Dispatch<SetStateAction<boolean>>;
  resetList: () => void;
}) {
  const navigate = useNavigate();
  const confirm = useConfirm();
  const { setQuestion } = useContext(QuestionOutputContext);

  const askDelete = useCallback(() => {
    confirm({
      title: "Are you sure you want to delete the following question?",
      content: (
        <Typography variant="body1" component="p">
          {item.question}
        </Typography>
      ),
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
        questionApi.deleteQuestion(item.id).finally(() => {
          resetList();
        });
      })
      .catch(() => null);
  }, [confirm, setIsDeleting, item, resetList]);

  const switchToEdit = useCallback(() => {
    setQuestion(item);
    navigate("edit/" + item.id);
  }, [item, navigate, setQuestion]);

  return (
    <>
      <Button variant="contained" onClick={switchToEdit}>
        Edit
      </Button>
      <Button variant="contained" color="error" onClick={askDelete}>
        Delete
      </Button>
    </>
  );
}

export default function QuestionList() {
  const navigate = useNavigate();
  const listBoxOuterRef = useRef<HTMLDivElement>(null);
  const listBoxRef = useRef<HTMLDivElement>(null);
  const [questionList, setQuestionList] = useState<AdminQuestionOutput[]>([]);
  const [questionCount, setQuestionCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [isDeleting, setIsDeleting] = useState(false);

  const resetList = useCallback(() => {
    setIsLoading(true);
    setIsDeleting(false);
    setQuestionList((list) => list.splice(0, list.length));
    setQuestionCount(0);
    setPage(1);
    setPageCount(1);
  }, []);

  useEffect(() => {
    if (page <= pageCount)
      questionApi.getEditQuestionList(page).then((response) => {
        if (page === 1) setQuestionList(response.results);
        else setQuestionList((list) => [...list, ...response.results]);

        setIsLoading(false);
        setQuestionCount(response.totalResults);
        setPageCount(response.totalPages);
        setPage((page) => page + 1);
      });
  }, [page, pageCount]);

  useEffect(() => {
    const handleResize = () => {
      const listBoxOuter = listBoxOuterRef.current;
      const listBox = listBoxRef.current;
      if (listBox && listBoxOuter) {
        const lastScrollY = window.scrollY;
        listBox.style.height = "0px";
        const newHeight = listBoxOuter.clientHeight;
        if (newHeight > 200) listBox.style.height = newHeight.toString() + "px";
        else {
          listBox.style.height = "200px";
          window.scroll(0, lastScrollY);
        }
      }
    };
    if (!isLoading) {
      handleResize();
      window.removeEventListener("resize", handleResize);
      window.addEventListener("resize", handleResize);
    }
    return () => window.removeEventListener("resize", handleResize);
  }, [isLoading]);

  const switchToNew = useCallback(() => {
    navigate("new");
  }, [navigate]);

  return (
    <>
      <Stack direction="column" alignItems="center" flex={1}>
        <Container maxWidth={false} sx={{ flex: 1, my: 3 }}>
          {isLoading ? (
            <LoadingContent text="Loading questions..." />
          ) : questionCount === 0 ? (
            <Container maxWidth="xs">
              <Alert icon={false} severity="info">
                There are no questions yet.
              </Alert>
            </Container>
          ) : (
            <Stack
              direction="column"
              spacing={1}
              alignItems="stretch"
              height="100%"
            >
              <Typography variant="h6" component="p">
                {questionCount} question{questionCount > 1 && "s"}
              </Typography>
              <Box
                border="2px solid #0085FF"
                borderRadius={3}
                flex={1}
                overflow="hidden"
                ref={listBoxOuterRef}
              >
                <Box overflow="auto" ref={listBoxRef}>
                  <List disablePadding>
                    {questionList.map((q, i) => (
                      <ListItem
                        key={"question-" + q.id}
                        divider={i + 1 < questionCount}
                        component={Stack}
                        direction={{
                          xs: "column",
                          sm: "row",
                        }}
                        spacing={{
                          xs: 1,
                          sm: 3,
                        }}
                        sx={{
                          pb: {
                            xs: 2,
                            sm: 1,
                          },
                        }}
                      >
                        <ListItemText
                          primary={q.question}
                          secondary={
                            <>
                              Answers: {q.answer1}; {q.answer2}; {q.answer3};{" "}
                              {q.answer4}
                              <br />
                              Correct answer: {q.correctanswer}
                            </>
                          }
                          primaryTypographyProps={{
                            fontWeight: "fontWeightBold",
                          }}
                          secondaryTypographyProps={{
                            color: "black",
                          }}
                          sx={{
                            alignSelf: {
                              xs: "flex-start",
                              sm: "center",
                            },
                          }}
                        />
                        <Stack direction="row" spacing={2}>
                          <QuestionListItemActions
                            item={q}
                            setIsDeleting={setIsDeleting}
                            resetList={resetList}
                          />
                        </Stack>
                      </ListItem>
                    ))}
                  </List>
                </Box>
              </Box>
            </Stack>
          )}
        </Container>
        <Container maxWidth={false} sx={{ mb: 3 }}>
          <Stack direction="row" justifyContent="center">
            <Button variant="contained" onClick={switchToNew}>
              Create a new question
            </Button>
          </Stack>
        </Container>
      </Stack>
      <Dialog open={isDeleting}>
        <DialogContent sx={{ textAlign: "center" }}>
          <CircularProgress sx={{ mb: 1 }} />
          <DialogContentText>Deleting question...</DialogContentText>
        </DialogContent>
      </Dialog>
    </>
  );
}
