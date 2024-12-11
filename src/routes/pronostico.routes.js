import { Router } from 'express';
import {getPronosticos,getPronosticoxId,postPronostico,putPronostico,patchPronostico,deletePronostico,getAcertantes} from '../controladores/pronosticoCtrl.js';

const router = Router();

router.get('/pronostico', getPronosticos);
router.get('/pronostico/:id', getPronosticoxId);
router.post('/pronostico', postPronostico);
router.put('/pronostico/:id', putPronostico);
router.patch('/pronostico/:id', patchPronostico);
router.delete('/pronostico/:id', deletePronostico);
router.delete('/lista/:id/acertantes',getAcertantes)

export default router;