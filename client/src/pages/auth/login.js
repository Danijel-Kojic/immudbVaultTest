import { Box, Grid, Typography } from "@mui/material";
import MainCard from "components/MainCard";

import AuthLogin from "sections/auth/AuthLogin";

export default function Login() {
  return (
    <Box sx={{ minHeight: "100vh" }}>
      <Grid
        container
        direction="column"
        justifyContent="center"
        sx={{
          minHeight: "100vh",
        }}
      >
        <Grid item xs={12}>
          <Grid
            item
            xs={12}
            container
            justifyContent="center"
            alignItems="center"
          >
            <Grid item>
              <MainCard
                sx={{
                  maxWidth: { xs: 400, lg: 475 },
                  margin: 3,
                  "& > *": {
                    flexGrow: 1,
                    flexBasis: "50%",
                  },
                }}
                content={false}
              >
                <Box sx={{ p: { xs: 2, sm: 3, md: 4, xl: 5 } }}>
                  <Typography variant="h4" pb={3}>
                    Login
                  </Typography>
                  <AuthLogin />
                </Box>
              </MainCard>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}
