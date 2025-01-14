import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import https from 'https';
import cookie from 'cookie';
import FormData from 'form-data';

async function getSessionReport(case_id: number, session_id: number, authToken: string){
    const ApibaseUrl = process.env.API_URL;
    const agent = new https.Agent({
        rejectUnauthorized: false, // local test시 false
    });

    try{
        const response = await axios.get(`${ApibaseUrl}/contents/api/case/${case_id}/session/${session_id}/analyze-report`, 
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
        }
    }
}

export default async(req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'GET'){
        const cookies = cookie.parse(req.headers.cookie || '');
        const authToken = cookies.authToken;
        const { case_id, session_id } = req.query;

        try{
            const { error, response } = await getSessionReport(Number(case_id), Number(session_id), String(authToken));

            if (response){
                res.status(response.status).json(response.data);
            } else if (error && axios.isAxiosError(error) && error.response){
                res.status(error.response?.status).json(error.response?.data);
            } else {
                console.log(error);
                res.status(500).json({ message: 'Internal Server Error' });
            }
        } catch(error){
            console.log('get session report api error');
        }
        
        
    }
}