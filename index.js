import cors from "cors";
import express from "express";
import bodyParser from "body-parser";
import cron from "node-cron";
import axios from "axios";
import { dbconfig } from "./dbconfig.js";
import oracledb from "oracledb";

import adminRoutes from "./routes/admin.js";
import ownerRoutes from "./routes/owner.js";
import studentRoutes from "./routes/student.js";
import housingRoutes from "./routes/housing.js";
import housingTypesRoutes from "./routes/housing_types.js";
import messageRoutes from "./routes/message.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,PUT,POST,DELETE",
    credentials: true,
  })
);
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

//USER ROUTES
app.use("/admin", adminRoutes);
app.use("/owner", ownerRoutes);
app.use("/student", studentRoutes);

//HOUSING DATA ROUTES
app.use("/housing", housingRoutes);
app.use("/housingtypes", housingTypesRoutes);
app.use("/message", messageRoutes);

const compareDatabases = async () => {
  try {
    //Students from second DB
    const response = await axios.get("http://34.248.236.103:3000/students");
    const studentsFromSecondDB = response.data;

    //DB connection
    await oracledb.createPool(dbconfig);
    const connection = await oracledb.getConnection();

    //Students from our DB
    const query = `SELECT * FROM student`;
    const result = await connection.execute(query);
    const studentsFromYourDB = result.rows;

    //Compare and synch
    for (const studentFromSecondDB of studentsFromSecondDB) {
      const matchingStudent = studentsFromYourDB.find(
        (studentFromYourDB) => studentFromYourDB[0] == studentFromSecondDB[2]
      );
      if (matchingStudent) {
        //The student exists, we update it :
        const updateQuery = `UPDATE student SET first_name = :1, last_name = :2, email = :3 WHERE student_id = :4`;
        const updateParams = [
          studentFromSecondDB[3], // Replace :first_name
          studentFromSecondDB[4], // Replace :last_name
          studentFromSecondDB[5], // Replace :email
          studentFromSecondDB[2], // Replace :student_id
        ];
        await connection.execute(updateQuery, updateParams);
        //Student doesn't exist :
      } else {
        const insertQuery = `INSERT INTO student VALUES (:1, 'EUC', :2, :3, :4, :5, '0987654321')`;
        const insertParams = [
          studentFromSecondDB[2], // Replace :student_id
          studentFromSecondDB[2], // Replace :student_id (again)
          studentFromSecondDB[3], // Replace :first_name
          studentFromSecondDB[4], // Replace :last_name
          studentFromSecondDB[5], // Replace :email
        ];
        await connection.execute(insertQuery, insertParams);
      }
    }

    //commit
    await connection.commit();

    //Close connection
    await connection.close();
    await oracledb.getPool().close();

    console.log("Compare and sync completed");
  } catch (error) {
    console.error("Error comparing databases", error);
  }
};

cron.schedule("*/30 * * * *", () => {
  compareDatabases();
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server Running on Port: http://localhost:${PORT}`);
});