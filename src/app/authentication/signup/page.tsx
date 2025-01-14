"use client";
import { Grid, Box, Card, Typography, Stack } from "@mui/material";
import Link from "next/link";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import AuthSignup from "../auth/AuthSignup";

const Signup2 = () => (
  <PageContainer title="Signup" description="this is Signup page">
    <Box
      sx={{
        position: "relative",
        "&:before": {
          content: '""',
          background: "radial-gradient(#d2f1df, #d3d7fa, #bad8f4)",
          backgroundSize: "400% 400%",
          animation: "gradient 15s ease infinite",
          position: "absolute",
          height: "100%",
          width: "100%",
          opacity: "0.3",
        },
      }}
    >
      <Grid
        container
        spacing={0}
        justifyContent="center"
        sx={{ height: "100vh" }}
      >
        <Grid
          item
          xs={12}
          sm={12}
          lg={4}
          xl={3}
          display="flex"
          justifyContent="center"
          alignItems="center"
          sx={{ overflow: "hidden", maxHeight: "100vh"}}
        >
          <Card
            elevation={9}
            sx={{ p: 4, zIndex: 1, width: "100%", maxWidth: "500px", height: "100%", overflow: "auto",}}
          >
            <Box display="flex" alignItems="center" justifyContent="center">
            </Box>
            <AuthSignup
              title="SIGN UP"
              subtext={
                <Typography
                  variant="subtitle1"
                  textAlign="center"
                  color="textSecondary"
                  mb={1}
                >
                  회원 가입 정보를 입력해주세요
                </Typography>
              }
              subtitle={
                <Stack
                  direction="row"
                  justifyContent="center"
                  spacing={1}
                  mt={3}
                >
                  <Typography
                    color="textSecondary"
                    variant="h6"
                    fontWeight="400"
                  >
                    이미 가입하셨나요?
                  </Typography>
                  <Typography
                    component={Link}
                    href="/authentication/signin"
                    fontWeight="500"
                    sx={{
                      textDecoration: "none",
                      color: "primary.main",
                    }}
                  >
                    로그인 하기
                  </Typography>
                </Stack>
              }
            />
          </Card>
        </Grid>
      </Grid>
    </Box>
  </PageContainer>
);

export default Signup2;
