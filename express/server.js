import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import http from 'http';
import {errorMiddleware} from './middleware/error.js';
import routes from './routes/index.js';
import {handleError} from "./api/handleError.js";
import {loadConfig} from "./api/envConfig.js";

export const __dirname = process.cwd()

loadConfig();

const PORT = process.env.PORT;

const app = express();

const server = http.createServer(app);

const corsConfig = {
    credentials: true, origin: true,
};

app.use(helmet());
app.use(cors(corsConfig));
app.use(express.json({
    limit: '10MB',
    type: [
        'application/json',
        'text/plain',
    ],
}));

app.use(errorMiddleware);

routes.forEach(([path, router]) => {
    app.use( '/master-account' + path, router);
});

server.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
    console.log('environment', process.env.NODE_ENV)
}).on('error', (err) => {
        handleError({
            description: 'server error',
            error: err?.message
        })
});
