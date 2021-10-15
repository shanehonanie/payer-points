import express from 'express';

const PORT = 3000;

const app = express();

app.get('/', (req: express.Request, res: express.Response) => {
  res.send('Hello World!');
});

app.listen(PORT, () => {
  return console.log(`server is listening on ${PORT}`);
});
