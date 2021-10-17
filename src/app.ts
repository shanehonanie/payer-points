import express from 'express';

import { pointsRouter } from './routes/points';

const PORT = 3000;

const app = express();

app.use(express.json());
app.use('/', pointsRouter);

app.listen(PORT, () => {
  console.log(`server is listening on ${PORT}`);
});
