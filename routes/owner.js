import express from 'express';

import { loginOwner, createOwner} from '../controllers/owner.js';

const router = express.Router();

router.post('/login', loginOwner);
router.post('/signup', createOwner);

export default router;