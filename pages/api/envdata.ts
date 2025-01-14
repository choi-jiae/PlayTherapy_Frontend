import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse){
    const apiUrl = process.env.API_URL;
    const baseUrl = process.env.BASE_URL;
    console.log('API_URL:', apiUrl);
    console.log('BASE_URL:', baseUrl);
    res.status(200).json({apiUrl, baseUrl});
}