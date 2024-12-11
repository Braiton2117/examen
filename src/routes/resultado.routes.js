import { Router } from 'express';
import {getResultados,getResultadoxId,postResultado,putResultado,patchResultado,deleteResultado} from '../controladores/resultadoCtrl.js';

const router = Router();

router.get('/resultado', getResultados);
router.get('/resultado/:id', getResultadoxId);
router.post('/resultado', postResultado);
router.put('/resultado/:id', putResultado);
router.patch('/resultado/:id', patchResultado);
router.delete('/resultado/:id', deleteResultado);

export default router;