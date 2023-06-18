import * as dotenv from 'dotenv';
dotenv.config({path: process.cwd() + '/config.env'});

import app from './app';

app();