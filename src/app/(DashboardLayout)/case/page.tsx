'use client';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import SurveyButton from '../components/buttons/SurveyButton';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DialogContentText from '@mui/material/DialogContentText';
import  SearchIcon  from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import NewDialog from '../components/shared/NewDialog';
import { AxiosError } from 'axios';
import { AuthState, AuthAction, useAuth } from "@/utils/AuthContext";


import {
    Typography,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Chip,
    Pagination,
    TextField,
    IconButton,
    InputAdornment,
    Fab,
    Button,
    FormControl,
    Select,
    MenuItem,
    InputLabel,
} from '@mui/material';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context';
import Cookies from 'js-cookie';

interface CaseData {
    id: number;
    given_name: string;
    family_name: string | null;
    description: CaseDiscriptionType;
    user_id: number;
    session_count: number;
    start_date: string;
    updated_date: string;
    case_state_id: number;
}

interface ErrorResponseType {
    message: string;
    error_code: number;
}

type CaseDiscriptionType = {
    age: number|null;
    gender: string;
}

function isErrorResponseType(obj: any): obj is ErrorResponseType {
    return obj && typeof obj === 'object' && 'message' in obj && 'error_code' in obj;
}


// case/total-num api
async function getCaseTotalNum(router: AppRouterInstance, state: AuthState, dispatch: React.Dispatch<AuthAction>, keyword: string) {

    try {
        const response = await axios.get(`/api/case/total-num`, {
            params: {
                keyword: keyword,
            },
            });

        if (response.status === 200) {
            return response.data;
        }
    } catch (error) {
        console.log('case total-num api error');
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
        }
    }
}
}

// get case api
async function getCaseList(router: AppRouterInstance, state: AuthState, dispatch: React.Dispatch<AuthAction>, keyword: string, skip?: number, limit?: number) {

    try {
        const response = await axios.get(`/api/case`, {
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
        console.log('case list api error');
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
                }
            }
            console.log(error);
        }
    }
}


