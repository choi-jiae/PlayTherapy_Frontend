import { NextApiRequest, NextApiResponse } from 'next';
import cookie from 'cookie';


export default (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'GET') {
        const cookies = cookie.parse(req.headers.cookie || "");
        const authToken = cookies.authToken;

        if (authToken) {
            res.status(200).json({ stay: true});
        } else {
            res.status(200).json({ redirect: '/authentication/signin' });
        }
    }else {
        res.status(405).json({ message: 'Method not allowed' });
    }
  }
