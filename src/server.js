import express from 'express';
import dotenv from 'dotenv';
import cors from "cors";
import mongoose from 'mongoose';
import path from 'path';
import dns from 'dns';
import { fileURLToPath } from 'url';

// Forzar DNS de Google para evitar el error querySrv
dns.setServers(['8.8.8.8', '8.8.4.4']);

import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/users.routes.js';
import seedRoles from './utils/seedRoles.js';
import seedUsers from './utils/seedUsers.js';

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

app.get('/', (req, res) => res.redirect('/signIn'));
app.get('/signIn', (req, res) => res.render('signIn'));
app.get('/signUp', (req, res) => res.render('signUp'));
app.get('/profile', (req, res) => res.render('profile'));
app.get('/dashboard', (req, res) => res.render('dashboard'));
app.get('/admin', (req, res) => res.render('admin'));
app.get('/403', (req, res) => res.render('403'));

app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).json({ message: err.message || 'Error interno del servidor' });
});

app.use((req, res) => res.status(404).render('404'));

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('❌ ERROR: MONGODB_URI no está definida en las variables de entorno.');
    process.exit(1);
}

mongoose.connect(MONGODB_URI, { autoIndex: true })
    .then( async () => {
        console.log('✅ Conexión exitosa a MongoDB');
        await seedRoles();
        await seedUsers();
        app.listen(PORT, () => console.log(`🚀 Servidor corriendo en el puerto ${PORT}`));
    })
    .catch(err => {
        console.error('❌ Error al conectar con MongoDB:', err.message);
        console.error('Asegúrate de que la IP de Render esté permitida en MongoDB Atlas (Network Access).');
        process.exit(1);
    });
