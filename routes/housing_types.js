import express from 'express';

import {getTypes, createHousingType, deleteHousingType} from '../controllers/housing_types.js';

const router = express.Router();

router.get('/', getTypes)
router.get('/', createHousingType)
router.delete('/:type_name', deleteHousingType)

export default router;