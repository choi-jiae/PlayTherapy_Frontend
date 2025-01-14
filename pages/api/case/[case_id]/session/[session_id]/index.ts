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
async function getSession(
    case_id: number, 
    session_id: number,
    authToken: string, 
    ) {

    const ApibaseUrl = process.env.API_URL;
    console.log('ApibaseUrl:', ApibaseUrl);

    const agent = new https.Agent({
      rejectUnauthorized: false, // local test시 false
    });

    try{
      const response = await axios.get(`${ApibaseUrl}/contents/api/case/${case_id}/session/${session_id}`, 
      { httpsAgent: agent,
        headers: {
            'Authorization': `Bearer ${authToken}`
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

// 백엔드 put session API 호출
async function updateSession(case_id:number, session_id:number, sessionRequest: sessionRequest, authToken: string) {
    const ApibaseUrl = process.env.API_URL;
    console.log('ApibaseUrl:', ApibaseUrl);

    const agent = new https.Agent({
      rejectUnauthorized: false, // local test시 false
    });

    try{
      const response = await axios.put(`${ApibaseUrl}/contents/api/case/${case_id}/session/${session_id}`, 
      sessionRequest,
      { httpsAgent: agent,
        headers: {
            'Authorization': `Bearer ${authToken}`
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
    const { case_id, session_id } = req.query;
    const { authToken } = cookie.parse(req.headers.cookie || '');
    const { method } = req;

    if (method === 'GET'){
        try{
            console.log('get session api');
            const { error, response } = await getSession(Number(case_id), Number(session_id), String(authToken));
    
            if (response){
                res.status(response.status).json(response.data);
            } else if (error && axios.isAxiosError(error)&& error.response){
                res.status(error.response?.status).json(error.response?.data);
            }else{
                res.status(500).json({message: 'Internal server error'});
            }
        } catch (error){
            console.log('Unexpected error:', error);
        }
    } else if (method === 'PUT'){
        const sessionRequest = req.body;
        try{
            console.log('put session api');
            const { error, response } = await updateSession(Number(case_id), Number(session_id), sessionRequest, String(authToken));
            console.log(error)
            console.log(response)
            if (response){
                res.status(response.status).json(response.data);
            } else if (error && axios.isAxiosError(error)&& error.response){
                res.status(error.response?.status).json(error.response?.data);
            }else{
                res.status(500).json({message: 'Internal server error'});
            }
        } catch (error){
            console.log('Unexpected error:', error);
        }
    }


}
