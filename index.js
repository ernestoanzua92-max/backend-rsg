const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const path = require('path');

const app = express();

// Render usa un puerto dinámico, por eso es vital process.env.PORT
const port = process.env.PORT || 3000;

// 1. CONFIGURACIÓN DE CORS BLINDADA (Soluciona el Status 0 / Unknown Error)
app.use(cors({
    origin: '*', // Permite peticiones de cualquier origen (como tu Firebase Hosting)
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(express.json());

// 2. INICIALIZACIÓN DE FIREBASE (Realtime Database)
let db;
try {
    // Usamos path.join para evitar errores de ruta en el servidor de Render
    const keyPath = path.join(__dirname, 'firebase-key.json');
    const serviceAccount = require(keyPath);

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://rsg-app-299a2-default-rtdb.firebaseio.com/"
    });
    
    db = admin.database(); 
    console.log("🔥 [Firebase]: Realtime Database conectada y lista.");
} catch (error) {
    console.error("❌ [Error]: No se pudo conectar a Firebase:", error.message);
}

// 3. RUTAS DE LA API (Capa de Servicios)

// --- MANTENIMIENTO ---
app.get('/api/mantenimiento', (req, res) => {
    db.ref('Solicitudes').once('value', (snapshot) => {
        const data = snapshot.val();
        const lista = data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : [];
        res.json(lista);
    }, (error) => res.status(500).json({ error: error.message }));
});

app.post('/api/mantenimiento', async (req, res) => {
    try {
        const nuevaSolicitud = { ...req.body, fechaRegistro: new Date().toISOString() };
        await db.ref('Solicitudes').push(nuevaSolicitud);
        res.json({ mensaje: 'Solicitud guardada con éxito' });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// --- COMENTARIOS ---
app.get('/api/comentarios', (req, res) => {
    db.ref('Comentarios').once('value', (snapshot) => {
        const data = snapshot.val();
        const lista = data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : [];
        res.json(lista);
    }, (error) => res.status(500).json({ error: error.message }));
});

app.post('/api/comentarios', async (req, res) => {
    try {
        const nuevoComentario = { ...req.body, fecha: new Date().toISOString() };
        await db.ref('Comentarios').push(nuevoComentario);
        res.json({ mensaje: 'Comentario publicado' });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// --- CONTACTO ---
app.get('/api/contacto', (req, res) => {
    db.ref('MensajesContacto').once('value', (snapshot) => {
        const data = snapshot.val();
        const lista = data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : [];
        res.json(lista);
    }, (error) => res.status(500).json({ error: error.message }));
});

app.post('/api/contacto', async (req, res) => {
    try {
        const nuevoMensaje = { ...req.body, fechaEnvio: new Date().toISOString() };
        await db.ref('MensajesContacto').push(nuevoMensaje);
        res.json({ mensaje: 'Formulario de contacto recibido' });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// 4. LANZAMIENTO DEL SERVIDOR
app.listen(port, () => {
    console.log(`===========================================`);
    console.log(`✅ SERVIDOR RSG OPERATIVO -> PUERTO ${port}`);
    console.log(`===========================================`);
});