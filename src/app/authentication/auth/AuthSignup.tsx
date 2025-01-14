import React, {useEffect, useState} from 'react';

import { 
    Box, 
    Typography, 
    Button, 
    FormControl,
    Select, 
    MenuItem,
    Autocomplete,
    } from '@mui/material';


import CustomTextField from '@/app/(DashboardLayout)/components/forms/theme-elements/CustomTextField';
import { Stack } from '@mui/system';

import axios from "axios";
import FormHelperText from '@mui/material/FormHelperText';
import { useRouter } from 'next/navigation';

interface signupType {
    title?: string;
    subtitle?: JSX.Element | JSX.Element[];
    subtext?: JSX.Element | JSX.Element[];
  }

type UserDataType = {
    email: string;
    name: string;
    hashed_password: string;
    birth_year: number | null;
    gender: string;
    highest_education_level_id: number | '';
    years_of_experience: number | '';
    org_id: number | '';
    user_type_id: number | '';
}

interface ErrorResponseType {
    message: string;
    error_code: number;
}

function isErrorResponseType(obj: any): obj is ErrorResponseType {
    return obj && typeof obj === 'object' && 'message' in obj && 'error_code' in obj;
}

// config api
async function getData() {
    try{
        const response = await axios.get(`/api/config/config`,);
        

        if (response.status === 200) {
            console.log('Getting data success.');
            return response.data;
        }
    }catch(error){
        console.log('Getting data failed.');
        if (axios.isAxiosError(error)) {
            console.log(error);
        }
    }
}

