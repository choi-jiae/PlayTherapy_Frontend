'use client'
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import NewDialog from '@/app/(DashboardLayout)/components/shared/NewDialog';
import CircularProgressWithLabel from '@/app/(DashboardLayout)/components/file_upload/CircularProgressWithLabel';
import DropzoneComponent from '../../components/file_upload/DropzoneComponent';
import React, { useEffect, useState, useContext, use } from 'react';
import { useParams, useRouter } from 'next/navigation';

import { 
    Typography,
    Stack,
    Button,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Chip,
    IconButton,
    Pagination,
    Fab,
    TextField,
    CircularProgress,
        
} from '@mui/material';

import AddIcon from '@mui/icons-material/Add';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import PlayCircleOutlineOutlinedIcon from '@mui/icons-material/PlayCircleOutlineOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import axios, { AxiosError } from 'axios';
import { AuthState, AuthAction, useAuth } from "@/utils/AuthContext";
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context';
import Cookies from 'js-cookie';
import { useCaseInfo } from '@/utils/CaseInfoContext';
import SurveyButton from '../../components/buttons/SurveyButton';


interface EnvData {
  apiUrl: string;
  baseUrl: string;
}

interface SessionData {
  id: number;
  name: string;
  session_state_id: number;
  case_id: number;
  source_video_url: string;
  source_script_url: string;
  script_state_id: number;
  analyze_state_id: number;
  created_date: string;
  video_length: number;
  origin_video_url: string;
  encoding_video_url: string;
}

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

// session/total-num api
async function getSessionTotalNum(router: AppRouterInstance, state: AuthState, dispatch: React.Dispatch<AuthAction>, case_id: number, keyword: string) {

  try {
      const response = await axios.get(`/api/case/${case_id}/session/total-num`, {
          params: {
              keyword: keyword,
          },
          });

      if (response.status === 200) {
          return response.data;
      }
  } catch (error) {
      console.log('session total-num api error');
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
          console.log(error);

          } else if (status === 400 && isErrorResponseType(data)) {
              if (data.error_code === 2) {
                  alert(data.message);
              }       
          }
      }
    }
}

// get session api
async function getSessionList(router: AppRouterInstance, state: AuthState, dispatch: React.Dispatch<AuthAction>, case_id: number, keyword: string, skip?: number, limit?: number) {

  try {
      const response = await axios.get(`/api/case/${case_id}/session`, {
          params: {
              skip: skip,
              limit: limit,
              keyword: keyword,
          },
      });

      if (response.status === 200) {
          return response.data;
      }
  } catch (error) {
      console.log('session list api error');
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
              if (data.error_code === 4) {
                alert(data.message);
              } else if (data.error_code === 2) {
                alert(data.message);
              }
          }
          console.log(error);
      }
  }
}

