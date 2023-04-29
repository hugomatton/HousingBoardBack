import oracledb from 'oracledb'
import { dbconfig } from '../dbconfig.js';

export const loginStudent = async (req, res) => {
    const { student_id, password } = req.body;
    if (!student_id || !password) {
        return res.status(400).send({ message: "Missing required fields" });
    }
    const sql = `SELECT * FROM student WHERE student_id = :student_id AND password = :password`;
    const bindParams = {
        student_id,
        password
    }
    try {
        const connection = await oracledb.getConnection(dbconfig);
        const result = await connection.execute(sql, bindParams);
        if (result.rows.length > 0) {
            return res.status(200).send(result.rows[0])
        } else {
            return res.status(401).send({ message: "Invalid student_id or password" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: "Server error" });
    }
}

export const createStudent = async (req, res) => {
    try {
        const { student_id, university, password, first_name, last_name, email, phone_number } = req.body;
        if (!student_id || !university || !password || !first_name || !last_name || !email || !phone_number) {
            return res.status(400).send({ message: "Missing required fields" });
        }
        const sql = `INSERT INTO Student (student_id, university, password, first_name, last_name, email, phone_number) 
                     VALUES (:student_id, :university, :password, :first_name, :last_name, :email, :phone_number)`
        const bindParams = {
            student_id,
            university,
            password,
            first_name,
            last_name,
            email,
            phone_number
        };
        const connection = await oracledb.getConnection(dbconfig);
        const result = await connection.execute(sql, bindParams);
        await connection.commit()
        await connection.close();
        res.status(201).send(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};