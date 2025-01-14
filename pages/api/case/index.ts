import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import https from 'https';
import cookie from 'cookie';

type caseRequest = {
    "id": number,
    "given_name": string,
    "family_name": string | null,
    "description": {"age": number, "gender":string},
    "user_id": number,
    "session_count": number,
    "start_date": string,
    "updated_date": string,
    "case_state_id": number,
}
// 백엔드 case/list API 호출
async function caseList(keyword: string, authToken: string, skip?: number, limit?: number) {

    const ApibaseUrl = process.env.API_URL;

    const agent = new https.Agent({
      rejectUnauthorized: false, // local test시 false
    });

    try{
      const response = await axios.get(`${ApibaseUrl}/contents/api/case`, 
      { httpsAgent: agent,
        headers: {
            'Authorization': `Bearer ${authToken}`
        },
        params: {
            skip: skip,
            limit: limit,
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

// 백엔드 post case API 호출
async function createCase(caseRequest: caseRequest, authToken: string) {
    const ApibaseUrl = process.env.API_URL;

    const agent = new https.Agent({
        rejectUnauthorized: false, // local test시 false
    });

    try{
        const response = await axios.post(`${ApibaseUrl}/contents/api/case`, caseRequest, 
        { httpsAgent: agent,
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
        }});
        console.log(response.data);
        return { error: null, response};
    }catch(error){
        if (axios.isAxiosError(error)){
            console.log('Error message:', error.message);
            return {error, response: null};
        }else{
            console.log('Unexpected error:', error);
            return {error: 'An unexpected error occurred', response: null};
        }
    }
}

export default async(req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'GET') {
        const cookies = cookie.parse(req.headers.cookie || '');
        const authToken = cookies.authToken;
  
        try{
            console.log('get case api');
            const skip = req.query.skip? Number(req.query.skip) : undefined;
            const limit = req.query.limit? Number(req.query.limit) : undefined;
            const keyword = String(req.query.keyword);
            const {error, response} = await caseList(keyword, authToken, skip, limit);
        if (response){
            res.status(response.status).json(response.data);
        }else if (error && axios.isAxiosError(error) && error.response){
            res.status(error.response?.status).json(error.response?.data);
        }else{
            res.status(500).json({message: 'Internal Server Error'});
        }
            
        }catch(error){
        console.log('get case api error');
        }
          
      }else if (req.method === 'POST') {
        const caseRequest = req.body;
        const cookies = cookie.parse(req.headers.cookie || '');
        const authToken = cookies.authToken;

        try{
            const {error, response} = await createCase(caseRequest, authToken);
            if (response){
                res.status(response.status).json(response.data);
            }else if (error && axios.isAxiosError(error) && error.response){
                res.status(error.response?.status).json(error.response?.data);
            }else{
                res.status(500).json({message: 'Internal Server Error'});
            }
        }catch(error){
            console.log(error);
        }
    }
};