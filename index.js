const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const path = require('path');

const app = express();
const port = process.env.PORT || 10000;

// 1. CONFIGURACIÓN DE CORS
app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(express.json());

// 2. INICIALIZACIÓN DE FIREBASE
let db;
try {
    const keyPath = path.join(__dirname, 'firebase-key.json');
    const serviceAccount = require(keyPath);

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://rsg-app-299a2-default-rtdb.firebaseio.com/"
    });
    
    db = admin.database(); 
    console.log("🔥 [Firebase]: Realtime Database conectada correctamente para CRUD completo.");
} catch (error) {
    console.error("❌ [Error Firebase]:", error.message);
}

// ---------------------------------------------------------
// 3. RUTAS DE LA API
// ---------------------------------------------------------

/** --- SECCIÓN: MANTENIMIENTO (Solicitudes) --- **/

// Obtener todas
app.get('/api/mantenimiento', (req, res) => {
    db.ref('Solicitudes').once('value', (snapshot) => {
        const data = snapshot.val();
        const lista = data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : [];
        res.json(lista);
    }, (error) => res.status(500).json({ error: error.message }));
});

// Crear nueva
app.post('/api/mantenimiento', async (req, res) => {
    try {
        const nuevaSolicitud = { ...req.body, fechaRegistro: new Date().toISOString() };
        await db.ref('Solicitudes').push(nuevaSolicitud);
        res.status(201).json({ mensaje: 'Solicitud guardada con éxito' });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// Editar (Actualizar)
app.put('/api/mantenimiento/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await db.ref(`Solicitudes/${id}`).update(req.body);
        res.json({ mensaje: 'Solicitud actualizada correctamente' });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// Borrar (Eliminar)
app.delete('/api/mantenimiento/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await db.ref(`Solicitudes/${id}`).remove();
        res.json({ mensaje: 'Solicitud eliminada correctamente' });
    } catch (err) { res.status(500).json({ error: err.message }); }
});


/** --- SECCIÓN: COMENTARIOS --- **/

app.get('/api/comentarios', (req, res) => {
    db.ref('Comentarios').once('value', (snapshot) => {
        const data = snapshot.val();
        const lista = data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : [];
        res.json(lista);
    });
});

app.post('/api/comentarios', async (req, res) => {
    try {
        const nuevoComentario = { ...req.body, fecha: new Date().toISOString() };
        await db.ref('Comentarios').push(nuevoComentario);
        res.status(201).json({ mensaje: 'Comentario publicado' });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/comentarios/:id', async (req, res) => {
    try {
        await db.ref(`Comentarios/${req.params.id}`).remove();
        res.json({ mensaje: 'Comentario borrado' });
    } catch (err) { res.status(500).json({ error: err.message }); }
});


/** --- SECCIÓN: CONTACTO --- **/

app.get('/api/contacto', (req, res) => {
    db.ref('MensajesContacto').once('value', (snapshot) => {
        const data = snapshot.val();
        const lista = data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : [];
        res.json(lista);
    });
});

app.post('/api/contacto', async (req, res) => {
    try {
        const nuevoMensaje = { ...req.body, fechaEnvio: new Date().toISOString() };
        await db.ref('MensajesContacto').push(nuevoMensaje);
        res.status(201).json({ mensaje: 'Mensaje enviado' });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/contacto/:id', async (req, res) => {
    try {
        await db.ref(`MensajesContacto/${req.params.id}`).remove();
        res.json({ mensaje: 'Mensaje eliminado' });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// 4. INICIO DEL SERVIDOR
app.listen(port, () => {
    console.log(`✅ SERVIDOR RSG OPERATIVO -> PUERTO ${port}`);
});