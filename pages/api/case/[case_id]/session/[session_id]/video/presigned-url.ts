import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import https from 'https';
import cookie from 'cookie';

// 백엔드 get presigned url API 호출
async function getPresignedUrl(
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
      const response = await axios.get(`${ApibaseUrl}/contents/api/case/${case_id}/session/${session_id}/video/presigned-url`, 
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

    export default async (req: NextApiRequest, res: NextApiResponse) => {
        const { case_id, session_id } = req.query;
        const { authToken } = cookie.parse(req.headers.cookie || '');
        const { method } = req;

        if (method === 'GET'){
            try{
                const {error, response} = await getPresignedUrl(
                    Number(case_id),
                    Number(session_id),
                    String(authToken)
                );

                if (response){
                    res.status(response.status).json(response.data);
                } else if (error && axios.isAxiosError(error)&& error.response){
                    res.status(error.response.status).json(error.response.data);
                } else {
                    res.status(500).json({error: 'Internal Server Error'});
                }
        } catch (error) {
            console.log('Unexpected error:', error);
        }
    }
}