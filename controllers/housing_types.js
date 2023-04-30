import oracledb from 'oracledb'
import { dbconfig } from '../dbconfig.js';

export const getTypes = async (req, res) => {
    const sql = `SELECT * FROM Housing_type`
    try {
        const connection = await oracledb.getConnection(dbconfig)
        const result = await connection.execute(sql)
        res.send(result)
    } catch (error) {
        return res.status(500).send({ message: "Server error" });
    }
}