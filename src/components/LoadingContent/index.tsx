import { Stack, Box, CircularProgress, Typography } from "@mui/material";

export default function LoadingContent({ text }: { text?: string }) {
  return (
    <Stack justifyContent="center" alignItems="center" height="100%">
      <Box textAlign="center">
        {typeof text === "undefined" ? (
          <CircularProgress />
        ) : (
          <>
            <CircularProgress sx={{ mb: 1 }} />
            <Typography variant="body1" component="p">
              {text}
            </Typography>
          </>
        )}
      </Box>
    </Stack>
  );
}
