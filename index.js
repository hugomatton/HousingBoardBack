import cors from 'cors'
import express from 'express';
import bodyParser from 'body-parser';

import adminRoutes from './routes/admin.js';

const app = express();

app.use(cors({
  origin: 'http://localhost:3000', // remplacer par votre domaine
  methods: 'GET,PUT,POST,DELETE',
  credentials: true // permet l'envoi de cookies
}))
app.use(bodyParser.json({ limit: '30mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }))

app.use('/admin', adminRoutes);

const PORT = process.env.PORT|| 5000;

app.listen(PORT, () => {
  console.log(`Server Running on Port: http://localhost:${PORT}`)
})
