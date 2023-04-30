import oracledb from 'oracledb'
import { dbconfig } from '../dbconfig.js';

/**
 * GET ALL HOUSINGS
 */
export const getHousings = async (req, res) => {
  const sql = `SELECT * FROM Housing`
  try {
    const connection = await oracledb.getConnection(dbconfig)
    const result = await connection.execute(sql)
    res.send(result)
  } catch (error) {
    return res.status(500).send({ message: "Server error" });
  }
}

/**
 * GET ONE HOUSING BY ID
 */
export const getHousing = async (req, res) => {
  const id = req.params.id
  const sql = `SELECT * FROM Housing WHERE housing_id = :id`
  const bindParams = { id }
  try {
    const connection = await oracledb.getConnection(dbconfig)
    const result = await connection.execute(sql, bindParams)
    res.send(result)
  } catch (error) {
    return res.status(500).send({ message: "Server error" });
  }
}

/**
 * CREATE ONE HOUSING
 */
export const createHousing = async (req, res) => {  
  const { 
    housing_address,
    bedrooms_nb,
    bathrooms_nb,
    area,
    monthly_rent,
    lease_duration,
    furnished,
    type_name,
    owner_id,
    pictures
  } = req.body
  //generation de l'id unique pour housing
  const housing_id = Math.random().toString() + Date.now().toString() + Math.random().toString()
  //pour inserer picture
  const sqlPicture = `INSERT INTO picture (picture_id, picture_url, housing_id) 
                      VALUES (picture_seq.NEXTVAL, :p, :housing_id)`
  //Pour inserer housing
  const sqlHousing = `INSERT INTO housing (housing_id, housing_address, bedrooms_nb, bathrooms_nb, area, monthly_rent, lease_duration, furnished, type_name, owner_id) 
                      VALUES (:housing_id, :housing_address, :bedrooms_nb, :bathrooms_nb, :area, :monthly_rent, :lease_duration, :furnished, :type_name, :owner_id)`;
  const bindParamsHousing = {housing_id, housing_address, bedrooms_nb, bathrooms_nb, area, monthly_rent, lease_duration, furnished, type_name, owner_id}
  try {
    //On ajoute housing
    const connection = await oracledb.getConnection(dbconfig);
    await connection.execute(sqlHousing, bindParamsHousing);
    //On ajoute picture de l'housing
    for(let p of pictures){
      await connection.execute(sqlPicture, {p , housing_id})
    }
    await connection.commit()
    await connection.close();
    res.status(201).send({ message: 'Housing created successfully.' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ error: 'Error creating housing.' });
  }
}


/**
 * UPDATE ONE HOUSING
 */
export const updateHousing = async (req, res) => {
  const housingId = req.params.id; // récupérer l'ID du logement à mettre à jour depuis la requête
  const { housing_address,
    bedrooms_nb,
    bathrooms_nb,
    area,
    monthly_rent,
    lease_duration,
    furnished,
    type_name,
    owner_id,
    picture_id } = req.body;
  const sql = `UPDATE housing 
                 SET housing_address = :housing_address,
                     bedrooms_nb = :bedrooms_nb,
                     bathrooms_nb = :bathrooms_nb,
                     area = :area,
                     monthly_rent = :monthly_rent,
                     lease_duration = :lease_duration,
                     furnished = :furnished,
                     type_name = :type_name,
                     owner_id = :owner_id,
                     picture_id = :picture_id
                 WHERE id = :id`; // requête SQL pour mettre à jour l'entrée dans la table "housing"
  const bindParams = { housing_address, bedrooms_nb, bathrooms_nb, area, monthly_rent, lease_duration, furnished, type_name, owner_id, picture_id, id: housingId };
  try {
    const connection = await oracledb.getConnection(dbconfig);
    const result = await connection.execute(sql, bindParams);
    await connection.commit()
    await connection.close();
    if (result.rowsAffected && result.rowsAffected > 0) {
      res.status(200).send({ message: `Housing with id ${housingId} updated successfully.` });
    }
    else {
      res.status(404).send({ error: `Housing with id ${housingId} not found.` });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ error: 'Error updating housing.' });
  }
}


/**
 * DELETE ONE HOUSING BY ID
 */
export const deleteHousing = async (req, res) => {
  const housingId = req.params.id; // récupérer l'ID du logement à supprimer depuis la requête
  const sql = `DELETE FROM housing WHERE id = :id`; // requête SQL pour supprimer l'entrée dans la table "housing"
  try {
    const connection = await oracledb.getConnection(dbconfig);
    const result = await connection.execute(sql, [housingId]);
    await connection.commit()
    await connection.close();
    if (result.rowsAffected && result.rowsAffected > 0) {
      res.status(200).send({ message: `Housing with id ${housingId} deleted successfully.` });
    } else {
      res.status(404).send({ error: `Housing with id ${housingId} not found.` });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ error: 'Error deleting housing.' });
  }
}
