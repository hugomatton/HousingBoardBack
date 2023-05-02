import express from 'express';

import {getHousingByOwnerId, getAllHousings, createHousing, deleteHousingById, updateHousing} from '../controllers/housing.js';

const router = express.Router();

router.get('/', getAllHousings)
router.get('/:id', getHousingByOwnerId)
router.post('/', createHousing)
router.delete('/:id', deleteHousingById)
router.patch('/:id', updateHousing)

export default router;