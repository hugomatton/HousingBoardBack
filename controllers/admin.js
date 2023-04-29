import express from 'express';
import oracledb from 'oracledb'
import { dbconfig } from '../dbconfig.js';


/**
 * 
 */
export const loginAdmin = async (req, res) => {
    const { admin_id, password } = req.body;
    if (!admin_id || !password) {
        return res.status(400).send({ message: "Missing required fields" });
    }
    const sql = `SELECT * FROM administrator WHERE admin_id = :admin_id AND password = :password`;
    const bindParams = {
        admin_id,
        password
    }
    try {
        const connection = await oracledb.getConnection(dbconfig);
        const result = await connection.execute(sql, bindParams);
        if (result.rows.length > 0) {
            return res.status(200).send(result.rows[0])
        } else {
            return res.status(401).send({ message: "Invalid admin_id or password" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: "Server error" });
    }
}

/**
 * 
 */
export const createAdmin = async (req, res) => {
    try {
        const { admin_id, first_name, last_name, email, phone_number, password } = req.body;
        if (!admin_id || !password || !first_name || !last_name || !phone_number || email) {
            return res.status(400).send({ message: "Missing required fields" });
        }
        const sql = `INSERT INTO Administrator (admin_id, password, first_name, last_name, email, phone_number) 
                     VALUES (:admin_id, :password, :first_name, :last_name, :email, :phone_number)`
        const bindParams = {
            admin_id,
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
        res.status(201).send(result); // OK, resource created
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};



