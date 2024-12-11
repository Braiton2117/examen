import { Router } from 'express';
import {getPartidos,getPartidoxId,postPartido,putPartido,patchPartido,deletePartido,getPartidosActivos,getGanadores} from '../controladores/partidoCtrl.js';

const router = Router();

router.get('/partido', getPartidos);
router.get('/partido/:id', getPartidoxId);
router.post('/partido', postPartido);
router.put('/partido/:id', putPartido);
router.patch('/partido/:id', patchPartido);
router.delete('/partido/:id', deletePartido);
router.get('/activo',getPartidosActivos)
router.get('/ganadores',getGanadores)

export default router;