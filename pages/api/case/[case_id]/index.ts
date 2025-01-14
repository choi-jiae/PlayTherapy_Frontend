import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import https from 'https';
import cookie from 'cookie';


type caseRequest = {
  "id": number,
  "name": string,
  "description": {"age": number, "gender":string},
  "user_id": number,
  "session_count": number,
  "start_date": string,
  "updated_date": string,
  "case_state_id": number,
}

// 백엔드 get case API 호출
async function getCase(case_id: number, authToken: string) {

    const ApibaseUrl = process.env.API_URL;

    const agent = new https.Agent({
      rejectUnauthorized: false, // local test시 false
    });

    try{
      const response = await axios.get(`${ApibaseUrl}/contents/api/case/${case_id}`, 
      { 
        httpsAgent: agent,
        headers: {
            'Authorization': `Bearer ${authToken}`
        },
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

// 백엔드 put case api 호출
async function updateCase(case_id: number, caseRequest: caseRequest, authToken: string){
  
  const ApibaseUrl = process.env.API_URL;


  const agent = new https.Agent({
    rejectUnauthorized: false, // local test시 false
  });

  try{
    const response = await axios.put(`${ApibaseUrl}/contents/api/case/${case_id}`, caseRequest,
    { 
      httpsAgent: agent,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
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

        try{
            console.log('get case id api');
            const case_id = Number(req.query.case_id);
            const {error, response} = await getCase(case_id, authToken);
        if (response){
            res.status(response.status).json(response.data);
        }else if (error && axios.isAxiosError(error) && error.response){
            res.status(error.response?.status).json(error.response?.data);
        }else{
            res.status(500).json({message: 'Internal Server Error'});
        }
            
        }catch(error){
        console.log('get case id api error');
        }
        
    } else if (req.method === 'PUT') {
      const caseRequest = req.body;
      const cookies = cookie.parse(req.headers.cookie || '');
      const authToken = cookies.authToken;

        try{
            console.log('put case id api');
            const case_id = Number(req.query.case_id);
            const {error, response} = await updateCase(case_id, caseRequest, authToken);
        if (response){
            res.status(response.status).json(response.data);
        }else if (error && axios.isAxiosError(error) && error.response){
            res.status(error.response?.status).json(error.response?.data);
        }else{
            res.status(500).json({message: 'Internal Server Error'});
        }
            
        }catch(error){
        console.log('put case id api error');
      }
    }
};