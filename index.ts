
const express = require('express');
import dbConnection from './services/Database';
// import { PORT } from './config';



import App from './services/ExpressApp';

const StartServer = async () => {
  const app = express();

  await dbConnection();
  const PORT = process.env.PORT || 8000;
  await App(app);
  app.listen(PORT, () => {
    console.log(`Listening to port 8000 ${PORT}`);
  });
};

StartServer();
