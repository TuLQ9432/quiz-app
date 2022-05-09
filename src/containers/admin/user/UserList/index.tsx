import { useState, useEffect, useCallback, useContext } from "react";
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
import FlexScrollBox from "../../../../components/FlexScrollBox";
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
            <FlexScrollBox
              isLoading={isLoading}
              p={2}
              sx={{ background: (theme) => theme.palette.grey[300] }}
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
            </FlexScrollBox>
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
