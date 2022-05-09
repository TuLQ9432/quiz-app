import { useRef, useState, useEffect, useCallback, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  Stack,
  Container,
  Box,
  Grid,
  Paper,
  Avatar,
  Button,
  Typography,
} from "@mui/material";
import LoadingContent from "../../../../components/LoadingContent";
import { UserOutputContext } from "../context";
import { UserOutput } from "../../../../models/user";
import userApi from "../../../../services/user";

function UserListItemActions({ item }: { item: UserOutput }) {
  const navigate = useNavigate();
  const { setUser } = useContext(UserOutputContext);

  const switchToEdit = useCallback(() => {
    setUser(item);
    navigate("edit/" + item.id);
  }, [item, setUser, navigate]);

  return (
    <Box my={2}>
      <Button variant="contained" onClick={switchToEdit}>
        Update
      </Button>
    </Box>
  );
}

export default function UserList() {
  const navigate = useNavigate();
  const listBoxOuterRef = useRef<HTMLDivElement>(null);
  const listBoxRef = useRef<HTMLDivElement>(null);
  const [userList, setUserList] = useState<UserOutput[]>([]);
  const [userCount, setUserCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);

  useEffect(() => {
    if (page <= pageCount)
      userApi.getList(page).then((response) => {
        if (page === 1) setUserList(response.results);
        else setUserList((list) => [...list, ...response.results]);

        setIsLoading(false);
        setUserCount(response.totalResults);
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
    <Stack direction="column" alignItems="center" flex={1}>
      <Container maxWidth={false} sx={{ flex: 1, my: 3 }}>
        {isLoading ? (
          <LoadingContent text="Loading users..." />
        ) : (
          <Stack
            direction="column"
            spacing={1}
            alignItems="stretch"
            height="100%"
          >
            <Typography variant="h6" component="p">
              {userCount} user{userCount > 1 && "s"}
            </Typography>
            <Box
              border="2px solid #0085FF"
              borderRadius={3}
              flex={1}
              overflow="hidden"
              ref={listBoxOuterRef}
            >
              <Box
                overflow="auto"
                p={2}
                sx={{ background: (theme) => theme.palette.grey[300] }}
                ref={listBoxRef}
              >
                <Grid container spacing={2}>
                  {userList.map((u) => (
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      lg={3}
                      xl={2}
                      key={"user-" + u.id}
                    >
                      <Paper elevation={3}>
                        <Stack direction="column" alignItems="center">
                          <Avatar
                            alt={`Avatar of ${u.username}`}
                            src={u.avatar}
                            sx={{ width: "96px", height: "96px", my: 2 }}
                          />
                          <Typography
                            variant="body1"
                            fontWeight="fontWeightBold"
                            component="div"
                          >
                            {u.username}
                          </Typography>
                          <Typography variant="body2" component="div">
                            {u.email}
                          </Typography>
                          <Typography
                            variant="body2"
                            fontStyle="italic"
                            component="div"
                          >
                            {u.role}
                          </Typography>
                          <UserListItemActions item={u} />
                        </Stack>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Box>
          </Stack>
        )}
      </Container>
      <Container maxWidth={false} sx={{ mb: 3 }}>
        <Stack direction="row" justifyContent="center">
          <Button variant="contained" onClick={switchToNew}>
            Create a new user
          </Button>
        </Stack>
      </Container>
    </Stack>
  );
}
