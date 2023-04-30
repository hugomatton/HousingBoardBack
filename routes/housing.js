import express from 'express';

import {getHousing, getHousings, createHousing, deleteHousing, updateHousing} from '../controllers/housing.js';

const router = express.Router();

router.get('/', getHousings)
router.get('/:id', getHousing)
router.post('/', createHousing)
router.delete('/:id', deleteHousing)
router.patch('/:id', updateHousing)

export default router;