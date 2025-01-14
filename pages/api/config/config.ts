import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import https from 'https';

// 백엔드 config API 호출
async function getConfig() {

    const ApibaseUrl = process.env.API_URL;

    const agent = new https.Agent({
      rejectUnauthorized: false, // local test시 false
    });

    try{
      const response = await axios.get(`${ApibaseUrl}/auth/api/config`, 
      { httpsAgent: agent});
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
        try{
            console.log('config api');
            const {error, response} = await getConfig();
        if (response){
            res.status(response.status).json(response.data);
        }else if (error && axios.isAxiosError(error) && error.response){
            res.status(error.response?.status).json(error.response?.data);
        }else{
            res.status(500).json({message: 'Internal Server Error'});
        }
            
        }catch(error){
        console.log('config api error');
        }
        
    }
};