async function getSession(router: AppRouterInstance, state: AuthState, dispatch: React.Dispatch<AuthAction>, case_id: number, session_id: number) {
  
    try {
        const response = await axios.get(`/api/case/${case_id}/session/${session_id}`, {
        });
  
        if (response.status === 200) {
          console.log(response.data);
          return response.data;
        }
    } catch (error) {
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

async function updateSession(router: AppRouterInstance, state: AuthState, dispatch: React.Dispatch<AuthAction>, case_id: number, session_id: number, sessionData: SessionData) {
    
      try {
          const response = await axios.put(`/api/case/${case_id}/session/${session_id}`, 
          {"data": sessionData}, 
          {
            headers: { 'Content-Type': 'application/json' },
          });
    
          if (response.status === 200) {
            console.log(response.data);
            return response.data;
          }
      } catch (error) {
          console.log('update session api error');
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

// get presigned url api
async function getPresignedUrl(router: AppRouterInstance, state: AuthState, dispatch: React.Dispatch<AuthAction>, case_id: number, session_id: number) {
    
    try {
        const response = await axios.get(`/api/case/${case_id}/session/${session_id}/video/presigned-url`, {
        });
  
        if (response.status === 200) {
          console.log(response.data);
          return response.data;
        }
    } catch (error) {
        console.log('get presigned url api error');
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

const SessionList = () => {

    const { CaseInfoState, CaseInfoDispatch } = useCaseInfo();
    const [currentPage, setCurrentPage] = useState(1);
    const [editMode, setEditMode] = useState(false);
    const itemsPerPage = 10;
    const router = useRouter();
    const params = useParams();
    const { state, dispatch } = useAuth();
    const [openSessionDialog, setOpenSessionDialog] = useState(false);
    const [openDropboxDialog, setOpenDropboxDialog] = useState(false);
    const [name, setName] = useState('');
    const [sessionNameError, setSessionNameError] = useState('');
    const [sessionTotalNum, setSessionTotalNum] = useState(0);
    const [sessionList, setSessionList] = useState<SessionData[]>([]);
    const [sessionRefresher, setSessionRefresher] = useState(0);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [selectedSessionId, setSelectedSessionId] = useState<number>(0);
    const [progress, setProgress] = useState<{[key: number]: number}>({});
    const [isLoading, setIsLoading] = useState<{[key: number]: boolean}>({});
    const [ isDone, setIsDone] = useState<{[key: number]: boolean}>({});
    const [envData, setEnvData] = useState<EnvData | null>(null);

    useEffect(() => {

      async function getEnvData() {
        try {
          const response = await fetch('/api/envdata');
          const data = await response.json();
          return data
        } catch (error) {
          console.error("Failed to get env data", error);
        }
      }

      async function initialize() {
        const data = await getEnvData();
        if (data) {
          setEnvData(data);
        }
      }

      initialize();
    }, []);

    useEffect(() => {
      const fetchCaseInfo = async () => {
        const caseInfo = await getCaseInfo(router, state, dispatch, Number(params?.case_id));
        CaseInfoDispatch({ 
          type: 'GET_CASE_INFO', 
          caseInfo: caseInfo 
        });
      };

      if (envData) {
        fetchCaseInfo();
      }
    }, [envData]);

    useEffect(() => {
      const fetchSessionData = async () => {
        // isDone 초기화
        setIsDone(prevState => {
          const newState = {...prevState};
          for (let key in newState) {
            newState[key] = false;
          }
          return newState;
        });

        const keyword = '';

        const totalNumResponse = await getSessionTotalNum(router, state, dispatch, Number(params?.case_id), keyword);
        setSessionTotalNum(totalNumResponse);

        const skip = (currentPage - 1) * itemsPerPage;
        const limit = (currentPage === totalNumResponse) ? undefined : 10;
        const listResponse = await getSessionList(router, state, dispatch, Number(params?.case_id), keyword, skip, limit);
        setSessionList(listResponse);
      };
    
      if (Object.values(isLoading).every(value => value === false)){
        fetchSessionData();
        const intervalId = setInterval(fetchSessionData, 60000);

        return () => clearInterval(intervalId);
      }

    },[currentPage, params?.case_id, sessionRefresher]);

    const handleChangePage = (event: React.ChangeEvent<unknown>, newPage: number) => {
        setCurrentPage(newPage);
    };

    const handleAddClick = (event: React.MouseEvent<unknown>) => {
      setOpenSessionDialog(true);
    };

    const handleFileChange = (file: File | null) => {
      setSelectedFile(file);
    }

    const handleCreate = async(): Promise<void> => {
      if (name === '') {
        setSessionNameError('Session 이름을 입력해주세요.');
        return;
      } else{
        let isClient = typeof window !== 'undefined';
        if (isClient){
          // create session
          try {
            const sessionResponse = await axios.post(`/api/case/${CaseInfoState.caseInfo.id}/session`, {
              data: {
                id: null,
                name: name,
                session_state_id: null,
                case_id: null,
                source_video_url: null,
                source_script_url: null,
                script_state_id: null,
                analyze_state_id: null,
                created_date:null,
                video_length: null,
                origin_video_url:null,
                encoding_video_url: null,
              }
            }, {
              headers: { 'Content-Type': 'application/json' },
            });

            if (sessionResponse.status === 200) {
              console.log('session created');
              console.log(sessionResponse.data);
              setOpenSessionDialog(false);

            }
          } catch (error) {
            console.log('create session error');

            if (axios.isAxiosError(error)) {
              console.log(error);
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
                if (data.error_code === 2) {
                  alert(data.message);
                }
              }

            }
          }
      }}
      setSessionRefresher(sessionRefresher + 1);
  }

  const getVideoDuration = async(file: File) => {
    return new Promise<string>((resolve) => {
      const videoUrl = URL.createObjectURL(file);
      const video = document.createElement('video');
  
      video.onloadedmetadata = function() {
        const date = new Date(0);
        date.setSeconds(video.duration); // specify value for SECONDS here
        const timeString = date.toISOString().substr(11, 8);
        resolve(timeString);
      }
      video.src = videoUrl;
    });
  }

  const handleVideoUpload = async(event: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
    console.log('video upload');
    const session_id = selectedSessionId;
    const file = selectedFile;

    setOpenDropboxDialog(false);
    setIsLoading(prevState => ({
      ...prevState,
      [selectedSessionId]: true,
    }));
    let isClient = typeof window !== 'undefined';
      if (isClient){
          //upload video
        if (file){
          try {
            // get session data
            let sessionData = await getSession(router, state, dispatch, CaseInfoState.caseInfo.id, session_id);
            
            // get video duration
            const videoDuration = await getVideoDuration(file);
            sessionData.video_length = videoDuration;

            // put session data
            await updateSession(router, state, dispatch, CaseInfoState.caseInfo.id, session_id, sessionData);

            // 새로고침 방지
            window.addEventListener('beforeunload', (event) => {
            event.preventDefault();
            event.returnValue = "";
            })


            console.log('file', file.type);
            console.log(envData);
            try {
              const presignedUrlData = await getPresignedUrl(router, state, dispatch, CaseInfoState.caseInfo.id, session_id);
  
              const presignedUrl = presignedUrlData.presigned_url;
              const filePath = presignedUrlData.file_path;

              console.log('presignedUrl', presignedUrl);
              console.log('filePath', filePath);

              const videoUploadResponse = await axios.put(presignedUrl, file, {
                headers: {
                  'Content-Type': file.type,
                },
                onUploadProgress: (progressEvent) => {
                  if (progressEvent.total){
                  const progress = Math.round((progressEvent.loaded / progressEvent.total)*100);
                  setProgress(
                    prevState => ({
                      ...prevState,
                      [selectedSessionId]: progress,
                    })
                  );
                  }
                },
              });
              
              if (videoUploadResponse.status === 200) {
                console.log('Upload succesful');
                sessionData.origin_video_url = filePath;
                await updateSession(router, state, dispatch, CaseInfoState.caseInfo.id, session_id, sessionData);
              }

            } catch (error) {
              console.log('upload video error');
              console.log(error);
            }


            setIsLoading(prevState => ({
              ...prevState,
              [selectedSessionId]: false,
            }));

            setIsDone(prevState => ({
              ...prevState,
              [selectedSessionId]: true,
            }));


            window.removeEventListener('beforeunload', (event) => {
              event.preventDefault();
              event.returnValue = "";
            });
            
          } catch (error) {
            console.log('upload video error');
            console.log(error);
            setIsLoading(prevState => ({
              ...prevState,
              [selectedSessionId]: false,
            }));

            if (axios.isAxiosError(error)) {
              console.log(error);
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
                if (data.error_code === 2) {
                  alert(data.message);
                } else if (data.error_code === 3) {
                  alert(data.message);
                } else if (data.error_code === 1000) {
                  alert(data.message);
                }
              }
            }
          }
        } else {
          alert('파일을 선택해주세요');
        }
        
      }

  }
  const handleDropboxDialog = (session_id: number) => {
    setSelectedSessionId(session_id);
    setOpenDropboxDialog(true);
  }

  const handleClose = () => {
    setOpenDropboxDialog(false);
};

    const handleEditClick = (event: React.MouseEvent<unknown>) => {
      console.log('edit click');
      setEditMode(!editMode);
    }

    const handleSaveClick = async(): Promise<void> => {
      let isClient = typeof window !== 'undefined';
      if (isClient){
        try {
          const response = await axios.put(`/api/case/${CaseInfoState.caseInfo.id}`, CaseInfoState.caseInfo, {
            headers: { 'Content-Type': 'application/json' },
          });

          if (response.status === 200) {
            console.log('case info updated');
          }
        } catch (error) {
          console.log('update case info error');

          if (axios.isAxiosError(error)) {
            console.log(error);
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
              if (data.error_code === 2) {
                alert(data.message);
              }
            }
          
          }
        }
      setEditMode(!editMode);
    }
  }

    const handleCaseState = (
      event: React.MouseEvent<HTMLElement>,
      new_case_state_id: number
    ) => {
      CaseInfoDispatch({
        type: 'UPDATE_CASE_INFO',
        caseInfo: {
          ...CaseInfoState.caseInfo,
          case_state_id: new_case_state_id,
        },
      });
    };

    const handleAnalyzeResultClick = (case_id: number | undefined, session_id: number | undefined)=> (event: React.MouseEvent<unknown>) => {
      router.push(`/case/${case_id}/session/${session_id}/analyze`);
    };

    const handleCaseAnalyzeClick = (case_id: number | undefined) => (event: React.MouseEvent<unknown>) => {
      router.push(`/case/${case_id}/analyze`);
    }

    const handleEditScriptClick = (case_id: number | undefined, session_id: number | undefined )=> (event: React.MouseEvent<unknown>) => {
      router.push(`/case/${case_id}/session/${session_id}/script`);
    }
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setName(e.target.value);
      setSessionNameError('');
  };


  const getScriptStateColor = (script_state_id: number) => {
    switch (script_state_id) {
        case 1:
            return 'default';
        case 2:
            return 'primary';
        case 3:
            return 'success';
        case 4:
            return 'error';
    }
}

  const getAnalyzeStateColor = (analyze_state_id: number) => {
    switch (analyze_state_id) {
        case 1:
            return 'default';
        case 2:
            return 'primary';
        case 3:
            return 'success';
        case 4:
            return 'error';
    }
}

const handleVideoFileState = (sessionData: SessionData) => {
  
  if (isLoading[sessionData.id]) {
    return (
      <CircularProgressWithLabel value={progress[sessionData.id]}/>
    );
  } else {
    
    if (isDone[sessionData.id]) {
      return (
        <CheckCircleOutlineIcon fontSize='large' color='primary'/>
      );
  } else {
    if (sessionData.origin_video_url) {
      return (
        <IconButton 
          aria-label='video-upload'
          onClick={() => handleDropboxDialog(sessionData.id)}>
          <CheckCircleOutlineIcon fontSize='large' color='primary'/>
        </IconButton>
      );
    } else {
      return (
        <IconButton 
          aria-label='video-upload'
          onClick={() => handleDropboxDialog(sessionData.id)}>
          <FileUploadIcon fontSize='large'/>
        </IconButton>
      );
    }
  }
}
}

    return (
        <PageContainer title="Session" description="this is Session">
            <DashboardCard>
                <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px'}}>
                </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', borderBottom: '2px solid #E2E2E2'}}>
                    <div style={{display: 'flex', justifyContent: 'space-betwwen', gap: '10px', marginTop: '5px' ,marginRight: '20px'}}>
                        <Typography variant="h2" fontWeight={600}>
                            {(CaseInfoState.caseInfo?.family_name || "")+CaseInfoState.caseInfo?.given_name}
                        </Typography>
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', marginTop: '14px'}}>
                        <Typography variant="h5" fontWeight={600}>
                            {CaseInfoState.caseInfo?.description.age}세
                        </Typography>
                        <Typography variant="h5" fontWeight={600}>
                            {CaseInfoState.caseInfo?.description.gender}
                        </Typography>
                        </div>
                      </div>
                      <Button 
                        variant='contained'
                        color='primary'
                        onClick={handleCaseAnalyzeClick(CaseInfoState.caseInfo?.id)}
                      >
                        case analyze
                      </Button>
                  
                  </div>
                <Table
                  aria-label = "session table">
                    <TableHead>
                        <TableRow style={{ borderBottom: '2px solid #E2E2E2'}}>
                            <TableCell align='center'>
                              <Typography variant='subtitle2' fontWeight={600}>
                                세션 번호
                              </Typography>
                            </TableCell>
                            <TableCell align='center'>
                              <Typography variant='subtitle2' fontWeight={600}>
                                세션 이름
                              </Typography>
                            </TableCell>
                            <TableCell align='center'>
                              <Typography variant='subtitle2' fontWeight={600}>
                                회기 생성 날짜
                              </Typography>
                            </TableCell>
                            <TableCell align='center'>
                              <Typography variant='subtitle2' fontWeight={600}>
                                동영상 업로드
                              </Typography>
                            </TableCell>
                            <TableCell align='center'>
                              <Typography variant='subtitle2' fontWeight={600}>
                                영상 길이
                              </Typography>
                            </TableCell>
                            <TableCell align='center'>
                              <Typography variant='subtitle2' fontWeight={600}>
                                축어록 상태
                              </Typography>
                            </TableCell>
                            <TableCell align='center'>
                              <Typography variant='subtitle2' fontWeight={600}>
                                축어록 확인
                              </Typography>
                            </TableCell>
                            <TableCell align='center'>
                              <Typography variant='subtitle2' fontWeight={600}>
                                분석 작업 상태
                              </Typography>
                            </TableCell>
                            <TableCell align='center'>
                              <Typography variant='subtitle2' fontWeight={600}>
                                분석 결과 확인
                              </Typography>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sessionList && sessionList.map((sessionData) => (
                            <TableRow 
                              key={sessionData.id}>
                                <TableCell align='center'>
                                  <Typography
                                    sx={{
                                      fontSize: '15px',
                                      fontWeight: '600',
                                    }}>
                                    {sessionData.id}
                                  </Typography>
                                </TableCell>
                                <TableCell align='center'>
                                  <Typography
                                    sx={{
                                      fontSize: '15px',
                                      fontWeight: '600',
                                    }}>
                                    {sessionData.name}
                                  </Typography>
                                </TableCell>
                                <TableCell align='center'>
                                  <Typography
                                    sx={{
                                      fontSize: '15px',
                                      fontWeight: '600',
                                    }}>
                                    {sessionData.created_date}
                                  </Typography>
                                </TableCell>
                                <TableCell align='center'>
                                {handleVideoFileState(sessionData)}
                                </TableCell>
                                <TableCell align='center'>
                                  <Typography
                                    sx={{
                                      fontSize: '15px',
                                      fontWeight: '600',
                                    }}>
                                    {sessionData.video_length}
                                  </Typography>
                                </TableCell>
                                <TableCell align='center'>
                                  <Chip
                                    label={
                                      <Typography
                                        sx={{
                                          fontSize: '15px',
                                          fontWeight: '500',
                                        }}>
                                        {(() => {
                                          switch (sessionData.script_state_id) {
                                            case 1:
                                              return '준비 중';
                                            case 2:
                                              return '생성 중';
                                            case 3:
                                              return '생성 완료';
                                            case 4:
                                              return '오류';
                                          }
                                        }
                                        )()}
                                      </Typography>
                                    }
                                    color={getScriptStateColor(sessionData.script_state_id)}
                                    size='medium'
                                  />
                                </TableCell>
                                <TableCell align='center'>
                                  <IconButton 
                                    aria-label='script'
                                    disabled={sessionData.script_state_id !== 3}
                                    onClick={handleEditScriptClick(CaseInfoState.caseInfo?.id, sessionData.id)}>
                                    <DescriptionOutlinedIcon fontSize='large'/>
                                  </IconButton>
                                </TableCell>
                                <TableCell align='center'>
                                  <Chip
                                    label={
                                      <Typography
                                        sx={{
                                          fontSize: '15px',
                                          fontWeight: '500',
                                        }}>
                                        {(() => {
                                          switch (sessionData.analyze_state_id) {
                                            case 1:
                                              return '준비 중';
                                            case 2:
                                              return '분석 중';
                                            case 3:
                                              return '분석 완료';
                                            case 4:
                                              return '오류';
                                          }
                                        }
                                        )()}
                                      </Typography>
                                    }
                                    color={getAnalyzeStateColor(sessionData.analyze_state_id)}
                                    size='medium'
                                  />
                                </TableCell>
                                <TableCell align='center'>
                                  <IconButton 
                                    aria-label='analyze'
                                    disabled={sessionData.analyze_state_id !== 3}
                                    onClick={handleAnalyzeResultClick(CaseInfoState.caseInfo?.id, sessionData.id)}>
                                    <PlayCircleOutlineOutlinedIcon fontSize='large'/>
                                  </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                        <TableRow>
                        <TableCell colSpan={8}>
                            <Pagination 
                                count={Math.ceil(sessionTotalNum)}
                                page={currentPage}
                                onChange={handleChangePage}
                                color="primary" 
                                size="large" 
                                showFirstButton
                                showLastButton
                                style={{
                                    display:'flex', 
                                    justifyContent: 'center'}}
                                />
                        </TableCell>
                    </TableRow>
                    </TableBody>
                </Table>
                </div>
            </DashboardCard>
          <SurveyButton />
          <Fab size='large' color='primary' aria-label='add' sx={{ position: 'fixed', right: '40px', bottom: '120px' }}
            onClick={handleAddClick}
          >
            <AddIcon />
          </Fab>
          <NewDialog 
            open={openSessionDialog}
            setOpen={setOpenSessionDialog}
            children={{
              title: 'Create New Session',
              content: (
                <>
                <TextField
                        margin="dense"
                        id="name"
                        label="Case Name"
                        type="text"
                        fullWidth
                        onChange={handleNameChange}
                        required
                        error={Boolean(sessionNameError)} helperText={sessionNameError}
                    />
                </>
              ),
              actions: (
                <>
                <Button onClick={handleClose} color="primary">
                  Cancel
                </Button>
                <Button onClick={handleCreate} color="primary">
                  Create
                </Button>
                
                </>
              )
            }}
          />
          <NewDialog
            open={openDropboxDialog}
            setOpen={setOpenDropboxDialog}
            children={{
              title: 'Upload Video',
              content: (
                <>
                <DropzoneComponent onFileChange={handleFileChange}/>
                </>
              ),
              actions: (
                <>
                <Button onClick={handleClose} color="primary">
                  Cancel
                </Button>
                <Button onClick={handleVideoUpload} color="primary">
                  Upload
                </Button>
                </>
              )
            }}
          />
        </PageContainer>
    );
    
};

export default SessionList;