const Authsignup: React.FC<signupType> = ({ title, subtitle, subtext }: signupType) => {
    const [configData, setConfigData] = useState(
        {
            'orgs': [{id: undefined, name: ''}],
            'userTypes':[{id: undefined, name: ''}],
        });

    const router = useRouter();

        // get data
        const fetchData = async() => {
            const result = await getData();
            setConfigData(result);  
        };


    
        useEffect(() => {
            fetchData();
        }, []);
    
    const [userData, setUserData] = useState<UserDataType>(
        {
        email: '',
        name: '',
        hashed_password: '',
        birth_year: null,
        gender: '',
        highest_education_level_id: '',
        years_of_experience: '',
        user_type_id: '',
        org_id: '', 
        });
    
    const [passwordTest, setpasswordTest] = useState('');

    const highest_education_level = [
        {id: 1, name: '고등학교'},
        {id: 2, name: '전문대'},
        {id: 3, name: '일반대'},
        {id: 4, name: '석사'},
        {id: 5, name: '박사'}
    ];


    const [emailError, setemailError] = useState('');
    const [nameError, setnameError] = useState('');
    const [passwordError, setpasswordError] = useState('');
    const [passwordTestError, setpasswordTestError] = useState('');
    const [BirthyearError, setBirthyearError] = useState('');
    const [genderError, setGenderError] = useState('');
    const [educationError, setEducationError] = useState('');
    const [experienceError, setExperienceError] = useState('');
    const [orgError, setOrgError] = useState('');
    const [usertypeError, setusertypeError] = useState('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        if (e.target.name !== 'passwordTest' && e.target.name !== 'years_of_experience'){
            setUserData({ ...userData, [e.target.name]: e.target.value });
        }
        if (e.target.name === 'email') setemailError('');
        else if (e.target.name === 'name') setnameError('');
        else if (e.target.name === 'hashed_password') setpasswordError('');
        else if (e.target.name === 'passwordTest') {
            setpasswordTest(e.target.value);
            setpasswordTestError('');
        }
        else if (e.target.name === 'years_of_experience') {
            setUserData({ ...userData, years_of_experience: Number(e.target.value) });
            setExperienceError('');
        }
    };


    const handleSigninClick = async(): Promise<void> => {
        console.log(userData);
        if (userData.email === '') setemailError('이메일을 입력해주세요.');
        if (userData.name === '') setnameError('이름을 입력해주세요.');
        if (userData.hashed_password.trim() === '') setpasswordError('비밀번호를 입력해주세요.');
        if (passwordTest.trim() === '') setpasswordTestError('비밀번호를 확인해주세요.');
        if (userData.birth_year === null) setBirthyearError('출생년도를 입력해주세요.');
        if (userData.gender === '') setGenderError('성별을 선택해주세요.');
        if (userData.highest_education_level_id === '') setEducationError('최종 학력을 선택해주세요.');
        if (userData.years_of_experience === '') setExperienceError('경력을 입력해주세요.');
        if (userData.org_id === '') setOrgError('소속 기관을 선택해주세요.');
        if (userData.user_type_id === '') setusertypeError('사용자 타입을 선택해주세요.');
        if (userData.hashed_password !== passwordTest) setpasswordTestError('비밀번호가 일치하지 않습니다.');
        if (Number.isNaN(userData.years_of_experience)) setExperienceError('숫자만 입력해주세요.');


        let isClient = typeof window !== 'undefined';
        if (userData.email !== '' &&
            userData.name !== '' &&
            userData.hashed_password.trim() !== '' && // 비밀번호 공백 허용하지 않음
            passwordTest.trim() !== '' && // 비밀번호 공백 허용하지 않음
            userData.hashed_password === passwordTest && // 비밀번호 일치
            userData.birth_year !== null &&
            userData.gender !== '' &&
            userData.highest_education_level_id !== '' &&
            userData.years_of_experience !== '' &&
            !Number.isNaN(userData.years_of_experience) && // 경력 숫자만 허용
            userData.org_id !== '' &&
            userData.user_type_id !== '' &&
            isClient) {
            try {
                const response = await axios.post(`/api/auth/signup`, userData, {
                    headers: { 'Content-Type': 'application/json' },
                });
    
                if (response.status === 200) {
                    console.log('signup success.');
                    router.push('/authentication/signin')
                }
            } catch (error) {
                console.log('signup failed.');
                
                if (axios.isAxiosError(error)) {
                    console.log(error);
                    const status = error.response?.status;
                    const data = error.response?.data;
                    
                    if (status === 400 && isErrorResponseType(data)) {
                        if (data.error_code === 0) {
                            
                            setemailError('유효하지 않은 이메일입니다.');
                        } else if (data.error_code === 1) {
                            setemailError('이미 가입된 이메일입니다.');
                        }
                        
                    }else if (status === 500) {
                        alert('Internal Server Error');
                    }
            }else{
                console.error('Error:', error);
            }
        }
    }
    }

    
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

        <Box>
            <Stack mb={3}>
                <Typography variant="subtitle1"
                    fontWeight={600} component="label" htmlFor='name' mb="5px">이름 *</Typography>
                <CustomTextField id="name" name="name" variant="outlined" fullWidth onChange={handleInputChange} required
                error={Boolean(nameError)} helperText = {nameError}/>

                <Typography variant="subtitle1"
                    fontWeight={600} component="label" htmlFor='email' mb="5px" mt="25px">이메일 *</Typography>
                <CustomTextField id="email" name="email" variant="outlined" fullWidth onChange={handleInputChange} required
                error={Boolean(emailError)} helperText = {emailError}/>

                <Typography variant="subtitle1"
                    fontWeight={600} component="label" htmlFor='password' mb="5px" mt="25px">비밀번호 *</Typography>
                <CustomTextField id="password" name="hashed_password" variant="outlined" fullWidth onChange={handleInputChange} required
                type="password" error={Boolean(passwordError)} helperText = {passwordError}/>

                <Typography variant="subtitle1"
                    fontWeight={600} component="label" htmlFor='passwordTest' mb="5px" mt="25px">비밀번호 확인*</Typography>
                <CustomTextField id="passwordTest" name="passwordTest" variant="outlined" fullWidth onChange={handleInputChange} required
                type="password" error={Boolean(passwordTestError)} helperText = {passwordTestError}/>

                <Typography variant="subtitle1"
                    fontWeight={600} component="label" htmlFor='birth_year' mb="5px" mt="25px">출생년도 *</Typography>
                <Autocomplete
                    disablePortal
                    id = "birth_year"
                    value = {userData.birth_year || null}
                    options={Array.from(new Array(100), (v, i) => 2019 - i)} // 2019 ~ 1920
                    getOptionLabel={(option) => option.toString()}
                    onChange={(e, newValue) => 
                        {
                            setUserData(prevState => ({...prevState, birth_year: newValue as number | null}));
                            setBirthyearError('');
                        }
                    }
                    renderOption={(props, option) => {
                        return (
                            <Box component="li" sx={{ fontSize: 15, textAlign: 'center', width: '100%', flexGrow: 1}}{...props}>{option}</Box>
                        );
                    }}
                    renderInput={(params) => 
                        <CustomTextField 
                            {...params}
                            name = "birth_year"
                            variant="outlined" 
                            fullWidth 
                            required
                            helperText = {BirthyearError}
                            error={Boolean(BirthyearError)}
                        />
                    }
                />
                

                <Typography variant="subtitle1"
                    fontWeight={600} component="label" htmlFor='gender' mb="5px" mt="25px">성별 *</Typography>
                <FormControl error={Boolean(genderError)}>
                    <Select
                        id="gender"
                        name="gender"
                        variant="outlined"
                        fullWidth
                        value={userData.gender}
                        onChange={(e) => 
                            {
                                setUserData(prevState => ({...prevState, gender: e.target.value as string  ?? undefined}));
                                setGenderError('');
                            }
                        }
                        required
                    >
                        <MenuItem value={'M'}>남자</MenuItem>
                        <MenuItem value={'F'}>여자</MenuItem>
                        <MenuItem value={'N'}>Non-Binary</MenuItem>
                    </Select>
                    <FormHelperText>{genderError}</FormHelperText>
                </FormControl>

                <Typography variant="subtitle1"
                    fontWeight={600} component="label" htmlFor='highest_education_level_id' mb="5px" mt="25px">최종 학력 *</Typography>
                <FormControl error={Boolean(educationError)}>
                <Select
                    id="highest_education_level_id"
                    name="highest_education_level_id"
                    variant="outlined"
                    fullWidth
                    value={userData.highest_education_level_id || ''}
                    onChange={(e) => 
                        {
                        setUserData(prevState => ({...prevState, highest_education_level_id: Number(e.target.value) ?? ''})),
                        setEducationError('')
                        }
                    }
                    required
                >
                    {highest_education_level.map((item, idx) => {
                        return <MenuItem value={item.id}>{item.name}</MenuItem>
                    })}
                </Select>
                <FormHelperText>{educationError}</FormHelperText>
                </FormControl>

                <Typography variant="subtitle1"
                    fontWeight={600} component="label" htmlFor='years_of_experience' mb="5px" mt="25px">경력 * (N년 이하일 경우, 숫자 N만 입력)</Typography>
                <CustomTextField id="years_of_experience" name="years_of_experience" variant="outlined" fullWidth onChange={handleInputChange} required
                error={Boolean(experienceError)} helperText = {experienceError}/>

                <Typography variant="subtitle1"
                    fontWeight={600} component="label" htmlFor='org_id' mb="5px" mt="25px">소속 기관 *</Typography>
                <FormControl error={Boolean(orgError)}>
                <Select
                    id="org_id"
                    variant="outlined"
                    fullWidth
                    value={userData.org_id || ''}
                    onChange={(e) => {
                        setUserData(prevState => ({...prevState, org_id: Number(e.target.value) ?? ''})),
                        setOrgError('')
                       }
                    }
                    required
                >
                    {configData && configData.orgs.map((item, idx) => {
                    return <MenuItem value={item.id}>{item.name}</MenuItem>
                })}
                </Select>
                <FormHelperText>{orgError}</FormHelperText>
                </FormControl>

                <Typography variant="subtitle1"
                    fontWeight={600} component="label" htmlFor='user_type_id' mb="5px" mt="25px">사용자 타입 *</Typography>
                <FormControl error={Boolean(usertypeError)}>
                <Select
                    id="user_type_id"
                    variant="outlined"
                    fullWidth
                    value={userData.user_type_id || ''}
                    onChange={(e) => {
                        setUserData(prevState => ({...prevState, user_type_id: Number(e.target.value) ?? ''})),
                        setusertypeError('')
                       }
                    }
                    required
                >
                    {configData && configData.userTypes.map((item, idx) => {
                    if (idx === 0) return null; // Admin 제외
                    return <MenuItem value={item.id}>{item.name}</MenuItem>
                })}
                    

                </Select>
                <FormHelperText>{usertypeError}</FormHelperText>
                </FormControl>
            </Stack>
            <Button 
                color="primary" 
                variant="contained" 
                size="large" 
                fullWidth
                onClick={handleSigninClick}
            >
                가입하기
            </Button>
        </Box>
        {subtitle}
    </>
    );
};

export default Authsignup;
