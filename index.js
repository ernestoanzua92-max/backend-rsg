const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// CONFIGURACIÓN OFICIAL DE FIREBASE (Realtime Database)
let db;
try {
    const keyPath = path.join(__dirname, 'firebase-key.json');
    const serviceAccount = require(keyPath);

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://rsg-app-299a2-default-rtdb.firebaseio.com/" 
    });
    
    db = admin.database(); 
    console.log("🔥 [Firebase]: Realtime Database conectada correctamente.");
} catch (error) {
    console.error("❌ Error en conexión:", error.message);
}

// --- RUTAS DE LA API ---

// MANTENIMIENTO
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
    } catch (err) { res.status(500).send(err.message); }
});

// COMENTARIOS
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
    } catch (err) { res.status(500).send(err.message); }
});

// CONTACTO
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
    } catch (err) { res.status(500).send(err.message); }
});

app.listen(port, () => {
    console.log(`✅ SERVIDOR RSG OPERATIVO EN PUERTO ${port}`);
});