import express from 'express';
import { config } from 'dotenv';
import { Logger } from './util/logger.js';
import { init } from './app/app.js';

const env = config();
const app = express();

init(app);

if (env.error) {
    Logger.error('.env file not found', 'SERVER');
    process.exit(1);
}

const port = process.env.PORT;

app.listen(port, () => {
    Logger.info(`Application is running on the port ${port}`, 'SERVER');
});
