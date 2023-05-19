import express from 'express';

import {getStudentOwnerConversation, ownerSendMessageToStudent, studentSendMessageToOwner, loadStudentConversation, loadOwnerConversation} from '../controllers/message.js';

const router = express.Router();

router.post('/studentToOwner', studentSendMessageToOwner)
router.post('/ownerToStudent', ownerSendMessageToStudent)
router.get('/conversation',getStudentOwnerConversation)
router.get('/allConversationStudent', loadStudentConversation)
router.get('/allConversationOwner', loadOwnerConversation)


export default router;