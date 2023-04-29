import express from 'express';

import { loginStudent, createStudent} from '../controllers/student.js';

const router = express.Router();

router.post('/login', loginStudent);
router.post('/signup', createStudent);

export default router;