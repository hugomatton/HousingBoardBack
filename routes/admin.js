import express from 'express';

import { getAdmin, createAdmin} from '../controllers/admin.js';

const router = express.Router();

router.get('/', getAdmin);
router.post('/', createAdmin);

export default router;