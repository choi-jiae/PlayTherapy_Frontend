import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import https from 'https';
import qs from 'qs';

// 백엔드 로그인 API 호출
async function userSignin(email: string, password: string) {

    const ApibaseUrl = process.env.API_URL;
    console.log(ApibaseUrl);
    const data = { username: email, password: password };

    const agent = new https.Agent({
      rejectUnauthorized: false, // local test시 false
    });

    try{
      const options = {
        method: 'POST',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        data: qs.stringify(data),
        url: `${ApibaseUrl}/auth/api/signin`,
        httpsAgent: agent,
      };
      const response = await axios(options);
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
  if (req.method === 'POST') {
    const { email, password } = req.body;
    

    try{
      const {error, response} = await userSignin(email, password);
      if (response){
        res.setHeader(
          'Set-Cookie', 
          `authToken=${response.data.access_token}; path=/; expires=${new Date(new Date().getTime() + 60 * 60 * 24 * 1000).toUTCString()};`);
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