import express from 'express';

import {getHousingByOwnerId, getHousings, createHousing, deleteHousing, updateHousing} from '../controllers/housing.js';

const router = express.Router();

router.get('/', getHousings)
router.get('/:id', getHousingByOwnerId)
router.post('/', createHousing)
router.delete('/:id', deleteHousing)
router.patch('/:id', updateHousing)

export default router;