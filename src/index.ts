import express, { type Express, type Request, type Response } from 'express';
import { logger, requestLogger } from './middlewares/logger.ts';
import { applyMiddleWare } from './middlewares/applyMiddleWare.ts';
import { checkDatabaseConnection } from './db/connectDB.ts';

const app: Express = express();

applyMiddleWare(app)


app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.listen(3000,()=>{
  console.log("server running")
  checkDatabaseConnection();
});