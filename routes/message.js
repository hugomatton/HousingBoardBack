import express from 'express';

import {getStudentOwnerConversation, ownerSendMessageToStudent, studentSendMessageToOwner, loadStudentConversation} from '../controllers/message.js';

const router = express.Router();

router.post('/studentToOwner', studentSendMessageToOwner)
router.post('/ownerToStudent', ownerSendMessageToStudent)
router.get('/conversation',getStudentOwnerConversation)
router.get('/allConversationStudent', loadStudentConversation)

export default router;