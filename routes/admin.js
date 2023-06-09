import express from 'express';

import { loginAdmin, createAdmin} from '../controllers/admin.js';

const router = express.Router();

router.post('/login', loginAdmin);
router.post('/signup', createAdmin);

export default router;