const CaseList = () => {
    const [ caseList, setCaseList ] = useState<CaseData[]>([]);
    const [ caseTotalNum, setCaseTotalNum ] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [inputTerm, setInputTerm] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [open, setOpen] = useState(false);
    const [givenName, setGivenName] = useState('');
    const [familyName, setFamilyName] = useState<String | null>('');
    const [description, setDescription] = useState<CaseDiscriptionType>(
        {
            age: null,
            gender: ''
        });
    const [caseRefresher, setCaseRefresher] = useState(0);
    const [ deleteStates, setDeleteStates ] = useState<{ [key: number]: boolean }>({});
    const itemsPerPage = 10;
    const router = useRouter();
    const { state, dispatch } = useAuth();
    const [ caseNameError, setCaseNameError ] = useState('');


    useEffect(() => {
        const fetchCaseData = async () => {
            const keyword = searchTerm;
    
            // fetchCaseTotalNum 실행
            const totalNumResponse = await getCaseTotalNum(router, state, dispatch, keyword);
            setCaseTotalNum(totalNumResponse);
    
            // fetchCaseList 실행
            const skip = (currentPage - 1) * itemsPerPage;
            const limit = (currentPage === totalNumResponse) ? undefined : 10;
            const listResponse = await getCaseList(router, state, dispatch, keyword, skip, limit);
            setCaseList(listResponse);
        };
    
        fetchCaseData();
    
    }, [searchTerm, currentPage, caseRefresher]);

    const handleChangePage = (event: React.ChangeEvent<unknown>, newPage: number) => {
        setCurrentPage(newPage);
    }

    const handleRowClick = (case_id: number ) => (event: React.MouseEvent<unknown>) => {
        router.push(`/case/${case_id}`);

    }

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputTerm(e.target.value);
        if (e.target.value === '') {
            setSearchTerm('');
        }
    }

    const handleSerchClick = (e: React.MouseEvent<unknown>) => {
        setSearchTerm(inputTerm);
        setCurrentPage(1);
        
    }

    const handleAddClick = (e: React.MouseEvent<unknown>) => {
        setOpen(true);
        setGivenName('');
        setFamilyName('');
        setDescription({
            age: null,
            gender: '',
        });
    }

    const handleCreate = async(): Promise<void> => {
        if (givenName === '') {
            setCaseNameError('Case 이름을 입력해주세요.');
            return;
        }else{
            let isClient = typeof window !== 'undefined';
            if (isClient) {
                try {
                    const response = await axios.post(`/api/case`, {
                        id :null,
                        given_name: givenName,
                        family_name: familyName,
                        description: description,
                        user_id: null,
                        session_count: null,
                        start_date: null,
                        updated_date: null,
                        case_state_id: null
                    }, {
                        headers: { 'Content-Type': 'application/json' },
                    });
    
                    if (response.status === 200) {
                        setOpen(false);
                        const keyword = searchTerm;
                        const response = await getCaseTotalNum(router, state, dispatch, keyword);
                        setCaseTotalNum(response);
                    }
                } catch (error) {
                    console.log('create case failed.');
                    if ((error as AxiosError).isAxiosError && (error as AxiosError).response) {
                        const status = (error as AxiosError).response?.status;
                        const data = (error as AxiosError).response?.data;
                        console.log(data);
                        if (status === 401 && isErrorResponseType(data)) {
                            if (data.error_code === 0) {
                                alert(data.message);
                                router.push('/authentication/signin');
                            }
                        }
                    } else {
                        console.error('Error:', error);
                    }
                }
            }
            setCaseRefresher(caseRefresher + 1);
        }

    }

    const handleDeleteClick = (id: number) => (e: React.MouseEvent) => {
        setDeleteStates(prevState => ({
            ...prevState,
            [id]: !prevState[id]
        }));
        console.log(deleteStates);
    }

    
    const handleGivenNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setGivenName(e.target.value);
        setCaseNameError('');
    };

    const handleFamilyNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFamilyName(e.target.value);
    };

    const handleAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDescription({...description, [e.target.name]: Number(e.target.value)});
    };

    const handleClose = () => {
        setOpen(false);
    };

    const getColor = (case_state_id: number) => {
        switch (case_state_id) {
            case 1:
                return "default";
            case 2:
                return "primary";
            case 3:
                return "success";
            default:
                return "default";
        }
    }

    const getCaseStatetoString = (case_state_id: number) => {
        switch (case_state_id) {
            case 1:
                return "진행 전";
            case 2:
                return "진행 중";
            case 3:
                return "완료";
            default:
                return "진행 전";
        }
    }




    return (
        <PageContainer title="Case" description="this is Case">
        <DashboardCard>
            <Table
                aria-label = "case table"
            >
                <TableHead>
                    <TableRow>
                        <TableCell colSpan={7} align='right'>
                            <TextField
                                label="케이스 검색"
                                variant="outlined"
                                size="small"
                                value={inputTerm}
                                onChange={handleSearchChange}
                                sx={{
                                    width: '100%',
                                    maxWidth: '200px',
                                }}
                                InputProps={{
                                    style: {
                                        paddingRight: '0px',
                                    },
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton type="button" sx={{ p: '10px'}} aria-label="search"
                                                onClick={handleSerchClick}>
                                                <SearchIcon />
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </TableCell>
                    </TableRow>
                    <TableRow style={{ borderBottom: '2px solid #E2E2E2'}}>
                        <TableCell align='center'>
                            <Typography variant="subtitle2" fontWeight={600}>
                                케이스 번호
                            </Typography>
                        </TableCell>
                        <TableCell align='center'>
                            <Typography variant="subtitle2" fontWeight={600}>
                                케이스 이름
                            </Typography>
                        </TableCell>
                        <TableCell align='center'>
                            <Typography variant="subtitle2" fontWeight={600}>
                                회기 수
                            </Typography>
                        </TableCell>
                        <TableCell align='center'>
                            <Typography variant="subtitle2" fontWeight={600}>
                                시작 날짜
                            </Typography>
                        </TableCell>
                        <TableCell align='center'>
                            <Typography variant="subtitle2" fontWeight={600}>
                                상담 상태
                            </Typography>
                        </TableCell>
                        <TableCell align='center'>
                            <Typography variant="subtitle2" fontWeight={600}>
                                삭제(비활성)
                            </Typography>
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {caseList && caseList.map((caseData)=> (
                        <TableRow 
                            key={caseData.id} 
                            onClick={handleRowClick(caseData.id)}
                            sx={{
                                '&:hover': {
                                    backgroundColor: '#f5f5f5',
                                    cursor: 'pointer',
                                }
                            }}>
                            <TableCell align='center'>
                                <Typography
                                    sx={{
                                        fontSize: '15px',
                                        fontWeight: '500',
                                    }}
                                >
                                    {caseData.id}
                                </Typography>
                            </TableCell>
                            <TableCell align='center'>
                                <Typography
                                    sx={{
                                        fontSize: '15px',
                                        fontWeight: '500',
                                    }}
                                >
                                    {caseData.family_name+caseData.given_name}
                                </Typography>
                            </TableCell>
                            <TableCell align='center'>
                                <Typography
                                    sx={{
                                        fontSize: '15px',
                                        fontWeight: '500',
                                    }}
                                >
                                    {caseData.session_count}
                                </Typography>
                            </TableCell>
                            <TableCell align='center'>
                                <Typography
                                    sx={{
                                        fontSize: '15px',
                                        fontWeight: '500',
                                    }}
                                >
                                    {caseData.start_date}
                                </Typography>
                            </TableCell>
                            <TableCell align='center'>
                                <Chip
                                    label={
                                        <Typography
                                            sx={{
                                                fontSize: '15px',
                                                fontWeight: '500',
                                            }}
                                        >
                                            {getCaseStatetoString(caseData.case_state_id)}
                                        </Typography>}
                                    color= {getColor(caseData.case_state_id)}
                                    size="medium"
                                />
                            </TableCell>
                            <TableCell align='center'>
                            <div onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteClick(caseData.id)(e);
                            }}>
                            <IconButton
                                style={{opacity: deleteStates[caseData.id] ? 0.5: 1}}
                            >
                                <DeleteIcon></DeleteIcon>
                            </IconButton>
                            </div>
                            </TableCell>
                        </TableRow>
                    ))}
                    <TableRow>
                        <TableCell colSpan={7}>
                            <Pagination 
                                count={Math.ceil(caseTotalNum)}
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
            
        </DashboardCard>
        <SurveyButton />

        <Fab size='large' color="primary" aria-label="add" style={{position: 'fixed', right:'40px', bottom: '120px'}}
            onClick={handleAddClick}
        >
            <AddIcon />
        </Fab>
        <NewDialog 
            open={open} 
            setOpen={setOpen}
            children={{
                title: "New Case",
                content: (
                    <>
                    <DialogContentText>
                        To create a new case, please enter the case name here.
                    </DialogContentText>
                    <TextField
                        margin="none"
                        id="given_name"
                        label="Given Name"
                        type="text"
                        fullWidth
                        onChange={handleGivenNameChange}
                        required
                        error={Boolean(caseNameError)} helperText={caseNameError}
                    />
                    <TextField
                        margin="normal"
                        id="family_name"
                        label="Family Name"
                        type="text"
                        fullWidth
                        onChange={handleFamilyNameChange}
                    />
                    <FormControl fullWidth>
                    <InputLabel id="gender-label">Case gender</InputLabel>
                    <Select
                        id="gender"
                        name="Case gender"
                        variant="outlined"
                        fullWidth
                        value={description.gender}
                        onChange={(e) => setDescription(prevState => ({...prevState, gender: e.target.value as string  ?? undefined}))}
                        required
                    >
                        <MenuItem value={'M'}>남자</MenuItem>
                        <MenuItem value={'F'}>여자</MenuItem>
                        <MenuItem value={'N'}>Non-Binary</MenuItem>
                    </Select>
                    </FormControl>
                
                    <TextField
                        margin="dense"
                        id="age"
                        name="age"
                        label="Case age"
                        type="text"
                        fullWidth
                        onChange={handleAgeChange}
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
                ),
            }}/>
        </PageContainer>
        
    );
    };

export default CaseList;