'use client'
import React, { useState, useEffect } from 'react';
import data from './test_report.json';
import { useCaseInfo } from '@/utils/CaseInfoContext';
import { useSessionInfo } from '@/utils/SessionInfoContext';
import { AuthState, AuthAction, useAuth } from "@/utils/AuthContext";
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter, useParams } from 'next/navigation';

import HorizontalBarChart from '@/app/(DashboardLayout)/components/analyze/HorizontalBarChart';
import { Stack, Box, Typography } from '@mui/material';
import LineChart from '@/app/(DashboardLayout)/components/analyze/LineChart';

interface ErrorResponseType {
  message: string;
  error_code: number;
}

function isErrorResponseType(obj: any): obj is ErrorResponseType {
  return obj && typeof obj === 'object' && 'message' in obj && 'error_code' in obj;
}

// get case_id info api
async function getCaseInfo(router: AppRouterInstance, state: AuthState, dispatch: React.Dispatch<AuthAction>, case_id: number) {

  try {
      const response = await axios.get(`/api/case/${case_id}`, {
      });

      if (response.status === 200) {
        console.log(response.data);
        return response.data;
      }
  } catch (error) {
      console.log('get case api error');
      if ((axios.isAxiosError(error)) && error.response) {
          const status = error.response?.status;
          const data = error.response?.data;

          if (status === 401 && isErrorResponseType(data)) {
              if (data.error_code === 0) {
                  alert(data.message);
                  Cookies.remove('authToken');
                  dispatch(({ type: 'logout' }));
                  router.push('/authentication/signin');
              }
          } else if (status === 400 && isErrorResponseType(data)) {
              if (data.error_code === 0) {
                  alert(data.message);
              }
          }
          console.log(error);
      }
  }
}

async function getSessionList(
  router: AppRouterInstance, 
  state: AuthState, 
  dispatch: React.Dispatch<AuthAction>,
  case_id: number,
  keyword: string,
  skip?: number,
  limit?: number
) {
  try {
    console.log('getSessionList');
      const response = await axios.get(`/api/case/${case_id}/session`, {
          params: {
              keyword: keyword,
              skip: skip,
              limit: limit
          },
      });

      if (response.status === 200) {
          return response.data;
      }
  } catch (error) {
      console.log('get session list api error');
      if ((axios.isAxiosError(error)) && error.response) {
          const status = error.response?.status;
          const data = error.response?.data;

          if (status === 401 && isErrorResponseType(data)) {
              if (data.error_code === 0) {
                  alert(data.message);
                  Cookies.remove('authToken');
                  dispatch(({ type: 'logout' }));
                  router.push('/authentication/signin');
              }
          } else if (status === 400 && isErrorResponseType(data)) {
              if (data.error_code === 0) {
                  alert(data.message);
              }
          }
          console.log(error);
      }
  }
}

const CaseAnalyzeResult = () => {
  const router = useRouter();
  const params = useParams();
  const { CaseInfoState, CaseInfoDispatch } = useCaseInfo();
  const { SessionInfoState, SessionInfoDispatch } = useSessionInfo();
  const { state, dispatch } = useAuth();
  const negativeItems = ['평가', '질문', '놀잇감 명명', '활동제안'];
  const [ category, setCategory ] = useState('');

  const positiveItemReport = Object.values(data.reports).filter(report => !negativeItems.includes(report.category));
  const negativeItemReport = Object.values(data.reports).filter(report => negativeItems.includes(report.category));
  
  useEffect(() => {
    const fetchCaseInfo = async () => {
      const caseInfo = await getCaseInfo(router, state, dispatch, Number(params?.case_id));
      CaseInfoDispatch({
        type: 'GET_CASE_INFO',
        caseInfo: caseInfo
      });
    }

    const fetchSessionList = async () => {
      console.log('fetchSessionList');
      const sessionList = await getSessionList(router, state, dispatch, Number(params?.case_id), '');
      SessionInfoDispatch({
        type: 'GET_SESSION_LIST',
        sessionList: sessionList
      });
    }
    fetchCaseInfo();
    fetchSessionList();
  }, []);

  console.log(SessionInfoState.sessionList);

  return (
    <div>
    <Typography variant="h4" style={{marginBottom: '20px'}}>
        {(CaseInfoState.caseInfo?.family_name || "")+CaseInfoState.caseInfo.given_name} 분석 결과
    </Typography>
    <Stack direction="row" spacing={1} justifyContent="stretch">
        <div style={{maxHeight: '100vh', maxWidth: '50%'}}>
            <HorizontalBarChart 
                categories = {Object.values(positiveItemReport).map(report => report.category)}
                name = "Positive"
                data = {Object.values(positiveItemReport).map(report => report.level)}
                label = "positive"
                colors = {['#FFE3F6', '#FDCEFF', '#EAC1FF', '#D4B5FF', '#BBA9FF', '#9F9FFF', '#7C95FF', '#488CFF', '#0085E5', '#007DBD']}
                setCategory = {setCategory}
            />
    
    
            <HorizontalBarChart
                categories={Object.values(negativeItemReport).map(report => report.category)}
                name="Negative"
                data={Object.values(negativeItemReport).map(report => report.level)}
                label = "negative"
                colors = {['#FFD700', '#FFB14E', '#FA8775', '#CD5C5C']}
                setCategory = {setCategory}
            />

            
       
        
        </div>
        <div style={{flex: 1}}>
        <LineChart  
          categories={Object.values(data.reports).map(report => report.category)}
          data={Object.values(data.reports).map(report => report.prompt_results)}
          selectCategory={category}
          setCategory = {setCategory}
          sessionIdList = {Object.values(SessionInfoState.sessionList ?? []).map(session => session.id)}
        />
      </div>
    </Stack>

    
</div>
  );
};

export default CaseAnalyzeResult