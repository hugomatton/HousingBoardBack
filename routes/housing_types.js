import express from 'express';

import {getTypes} from '../controllers/housing_types.js';

const router = express.Router();

router.get('/', getTypes)

export default router;