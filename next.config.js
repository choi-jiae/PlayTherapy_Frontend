const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const env = process.env.PHASE || 'dev';

if (env){
  const envFile = path.resolve(__dirname, `.env.${env.toLowerCase()}`);

  if (fs.existsSync(envFile)) {
    dotenv.config({ path: envFile});
    console.log(`Loaded environment variables from ${envFile}`);
    console.log(process.env.API_URL);
    console.log(process.env.BASE_URL)
  } else {
    console.warn(`Environment file ${envFile} does not exist`);
  }  
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath : "",
  async redirects() {
    return [
      {
        source: '/',
        destination: '/case',
        permanent: true,
      },
    ];
  },
  env: {
    API_URL: process.env.API_URL,
    BASE_URL: process.env.BASE_URL,
  },
}

module.exports = nextConfig;