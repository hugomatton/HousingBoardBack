import express from 'express';
import oracledb from 'oracledb'
import {dbconfig} from '../dbconfig.js';


export const getAdmin = async (req, res) => {
    const sql = `SELECT * FROM administrator`;
    const connection = await oracledb.getConnection(dbconfig);
    const result = await connection.execute(sql);
    res.send(result)
}

export const createAdmin = async (req, res) => {
    try {
        const { admin_id, first_name, last_name, email, phone_number, password } = req.body;
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



