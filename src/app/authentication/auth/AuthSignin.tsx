import React, {useEffect, useState} from "react";
import {
  Box,
  Typography,
  Button,
  Stack,
  Checkbox,
} from "@mui/material";
import { useAuth } from "@/utils/AuthContext";

import CustomTextField from "@/app/(DashboardLayout)/components/forms/theme-elements/CustomTextField";
import axios, { AxiosError } from "axios";

interface signinType {
  title?: string;
  subtitle?: JSX.Element | JSX.Element[];
  subtext?: JSX.Element | JSX.Element[];
}

interface ErrorResponseType {
  error_code: number;
  message: string;
}

function isErrorResponseType(obj: any): obj is ErrorResponseType {
  return obj && typeof obj === 'object' && 'message' in obj && 'error_code' in obj;
}

const AuthSignin = ({ title, subtitle, subtext }: signinType) => {
  const { dispatch } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [emailError, setemailError] = useState('');
  const [passwordError, setpasswordError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setemailError(''); 
    setpasswordError('');
  };
  
  const handleSigninClick = async(event: React.FormEvent): Promise<void> => {
    event.preventDefault()
    let isClient = typeof window !== 'undefined';
    if (formData.email === '') setemailError('이메일을 입력해주세요.');
    if (formData.password === '') setpasswordError('비밀번호를 입력해주세요.');
    if (isClient) {
      if (formData.email && formData.password) {
        try {
          const response = await axios.post(`/api/auth/signin`, formData, {
            headers: { 'Content-Type': 'application/json' },
          });

          if (response.status === 200) {
            dispatch({ type: 'signin'});
            console.log('signin success.');
          }
        } catch (error) {
          console.log('signin failed.');
            if (axios.isAxiosError(error)) {
              const status = error.response?.status;
              const data = error.response?.data;
              console.log(data);
              if (status === 404 && isErrorResponseType(data)) {
                if (data.error_code === 0){
                  setemailError('이메일 또는 비밀번호가 일치하지 않습니다.');
                  setpasswordError('이메일 또는 비밀번호가 일치하지 않습니다.');
                } 
              } else if (status === 500) {
                alert(data.message);
              }
          }else{
            console.error('Error:', error);
          }
              }
            } 
          }

  };

  return (
  <>
    {title ? (
      <Box display="flex" alignItems="center" justifyContent="center" margin='8px'>
        <Typography fontWeight="700" variant="h2" color='textSecondary' mb={1}>
          {title}
        </Typography>
      </Box>
    ) : null}

    {subtext}

    <form onSubmit= {handleSigninClick}>
    <Stack>
      <Box>
        <Typography
          variant="subtitle1"
          fontWeight={600}
          component="label"
          htmlFor="email"
          mb="5px"
        >
          이메일
        </Typography>
        <CustomTextField 
          variant="outlined"
          fullWidth
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          required
          error = {Boolean(emailError)}
          helperText = {emailError}
        />
      </Box>
      <Box mt="25px">
        <Typography
          variant="subtitle1"
          fontWeight={600}
          component="label"
          htmlFor="password"
          mb="5px"
        >
          비밀번호
        </Typography>
        <CustomTextField
          type="password"
          variant="outlined"
          fullWidth
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          required
          error = {Boolean(passwordError)}
          helperText = {passwordError}
        />
      </Box>
      <Stack
        justifyContent="space-between"
        direction="row"
        alignItems="center"
        my={2}
      >
      </Stack>
    </Stack>
    <Button
      color="primary"
      variant="contained"
      size="large"
      fullWidth
      type="submit"
    >
      로그인
    </Button>
    </form>
    {subtitle}
  </>
)};


export default AuthSignin;
