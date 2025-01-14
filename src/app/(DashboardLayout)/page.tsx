'use client'
import { Grid, Box } from '@mui/material';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
// components
import { useAuth } from "@/utils/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAuthCheck } from "@/utils/auth";
const Dashboard = () => {
  const { state } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    let isClient = typeof window !== 'undefined';
    
    async function checkAuthStatus() {
      try {
        const authCheckResult = await getAuthCheck();
        console.log(authCheckResult);
        if (authCheckResult.redirect) {
          router.push(authCheckResult.redirect);
        } else if (!state.isSignedIn) {
          router.push('/authentication/signin');
        }
      } catch (error) {
        console.error("Failed to check auth status", error);
      }
    }
    
    if (isClient) {
      checkAuthStatus();
    }

  }, [state.isSignedIn, router]);

  return (
    <PageContainer title="Dashboard" description="this is Dashboard">
      <Box>
      </Box>
    </PageContainer>
  )
}
export default Dashboard;


