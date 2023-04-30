import cors from 'cors'
import express from 'express';
import bodyParser from 'body-parser';

import adminRoutes from './routes/admin.js';
import ownerRoutes from './routes/owner.js';
import studentRoutes from './routes/student.js';
import housingRoutes from './routes/housing.js';
import housingTypesRoutes from './routes/housing_types.js';

const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  methods: 'GET,PUT,POST,DELETE',
  credentials: true
}))
app.use(bodyParser.json({ limit: '30mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }))

//USER ROUTES
app.use('/admin', adminRoutes);
app.use('/owner', ownerRoutes);
app.use('/student', studentRoutes);

//HOUSING DATA ROUTES
app.use('/housing', housingRoutes)
app.use('/housingtypes', housingTypesRoutes)

const PORT = process.env.PORT|| 5000;

app.listen(PORT, () => {
  console.log(`Server Running on Port: http://localhost:${PORT}`)
})
