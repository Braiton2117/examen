import express from 'express'
import cors from 'cors';
import path from 'path';
import {fileURLToPath} from 'url';
import equipoRoutes from './routes/equipo.routes.js'
import partidoRoutes from './routes/partido.routes.js'
import perfilRoutes from './routes/perfil.routes.js'
import pronosticoRoutes from './routes/pronostico.routes.js'
import resultadoRoutes from './routes/resultado.routes.js'
import usuarioRoutes from './routes/usuario.routes.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app=express();
const corsOptions={
    origin:'*',
    methods:['GET','POST','PUT','PATCH','DELETE'],
    credentials:true
}
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use('/uploads',express.static(path.join(__dirname,'../uploads')));

app.use('/api',equipoRoutes)
app.use('/api',partidoRoutes)
app.use('/api',perfilRoutes)
app.use('/api',pronosticoRoutes)
app.use('/api',resultadoRoutes)
app.use('/api',usuarioRoutes)

app.use((req,res,next)=>{
    res.status(400).json({
        message:'Endpoint not found'
    })
})
export default app;