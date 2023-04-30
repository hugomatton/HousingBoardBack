import oracledb from 'oracledb'
import { dbconfig } from '../dbconfig.js';

/**
 * GET ALL HOUSING TYPES
 */
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

/**
 * CREATE ONE HOUSING TYPE
 */
export const createHousingType = async (req, res) => {
    const { type_name } = req.body
    const sql = `INSERT INTO housing_type (type_name) 
                 VALUES (:type_name)`;
    const bindParams = {type_name}
    try {
        const connection = await oracledb.getConnection(dbconfig);
        const result = await connection.execute(sql, bindParams);
        await connection.commit()
        await connection.close();
        res.status(201).send({ message: 'Housing type created successfully.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send({ error: 'Error creating housing type.' });
    }
}

/**
 * DELETE ONE HOUSING TYPE BY NAME
 */
export const deleteHousingType = async (req, res) => {
    const type_name = req.params.type_name; // récupérer l'ID du logement à supprimer depuis la requête
    const sql = `DELETE FROM housing_type WHERE type_name = :type_name`; // requête SQL pour supprimer l'entrée dans la table "housing"
    try {
      const connection = await oracledb.getConnection(dbconfig);
      const result = await connection.execute(sql, [type_name]);
      await connection.commit()
      await connection.close();
      if (result.rowsAffected && result.rowsAffected > 0) {
        res.status(200).send({ message: `Housing type with name ${type_name} deleted successfully.` });
      } else {
        res.status(404).send({ error: `Housing type with name ${type_name} not found.` });
      }
    } catch (err) {
      console.error(err.message);
      res.status(500).send({ error: 'Error deleting housing type.' });
    }
  }