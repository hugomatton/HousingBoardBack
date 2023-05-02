import oracledb from 'oracledb'
import { dbconfig } from '../dbconfig.js';

/**
 * GET ALL HOUSINGS
 */
export const getAllHousings = async (req, res) => {
  const sqlHousing = `SELECT * FROM Housing`
  const sqlPicture = `SELECT * FROM Picture WHERE housing_id = :housing_id`
  try {
    const connection = await oracledb.getConnection(dbconfig)
    //housing
    const resultHousing = await connection.execute(sqlHousing)
    //format result
    const data = []
    for(let i = 0;i < resultHousing.rows.length; i++){
      let h = resultHousing.rows[i]
      let formatHousing = {
        housing_id : h[0],
        housing_address : h[1],
        bedrooms_nb : h[2],
        bathrooms_nb : h[3],
        area : h[4],
        monthly_rent : h[5],
        lease_duration : h[6],
        furnished : h[7],
        type_name : h[8],
        owner_id : h[9],
        pictures : []
      }
      //picture
      const resultPicture = await connection.execute(sqlPicture, {housing_id: formatHousing.housing_id})
      for(let l = 0; l < resultPicture.rows.length; l++){
        let p = resultPicture.rows[l]
        if(formatHousing.housing_id === p[1]){
          formatHousing.pictures.push(p[2])
        }
      }
      data.push(formatHousing)
    }
    await connection.close()
    res.status(200).send(data)
  } catch (error) {
    return res.status(500).send({ message: "Server error" });
  }
}


/**
 * GET HOUSINGS BY OWNER ID
 */
export const getHousingByOwnerId = async (req, res) => {
  const id = req.params.id
  const sqlHousing = `SELECT * FROM Housing WHERE owner_id = :id`
  const bindParamsHousing = { id }
  const sqlPicture = `SELECT * FROM Picture WHERE housing_id = :housing_id`
  try {
    const connection = await oracledb.getConnection(dbconfig)
    //housing
    const resultHousing = await connection.execute(sqlHousing, bindParamsHousing)
    //format result
    const data = []
    for(let i = 0;i < resultHousing.rows.length; i++){
      let h = resultHousing.rows[i]
      let formatHousing = {
        housing_id : h[0],
        housing_address : h[1],
        bedrooms_nb : h[2],
        bathrooms_nb : h[3],
        area : h[4],
        monthly_rent : h[5],
        lease_duration : h[6],
        furnished : h[7],
        type_name : h[8],
        owner_id : h[9],
        pictures : []
      }
      //picture
      const resultPicture = await connection.execute(sqlPicture, {housing_id: formatHousing.housing_id})
      for(let l = 0; l < resultPicture.rows.length; l++){
        let p = resultPicture.rows[l]
        if(formatHousing.housing_id === p[1]){
          formatHousing.pictures.push(p[2])
        }
      }
      data.push(formatHousing)
    }
    await connection.close()
    res.status(200).send(data)
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
export const deleteHousingById = async (req, res) => {
  const housingId = req.params.id;
  const deleteHousingSql = `DELETE FROM Housing WHERE housing_id = :id`;
  const deletePicturesSql = `DELETE FROM Picture WHERE housing_id = :id`;
  try {
    const connection = await oracledb.getConnection(dbconfig);
    const deletePicturesResult = await connection.execute(deletePicturesSql, {id: housingId});
    const deleteResult = await connection.execute(deleteHousingSql, {id: housingId});
    await connection.commit(); // Commit changes to the database
    await connection.close();
    if(deleteResult.rowsAffected === 0) {
      return res.status(404).send({ message: "Housing not found" });
    }
    res.status(200).send({ message: "Housing and associated pictures deleted successfully" });
  } catch (error) {
    if(error.errorNum === 2292) { // Check for integrity constraint violation
      return res.status(400).send({ message: "Cannot delete housing with associated pictures" });
    }
    return res.status(500).send({ message: "Server error" });
  }
}
