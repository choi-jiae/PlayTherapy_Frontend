import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Box,
  Button
} from "@mui/material";

import { useRouter } from "next/navigation";
import { useAuth } from "@/utils/AuthContext";
import Cookies from 'js-cookie';


const Profile = () => {
  const { state, dispatch } = useAuth();
  

  const handleLogoutClick = async() => {
    try {
      Cookies.remove('authToken');
      dispatch({ type: "logout" });

    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <Box mt={1} py={1} px={2}>
    <Button
      href="/authentication/signin"
      variant="outlined"
      color="primary"
      component={Link}
      fullWidth
      onClick={handleLogoutClick}
    >
      Logout
    </Button>
  </Box>
  );
};

export default Profile;
