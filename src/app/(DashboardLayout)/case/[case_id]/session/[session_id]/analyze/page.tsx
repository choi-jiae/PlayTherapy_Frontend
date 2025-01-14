'use client'
import React, { useEffect, useState } from 'react';
import HorizontalBarChart from '@/app/(DashboardLayout)/components/analyze/HorizontalBarChart';
import { Stack, Box, Typography, Button } from '@mui/material';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import { AuthState, AuthAction, useAuth } from "@/utils/AuthContext";
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useScript } from '@/utils/ScriptContext';
import { useCaseInfo } from '@/utils/CaseInfoContext';
import { useSessionInfo } from '@/utils/SessionInfoContext';
import { useRouter, useParams } from 'next/navigation';
import InteractionBlock from '@/app/(DashboardLayout)/components/analyze/InteractionBlock';
import { useSessionReport } from '@/utils/SessionReportContext';

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

// get session_id info api
async function getSessionInfo(router: AppRouterInstance, state: AuthState, dispatch: React.Dispatch<AuthAction>, case_id: number, session_id: number) {
    try {
        const response = await axios.get(`/api/case/${case_id}/session/${session_id}`, {
        });

        if (response.status === 200) {
            console.log(response.data);
            return response.data;
        }
    } catch (error){
        console.log('get session api error');
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

  // download script api
  async function downloadScript(router: AppRouterInstance, state: AuthState, dispatch: React.Dispatch<AuthAction>, case_id: number, session_id: number) {
    try {
        const response = await axios.get(`/api/case/${case_id}/session/${session_id}/script`, {
        });
        
        if (response.status === 200) {
            console.log(response.data);
            return response.data;
        }
    } catch (error){
        console.log('download script api error');
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

async function getSessionReport(
    router: AppRouterInstance, 
    state: AuthState, 
    dispatch: React.Dispatch<AuthAction>,
    case_id: number,
    session_id: number
  ){
    try {
      console.log('getSessionReport');
      const response = await axios.get(`/api/case/${case_id}/session/${session_id}/analyze-report`, {
      });
  
      if (response.status === 200) {
        console.log(response.data);
        return response.data;
      }
    } catch (error) {
      console.log('get session report api error');
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
  

const AnalyzeResult = () => {
    const router = useRouter();
    const params = useParams();
    const [analyzeResult, setAnalyzeResult] = useState(null);
    const { ScriptState, ScriptDispatch } = useScript();
    const { CaseInfoState, CaseInfoDispatch } = useCaseInfo();
    const { SessionInfoState, SessionInfoDispatch } = useSessionInfo();
    const { SessionReportState, SessionReportDispatch } = useSessionReport();
    const { state, dispatch } = useAuth();
    const negativeItems = ['Evaluation', 'Questioning', 'Naming Toys', 'Activity Suggestion'];
    const [ category, setCategory ] = useState('');

    const positiveItemReport = Object.values(SessionReportState.sessionReport.reports).filter(report => !negativeItems.includes(report.category));
    const negativeItemReport = Object.values(SessionReportState.sessionReport.reports).filter(report => negativeItems.includes(report.category));
    
    useEffect(()=>{
        const fetchCaseInfo = async () => {
            const caseInfo = await getCaseInfo(router, state, dispatch, Number(params?.case_id));
            CaseInfoDispatch({ 
              type: 'GET_CASE_INFO', 
              caseInfo: caseInfo 
            });
        }
        
        const fetchSessionInfo = async () => {
            const sessionInfo = await getSessionInfo(router, state, dispatch, Number(params?.case_id), Number(params?.session_id));
            SessionInfoDispatch({
                type: 'GET_SESSION_INFO',
                sessionInfo: sessionInfo
            });
        }
        const fetchScript = async () => {
            const script = await downloadScript(router, state, dispatch, Number(params?.case_id), Number(params?.session_id));
            ScriptDispatch({
                type: 'GET_SCRIPT',
                scriptData: script
            });
        }

        
        const fetchSessionReport = async () => {
            console.log('fetchSessionReport');
            console.log(Number(params?.case_id));
            console.log(Number(params?.session_id));
            const sessionReport = await getSessionReport(router, state, dispatch, Number(params?.case_id), Number(params?.session_id));
            SessionReportDispatch({
            type: 'GET_SESSION_REPORT',
            sessionReport: sessionReport
            });
        }
        
        
        fetchCaseInfo();
        fetchSessionInfo();
        fetchScript();
        fetchSessionReport();

    }, []);

    const getFirstKeyValuePairAsString = (obj: { [key: string]: any }) => {
        const [key, value] = Object.entries(obj)[0];
        return `${key}: ${value}`;
    };

    const getSecondKeyValuePairAsString = (obj: { [key: string]: any }) => {
        const [key, value] = Object.entries(obj)[1];
        return `${key}: ${value}`;
    };

    const interactions = Object.values(SessionReportState.sessionReport.reports)
        .filter(report => category2kor(report.category) === category)
        .flatMap(report => report.interactions);

    const descriptions = Object.values(SessionReportState.sessionReport.reports)
        .filter(report => category2kor(report.category) === category)
        .flatMap(report => report.descriptions);

    console.log(descriptions);

    function category2kor(category: string){
        switch(category){
            case 'Structuring':
                return '구조화';
            case 'Concentration':
                return '주의 집중';
            case 'Tone of Voice':
                return '목소리의 톤';
            case "Setting Limits":
                return '제한 설정';
            case 'Termination':
                return '종료 하기';
            case 'Decision-Making and Responsibility':
                return '의사결정권과 책임감';
            case 'Self-Esteem and Encouragement':
                return '자아존중감과 격려';
            case 'Emotion Reflection':
                return '감정 반영';
            case 'Content Reflection':
                return '내용 반영';
            case 'Behavior Tracking':
                return '행동 트래킹';
            case 'Evaluation':
                return '평가';
            case 'Questioning':
                return '질문';
            case 'Naming Toys':
                return '놀잇감 명명';
            case 'Activity Suggestion':
                return '활동제안';
            default:
                return '기타';
        }
    }

    return (
        <div>
            <Stack direction="row" spacing={2}>
                <Typography variant="h4" style={{marginBottom: '20px'}}>
                        {(CaseInfoState.caseInfo.family_name || "" )+CaseInfoState.caseInfo.given_name} - {SessionInfoState.sessionInfo?.name} 분석 결과
                </Typography>
                <Button
                    variant='contained'
                    color='primary'
                    onClick={() => router.push(`/case/${params?.case_id}/analyze`)}
                >
                    case analyze
                </Button>
            </Stack>
            
            <Stack direction="row" spacing={3} justifyContent="space-evenly">
                <div style={{maxHeight: '100vh', maxWidth: '50%'}}>
                    <HorizontalBarChart 
                        categories = {Object.values(positiveItemReport).map(report => category2kor(report.category))}
                        name = "Positive"
                        data = {Object.values(positiveItemReport).map(report => report.level)}
                        label = "positive"
                        colors = {['#FFE3F6', '#FDCEFF', '#EAC1FF', '#D4B5FF', '#BBA9FF', '#9F9FFF', '#7C95FF', '#488CFF', '#0085E5', '#007DBD']}
                        setCategory = {setCategory}
                    />
            
            
                    <HorizontalBarChart
                        categories={Object.values(negativeItemReport).map(report => category2kor(report.category))}
                        name="Negative"
                        data={Object.values(negativeItemReport).map(report => report.level)}
                        label = "negative"
                        colors = {['#FFD700', '#FFB14E', '#FA8775', '#CD5C5C']}
                        setCategory = {setCategory}
                    />
               
                
                </div>
                <Stack direction="column" spacing={3} justifyContent="space-evenly" style={{height: '100vh', width: '50%'}}>
                    <DashboardCard 
                        title= "Script"
                        style={{overflow: 'auto', height: '50%', width: '100%'}}>
                        <Box height={'100%'}>
                            {category == '' ?
                            ScriptState.PresentScriptData.scriptData.scripts.map((script, index) => (
                                <React.Fragment key={index}>
                                    <p>{script.speaker}</p>
                                    <p>{script.text}</p>
                                </React.Fragment>
                            )) :
                            interactions.map((interaction, index) => (
                                <InteractionBlock 
                                    key={index}
                                    index={index}
                                    child_speak={getFirstKeyValuePairAsString(interaction)}
                                    teacher_speak={getSecondKeyValuePairAsString(interaction)}
                                    description={interaction.description}
                                />
                                    
                            ))}
                        </Box>
                    </DashboardCard>

                    <DashboardCard 
                        title = {category}
                        style={{overflow: 'auto', height: '50%', width: '100%'}}>
                        <div>
                            {descriptions.map((description, index) => (
                                <React.Fragment key={index}>
                                    <p>{description}</p>
                                </React.Fragment>
                            ))}
                            
                            
                            
                        </div>
                    </DashboardCard>
                </Stack>
            </Stack>
            
        </div>
    );
};

export default AnalyzeResult;