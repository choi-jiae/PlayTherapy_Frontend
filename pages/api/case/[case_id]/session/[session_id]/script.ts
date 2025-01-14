import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import https from 'https';
import cookie from 'cookie';
import FormData from 'form-data';


// post script API 호출
async function uploadScript(case_id: number, session_id: number, authToken: string, script: string){
    const ApibaseUrl = process.env.API_URL;
    const agent = new https.Agent({
        rejectUnauthorized: false, // local test시 false
    });

    try{
        const formData = new FormData();
        formData.append('script', JSON.stringify(script), 'script.json');
        
        console.log("Uploading script...")
        console.log(ApibaseUrl);
        const response = await axios.post(`${ApibaseUrl}/contents/api/case/${case_id}/session/${session_id}/script`, formData, 
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

// download script API 호출
async function downloadScript(case_id: number, session_id: number, authToken: string){
    const ApibaseUrl = process.env.API_URL;
    const agent = new https.Agent({
        rejectUnauthorized: false, // local test시 false
    });

    try{
        const response = await axios.get(`${ApibaseUrl}/contents/api/case/${case_id}/session/${session_id}/script`, 
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
    if (req.method === 'POST'){
        const cookies = cookie.parse(req.headers.cookie || '');
        const authToken = cookies.authToken;
        const script = req.body;

        try{
            console.log('post script api');
            const case_id = Number(req.query.case_id);
            const session_id = Number(req.query.session_id);
            const { error, response } = await uploadScript(case_id, session_id, authToken, script);
            
            if (response){
                res.status(response.status).json(response.data);
            }else if (error && axios.isAxiosError(error) && error.response){
                res.status(error.response?.status).json(error.response?.data);
            } else {
                console.log(error);
                res.status(500).json({message: 'Internal server error'});
            }
        }catch(error){
            console.log('upload script api error'); 
        }
    }else if (req.method === 'GET'){
        const cookies = cookie.parse(req.headers.cookie || '');
        const authToken = cookies.authToken;

        try{
            console.log('download script api');
            const case_id = Number(req.query.case_id);
            const session_id = Number(req.query.session_id);
            const {error, response} = await downloadScript(case_id, session_id, authToken);

            if (response){
                res.status(response.status).json(response.data);
            }else if (error && axios.isAxiosError(error) && error.response){
                res.status(error.response?.status).json(error.response?.data);
                console.log(error);
            }else{
                res.status(500).json({message: 'Internal Server Error'});
                console.log(error);
            }
            
        } catch(error){
            console.log('download script api error');
        }
}
};