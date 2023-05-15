import oracledb from 'oracledb'
import { dbconfig } from '../dbconfig.js';

export const studentSendMessageToOwner = async (req, res) => {
    try {
        const { content, studentSendId, ownerReceiveId } = req.body;
        const connection = await oracledb.getConnection(dbconfig);
        const result = await connection.execute(
            `INSERT INTO message (MESSAGE_ID, MESSAGE_DATE, CONTENT, STUDENT_SEND_ID, OWNER_RECEIVE_ID)
         VALUES (:messageId, SYSTIMESTAMP, :content, :studentSendId, :ownerReceiveId)`,
            [
                Math.random().toString() + Math.random().toString() + Date.now().toString(),
                content,
                studentSendId,
                ownerReceiveId
            ]
        );
        await connection.commit()
        await connection.close();

        if (result.rowsAffected === 1) {
            res.status(200).send('Message sent successfully');
        } else {
            res.status(500).send('Failed to send message');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred');
    }
};


export const ownerSendMessageToStudent = async (req, res) => {
    try {
        const { content, ownerSendId, studentReceiveId } = req.body;
        const connection = await oracledb.getConnection(dbconfig);
        const result = await connection.execute(
            `INSERT INTO message (MESSAGE_ID, MESSAGE_DATE, CONTENT, OWNER_SEND_ID, STUDENT_RECEIVE_ID)
         VALUES (:messageId, SYSTIMESTAMP, :content, :ownerSendId, :studentReceiveId)`,
            [
                Math.random().toString() + Math.random().toString() + Date.now().toString(),
                content,
                ownerSendId,
                studentReceiveId
            ]
        );
        await connection.commit();
        await connection.close();

        if (result.rowsAffected === 1) {
            res.status(200).send('Message sent successfully');
        } else {
            res.status(500).send('Failed to send message');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred');
    }
};


export const getStudentOwnerConversation = async (req, res) => {
    try {
      const { owner_id, student_id } = req.query;
      const connection = await oracledb.getConnection(dbconfig);
      const result = await connection.execute(
        `SELECT MESSAGE_ID, MESSAGE_DATE, CONTENT, OWNER_SEND_ID, STUDENT_SEND_ID, OWNER_RECEIVE_ID, STUDENT_RECEIVE_ID
         FROM message
         WHERE (OWNER_SEND_ID = :ownerId AND STUDENT_RECEIVE_ID = :studentId)
         OR (OWNER_RECEIVE_ID = :ownerId AND STUDENT_SEND_ID = :studentId)
         ORDER BY MESSAGE_DATE ASC`,
        [owner_id, student_id]
      );
      await connection.close();
      res.status(200).json(result.rows);
    } catch (error) {
      console.error(error);
      res.status(500).send('An error occurred');
    }
  };
  