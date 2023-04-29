import oracledb from 'oracledb'
import { dbconfig } from '../dbconfig.js';

export const loginOwner = async (req, res) => {
    const { owner_id, password } = req.body;
    if (!owner_id || !password) {
        return res.status(400).send({ message: "Missing required fields" });
    }
    const sql = `SELECT * FROM owner WHERE owner_id = :owner_id AND password = :password`;
    const bindParams = {
        owner_id,
        password
    }
    try {
        const connection = await oracledb.getConnection(dbconfig);
        const result = await connection.execute(sql, bindParams);
        if (result.rows.length > 0) {
            return res.status(200).send(result.rows[0])
        } else {
            return res.status(401).send({ message: "Invalid owner_id or password" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: "Server error" });
    }
}

export const createOwner = async (req, res) => {
    try {
        const { owner_id, password, first_name, last_name, email, phone_number } = req.body;
        if (!owner_id || !password || !first_name || !last_name || !phone_number || !email) {
            return res.status(400).send({ message: "Missing required fields" });
        }
        const sql = `INSERT INTO Owner (owner_id, password, first_name, last_name, email, phone_number) 
                     VALUES (:owner_id, :password, :first_name, :last_name, :email, :phone_number)`
        const bindParams = {
            owner_id,
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