import 'express-async-errors';
import express, { json } from 'express';
import cors from 'cors';
import chalk from 'chalk';
import routes from './routes/index.js';
import errorMiddleware from './middlewares/error.middleware.js';
import cookieParser from 'cookie-parser';
const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(json());
app.use(cookieParser());
app.use(routes);
app.use(errorMiddleware);
app.listen(port, () => {
    console.log(chalk.green(`Server listening on port ${port}`));
});
