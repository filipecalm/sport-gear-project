import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(cors({ origin: `http://${process.env.HOST}:${process.env.CLIENT_PORT}` }));

// Increase upload limit to 50mb
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const conn = require('./src/database/db');
const handleError = require('./src/helpers/handleError');

// Public Images
app.use(express.static('public'));

// routes
const ProductRoutes = require('./src/routes/ProductRoutes');
const UserRoutes = require('./src/routes/UserRoutes');
const CategoryRoutes = require('./src/routes/CategoryRoutes');
const CardRoutes = require('./src/routes/CardRoutes');

app.use(express.json());

app.use('/product', ProductRoutes);
app.use('/user', UserRoutes);
app.use('/category', CategoryRoutes);
app.use('/card', CardRoutes);

app.use(handleError);

const serverPort = process.env.SERVER_PORT || 3000;
app.listen(serverPort, () => {
  console.log(`Server listening on port ${serverPort}`);
});
