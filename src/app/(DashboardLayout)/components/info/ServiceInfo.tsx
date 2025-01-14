import React from 'react';
import { Typography } from '@mui/material';

const ServiceInfo = () => {
    return (
        <div>
            <Typography
                variant="h5"
                textAlign="center"
                fontWeight="600"
                mt={3}
                >
                Play Therapy 사용 방법
                </Typography>
                <Typography
                variant= "body1"
                textAlign="initial"
                fontWeight="500"
                mt={3}
                mb={3}
                >
                1. 회원가입 진행<br/>
                2. 로그인을 하면 case page<br/>
                4. case page에서 case를 선택<br/>
                5. session page<br/>
                6. script 수정 확인<br/>
                </Typography>
        </div>
    );
}

export default ServiceInfo;