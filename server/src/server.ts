import express from 'express';
import morgan from 'morgan';
import { AppDataSource } from './data-source';
import authRoutes from './routes/auth';

const app = express();
app.use(express.json());
app.use(morgan('dev'));

app.get('/', (_, res) => res.send('running'));
app.use('/api/auth', authRoutes);

let port = 8080;

app.listen(port, async () => {
  console.log(`server running at http//localhost:${port} port`);
  AppDataSource.initialize()
    .then(async () => {
      console.log('database initialized...');
    })
    .catch((error) => console.log(error));
});
