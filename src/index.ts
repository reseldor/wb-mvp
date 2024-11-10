require('dotenv').config();
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { router } from 'src/router';

const PORT = process.env.APP_PORT || 9999;
const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use('/api/v1', router);

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
});
