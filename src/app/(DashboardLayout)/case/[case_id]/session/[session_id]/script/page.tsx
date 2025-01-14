'use client'
import React, { useEffect, useState, useMemo, useRef } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import { AuthState, AuthAction, useAuth } from "@/utils/AuthContext";
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context';
import { useRouter, useParams } from 'next/navigation';
import https from 'https';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import { Stack,
        Button,
        Box,
        IconButton
    } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import DownloadIcon from '@mui/icons-material/Download';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import ScriptBlock from '@/app/(DashboardLayout)/components/script/ScriptBlock';
import EditModeScriptBlock from '@/app/(DashboardLayout)/components/script/EditModeScriptBlock';
import { useCaseInfo } from '@/utils/CaseInfoContext';
import { useSessionInfo } from '@/utils/SessionInfoContext';
import { useScript } from '@/utils/ScriptContext';

interface EnvData {
    apiUrl: string;
    baseUrl: string;
}

interface ErrorResponseType {
    message: string;
    error_code: number;
}

interface Scripts {
    speaker: string;
    start_time: string;
    end_time: string;
    text: string;
}


function isErrorResponseType(obj: any): obj is ErrorResponseType {
    return obj && typeof obj === 'object' && 'message' in obj && 'error_code' in obj;
}

async function getVideo(env_data: EnvData, router: AppRouterInstance, state: AuthState, dispatch: React.Dispatch<AuthAction>, case_id: number, session_id: number) {
    try {
        const ApibaseUrl = env_data.apiUrl;
        const authToken = Cookies.get('authToken');
        const agent = new https.Agent({
            rejectUnauthorized: false, // local test시 false
          });

        const response = await axios.get(`${ApibaseUrl}/contents/api/case/${case_id}/session/${session_id}/video`,
            {   httpsAgent: agent,
                headers: {'Authorization': `Bearer ${authToken}`},
                responseType: "blob"
            },

        )
        
        if (response.status === 200) {
            console.log('get video successfully');
            return response;
        }

    } catch (error) {
        console.log('get video api error');
        console.log(error);
        if ((axios.isAxiosError(error)) && error.response) {
            const status = error.response?.status;
            const data = error.response?.data;

            if (data instanceof Blob) {
                const reader = new FileReader();
                reader.onload = function() {
                    if (typeof reader.result === 'string') {
                        const jsonData = JSON.parse(reader.result);
                        console.log(jsonData);

                        if (status === 401 && isErrorResponseType(jsonData)) {
                            if (jsonData.error_code === 0) {
                                alert(jsonData.message);
                                Cookies.remove('authToken');
                                dispatch(({ type: 'logout' }));
                                router.push('/authentication/signin');
                            }
                        } else if (status === 400 && isErrorResponseType(jsonData)) {
                            if (jsonData.error_code === 5) {
                                alert(jsonData.message);
                            } else if (jsonData.error_code === 3) {
                                alert(jsonData.message);
                            } else if (jsonData.error_code === 2) {
                                alert(jsonData.message);
                            }
                        }
                    }
                };
                
                
                
                reader.readAsText(data);
            }
            

            console.log(error);
        }
        
    }
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


const Script = () => {
    
    const router = useRouter();
    const { state, dispatch } = useAuth();
    const [videoUrl, setVideoUrl] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const params = useParams();
    const { CaseInfoState, CaseInfoDispatch } = useCaseInfo();
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const { ScriptState, ScriptDispatch } = useScript();
    const { SessionInfoState, SessionInfoDispatch } = useSessionInfo();

    useEffect(() => {
        const fetchVideo = async (envData: EnvData) => {
            console.log(envData);
            const response = await getVideo(envData, router, state, dispatch, Number(params?.case_id), Number(params?.session_id));

            if (response?.status !== 200 && response?.status !== 201){
                alert('Failed to load video');
            } else {
                setVideoUrl(URL.createObjectURL(response.data));
            }
            
            
        };
        const fetchCaseInfo = async () => {
            const caseInfo = await getCaseInfo(router, state, dispatch, Number(params?.case_id));
            CaseInfoDispatch({ 
              type: 'GET_CASE_INFO', 
              caseInfo: caseInfo 
            });
          };

        const fetchScript = async () => {
            const script = await downloadScript(router, state, dispatch, Number(params?.case_id), Number(params?.session_id));
            ScriptDispatch({
                type: 'GET_SCRIPT',
                scriptData: script
            });
        }

        const fetchSessionInfo = async () => {
            const sessionInfo = await getSessionInfo(router, state, dispatch, Number(params?.case_id), Number(params?.session_id));
            SessionInfoDispatch({
                type: 'GET_SESSION_INFO',
                sessionInfo: sessionInfo
            });
        }

        async function getEnvData() {
            try {
                const response = await fetch('/api/envdata');
                const data = await response.json();
                return data;
            } catch (error) {
              console.error("Failed to get env data", error);
            }
          }

    async function initialize(){
        const envData = await getEnvData();
        if (envData) {
            fetchVideo(envData);
            fetchCaseInfo();
            fetchScript();
            fetchSessionInfo();
        }

    }

    initialize();
        
    },[]);

    const handleLoadedData = () => {
        setIsLoading(false);
    };

    const handleSaveClick = async(): Promise<void> => {
        let isClient = typeof window !== 'undefined';
        if (isClient) {
            try {
                const response = await axios.post(`/api/case/${params?.case_id}/session/${params?.session_id}/script`, 
                ScriptState.PresentScriptData.scriptData, {
                    headers: { 'Content-Type': 'application/json' },
                });

                if (response.status === 200) {
                    alert('Script saved successfully');
                }       
            } catch (error){
                console.log('save script failed');
                if ((axios.isAxiosError(error)) && error.response) {
                    const status = error.response?.status;
                    const data = error.response?.data;
                    console.log(data);
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
        ScriptDispatch({
            type: 'SAVE_SCRIPT'
        })

    }
    
    const setVideoRef = (ref: HTMLVideoElement) => {
        videoRef.current = ref;
    }
   
    const handleUndoClick = () => {
        ScriptDispatch({
            type: 'UNDO'
        });
    }

    const handleRedoClick = () => {
        ScriptDispatch({
            type: 'REDO'
        });
    }

    const scriptFormat = (scripts: Scripts[]) => {
         let scriptsCopy = JSON.parse(JSON.stringify(scripts));

        // 첫 시작은 무조건 C로 시작
        if (scriptsCopy[0].speaker === 'T'){
            const newFirstScript = { 
                speaker: 'C', 
                start_time: '00:00:00',
                end_time: scriptsCopy[0].start_time,
                text: ''
            };
            scriptsCopy.unshift(newFirstScript);
        }

        // 마지막이 C로 끝나면 T로 끝내기
        if (scriptsCopy[scriptsCopy.length-1].speaker === 'C'){
            const newLastScript = { 
                speaker: 'T', 
                start_time: scriptsCopy[scriptsCopy.length-1].end_time,
                end_time: SessionInfoState.sessionInfo?.video_length,
                text: ''
            };
            scriptsCopy.push(newLastScript);
        }

        let count = 0;
        let now_speaker = '';
        for (let i = 0; i < scriptsCopy.length; i++) {

            if ( i !== 0 && scriptsCopy[i].speaker === now_speaker){
                scriptsCopy[i].speaker = '';
            } else {
                now_speaker = scriptsCopy[i].speaker;

                if (scriptsCopy[i].speaker === 'C') {
                    count++;
                }

                scriptsCopy[i].speaker += count;   
            }

        }
        return scriptsCopy;
    }

    const handleDownloadClick = () => {
        const data = scriptFormat(ScriptState.PresentScriptData.scriptData.scripts);
        // 키 순서 변경
        const formattedData = data.map((value: Scripts) => ({
            speaker: value.speaker,
            text: value.text
        }));

        const textContent = formattedData.map((
            item: {
                speaker: String, 
                text: String
            }) => item.speaker + ' ' + item.text).join('\n');
        
        const dataUrl = 'data:text/plain;charset=utf-8,' + encodeURIComponent(textContent);

        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `${CaseInfoState.caseInfo.family_name+CaseInfoState.caseInfo.given_name}_${SessionInfoState.sessionInfo?.name}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }


    return (
        <Stack direction="row" spacing={4} style={{height: '550px'}}>
            <Stack direction="column" spacing={4} alignItems="center" justifyContent="center">
            {isLoading && <div>Loading...영상 로딩 시 30초 정도 소요됩니다.</div>}
            <video ref={videoRef} src={videoUrl} controls style={{width: '600px', height: '400px'}} onLoadedData={handleLoadedData}/>

            </Stack>
            <Stack direction="column">
            <Box display="flex" justifyContent="flex-end">
                <IconButton
                    onClick={handleUndoClick}
                    color="primary"
                    size="medium"
                    style={{margin: '10px'}}
                    disabled={ScriptState.UndoStack.length === 0 ? true : false}
                >
                    <UndoIcon/>
                </IconButton>
                <IconButton
                    onClick={handleRedoClick}
                    color="primary"
                    size="medium"
                    style={{margin: '10px'}}
                    disabled={(!ScriptState.undoClicked)||(ScriptState.RedoStack.length === 0) ? true : false}
                >   
                    <RedoIcon/>
                </IconButton>
                <Button 
                        variant='contained'
                        startIcon={<SaveIcon/>} 
                        onClick={handleSaveClick} 
                        color="primary"
                        size="medium"
                        style={{margin: '10px'}}
                        disabled={ScriptState.isEdited ? false : true}
                >
                    Save Script
                </Button>
                <Button
                    variant='contained'
                    startIcon={<DownloadIcon/>}
                    color= 'primary'
                    size='medium'
                    style={{margin: '10px'}}
                    onClick={handleDownloadClick}
                >
                    Download Script
                </Button>
            </Box>
            <DashboardCard style={{overflow: 'auto', height: '100%', width: '100%'}}>
            <div>
                {
                
                ScriptState.PresentScriptData.scriptData.scripts.map((value, index) => (
                    ScriptState.PresentScriptData.isEditMode[index] ?
                    <EditModeScriptBlock 
                        key={index}
                        index={index}
                        />
                    : <ScriptBlock
                        key={index}
                        index={index}
                        videoRef={videoRef}
                        setVideoRef={setVideoRef}
                        />
                ))}

            </div>
            </DashboardCard>
            </Stack>
            
        </Stack>
    );
};

export default Script;