import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import https from 'https';
import cookie from 'cookie';

type sessionRequest = {
    "data": {
        "id": number,
        "name": string,
        "session_state_id": number,
        "case_id": number,
        "source_video_url": string,
        "source_script_url": string,
        "script_state_id": number,
        "analyze_state_id": number,
        "created_date": string,
        "video_length": number,
        "origin_video_url": string,
        "encoding_video_url": string,
    }
}
// 백엔드 get session API 호출
async function sessionList(case_id: number, keyword: string, authToken: string, skip?: number, limit?: number) {

    const ApibaseUrl = process.env.API_URL;

    const agent = new https.Agent({
      rejectUnauthorized: false, // local test시 false
    });

    try{
      const response = await axios.get(`${ApibaseUrl}/contents/api/case/${case_id}/session`, 
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

// 백엔드 post session API 호출
async function createSession(case_id:number, sessionRequest: sessionRequest, authToken: string) {
    const ApibaseUrl = process.env.API_URL;

    const agent = new https.Agent({
        rejectUnauthorized: false, // local test시 false
    });

    try{
        const response = await axios.post(`${ApibaseUrl}/contents/api/case/${case_id}/session`, sessionRequest, 
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
        console.log('get session api');
        const case_id = Number(req.query.case_id);          
        const skip = req.query.skip? Number(req.query.skip) : undefined;
        const limit = req.query.limit? Number(req.query.limit) : undefined;
        const keyword = String(req.query.keyword);
        const {error, response} = await sessionList(case_id, keyword, authToken, skip, limit);
      if (response){
          res.status(response.status).json(response.data);
      }else if (error && axios.isAxiosError(error) && error.response){
          res.status(error.response?.status).json(error.response?.data);
      }else{
          res.status(500).json({message: 'Internal Server Error'});
      }
          
      }catch(error){
      console.log('get session api error');
      }
        
    } else if (req.method === 'POST') {
        const case_id = Number(req.query.case_id);
        const sessionRequest = req.body;
        const cookies = cookie.parse(req.headers.cookie || '');
        const authToken = cookies.authToken;

        try{
            const {error, response} = await createSession(case_id, sessionRequest, authToken);
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