"use client";
import Link from "next/link";
import { Grid, Box, Card, Stack, Typography } from "@mui/material";
// components
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import AuthSignin from "../auth/AuthSignin";
import { useAuth } from "@/utils/AuthContext";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuthCheck } from "@/utils/auth";
import ServiceInfo from "@/app/(DashboardLayout)/components/info/ServiceInfo";



const Signin = () => {
  const { state } = useAuth();
  const [envData, setEnvData] = useState({apiUrl: '', baseUrl: ''});
  const router = useRouter();

  useEffect(() => {
    let isClient = typeof window !== 'undefined';
    async function checkAuthStatus() {
      try {
        const authCheckResult = await getAuthCheck();
        console.log(authCheckResult);
        if (authCheckResult.redirect) {
          router.push(authCheckResult.redirect);
        } else if (state.isSignedIn) {
          router.push('/case');
        }
      } catch (error) {
        console.error("Failed to check auth status", error);
      }
    }

    async function getEnvData() {
      try {
        const response = await fetch('/api/envdata');
        const data = await response.json();
        setEnvData(data);
      } catch (error) {
        console.error("Failed to get env data", error);
      }
    }
    
    if (isClient) {
      checkAuthStatus();
      getEnvData();
    }

  }, [state.isSignedIn, router]);

  console.log(envData.apiUrl);
  console.log(envData.baseUrl);

  return (
    <PageContainer title="Signin" description="this is Signin page">
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
            lg={7}
            xl={6}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Card
              elevation={9}
              sx={{ p: 4, zIndex: 1, width: "100%", maxWidth: "1000px" }}
            >
              <Grid 
                container spacing={2}
                direction='row'
              >
                <Grid item xs={6}>
                  <Box display="flex" alignItems="center" justifyContent="center">
                  <img 
                    src={envData.baseUrl + "/images/logos/dsail.png"} 
                    alt="logo"
                    width = '150'
                    />
                  </Box>
                  <ServiceInfo />
                </Grid>
                <Grid item xs={6}>
                  <AuthSignin
                  title="SIGN IN"
                  subtext={
                    <Typography
                      variant="subtitle1"
                      textAlign="center"
                      color="textSecondary"
                      mb={1}
                    >
                      가입하신 이메일 주소로 로그인 하세요
                    </Typography>
                  }
                  subtitle={
                    <Stack
                      direction="row"
                      spacing={1}
                      justifyContent="center"
                      mt={3}
                    >
                      <Typography
                        color="textSecondary"
                        variant="h6"
                        fontWeight="500"
                      >
                        계정이 없으신가요?
                      </Typography>
                      <Typography
                        component={Link}
                        href="/authentication/signup"
                        fontWeight="500"
                        sx={{
                          textDecoration: "none",
                          color: "primary.main",
                        }}
                      >
                        가입 하기
                      </Typography>
                    </Stack>
                  }
                />
                </Grid>
              </Grid>
            </Card>

          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default Signin;