import { Link as RouterLink } from "react-router-dom";
import { Container, Alert, Link } from "@mui/material";

export default function ErrorNotFoundPage() {
  return (
    <Container maxWidth="sm" sx={{ my: 4 }}>
      <Alert icon={false} severity="info">
        There is nothing to see here. Please{" "}
        <Link component={RouterLink} to="/">
          go to the home page
        </Link>
        .
      </Alert>
    </Container>
  );
}
