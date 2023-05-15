import express from 'express';

import {getStudentOwnerConversation, ownerSendMessageToStudent, studentSendMessageToOwner} from '../controllers/message.js';

const router = express.Router();

router.post('/studentToOwner', studentSendMessageToOwner)
router.post('/ownerToStudent', ownerSendMessageToStudent)
router.get('/',getStudentOwnerConversation)

export default router;