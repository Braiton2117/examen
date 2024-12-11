import { Router } from 'express';
import {getPerfiles,getPerfilxId,postPerfil,putPerfil,patchPerfil,deletePerfil} from '../controladores/perfilCtrl.js';

const router = Router();

router.get('/perfil', getPerfiles);
router.get('/perfil/:id', getPerfilxId);
router.post('/perfil', postPerfil);
router.put('/perfil/:id', putPerfil);
router.patch('/perfil/:id', patchPerfil);
router.delete('/perfil/:id', deletePerfil);

export default router;