import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import https from 'https';
import cookie from 'cookie';

// 백엔드 session/total-num API 호출
async function sessionTotalNum(case_id: number, keyword: string, authToken: string) {

    const ApibaseUrl = process.env.API_URL;

    const agent = new https.Agent({
      rejectUnauthorized: false, // local test시 false
    });

    try{
      const response = await axios.get(`${ApibaseUrl}/contents/api/case/${case_id}/session/total-num`, 
      { httpsAgent: agent,
        headers: {
            'Authorization': `Bearer ${authToken}`
        },
        params: {
            keyword: keyword
        }
    });
      console.log(response.data);
      return { error: null, response};

    }catch(error){
      if (axios.isAxiosError(error)){
        console.log('Error message:', error.message);
        return {error, response: null};
      }else{
        console.log('Unexpected error:', error);
        return {error: 'An unexpected error occurred', response: null};
      }}
    }

export default async(req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'GET') {
        const cookies = cookie.parse(req.headers.cookie || '');
        const authToken = cookies.authToken;
        console.log('authToken:', authToken);

        try{
            console.log('session total-num api');
            const case_id = Number(req.query.case_id);
            const keyword = String(req.query.keyword);
            const {error, response} = await sessionTotalNum(case_id, keyword, authToken);
        if (response){
            res.status(response.status).send(response.data);
        }else if (error && axios.isAxiosError(error) && error.response){
            res.status(error.response?.status).json(error.response?.data);
        }else{
            res.status(500).json({message: 'Internal Server Error'});
        }
            
        }catch(error){
        console.log('session total-num api error');
        }
        
    }
};