import { Router } from 'express';
import {getEquipos,getEquipoxId,postEquipo,putEquipo,patchEquipo,deleteEquipo
} from '../controladores/equipoCtrl.js';

const router = Router();

router.get('/equipo', getEquipos);
router.get('/equipo/:id', getEquipoxId);
router.post('/equipo', postEquipo);
router.put('/equipo/:id', putEquipo);
router.patch('/equipo/:id', patchEquipo);
router.delete('/equipo/:id', deleteEquipo);

export default router;