const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// CONFIGURACIÓN CENTRAL DE FIREBASE
try {
    const serviceAccount = require('./firebase-key.json');
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
    console.log("🔥 [Firebase]: Sistema central RSG sincronizado y operando.");
} catch (error) {
    console.error("❌ [Error Grave]: No se detectó 'firebase-key.json' en la carpeta.");
}

const db = admin.firestore();

// 1. RUTA DE STATUS (Para el indicador en el Navbar)
app.get('/api/status', (req, res) => {
    res.json({ status: 'Sincronizado', core: 'RSG Core v11.0 Final' });
});

// 2. MÓDULO: MANTENIMIENTO (CRUD COMPLETO)
app.get('/api/mantenimiento', async (req, res) => {
    try {
        const snapshot = await db.collection('Solicitudes').orderBy('fechaRegistro', 'desc').get();
        const lista = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(lista);
    } catch (err) { res.status(500).send({ error: err.message }); }
});

app.post('/api/mantenimiento', async (req, res) => {
    try {
        const nuevaSolicitud = { ...req.body, fechaRegistro: new Date().toISOString() };
        await db.collection('Solicitudes').add(nuevaSolicitud);
        res.json({ mensaje: 'Solicitud guardada con éxito' });
    } catch (err) { res.status(500).send(err.message); }
});

app.put('/api/mantenimiento/:id', async (req, res) => {
    try {
        await db.collection('Solicitudes').doc(req.params.id).update(req.body);
        res.json({ mensaje: 'Registro actualizado' });
    } catch (err) { res.status(500).send(err.message); }
});

app.delete('/api/mantenimiento/:id', async (req, res) => {
    try {
        await db.collection('Solicitudes').doc(req.params.id).delete();
        res.json({ mensaje: 'Registro eliminado' });
    } catch (err) { res.status(500).send(err.message); }
});

// 3. MÓDULO: COMENTARIOS (RESEÑAS)
app.get('/api/comentarios', async (req, res) => {
    try {
        const snapshot = await db.collection('Comentarios').orderBy('fecha', 'desc').get();
        const lista = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(lista);
    } catch (err) { res.status(500).send(err.message); }
});

app.post('/api/comentarios', async (req, res) => {
    try {
        const nuevoComentario = { ...req.body, fecha: new Date().toISOString() };
        await db.collection('Comentarios').add(nuevoComentario);
        res.json({ mensaje: 'Comentario publicado' });
    } catch (err) { res.status(500).send(err.message); }
});

app.delete('/api/comentarios/:id', async (req, res) => {
    try {
        await db.collection('Comentarios').doc(req.params.id).delete();
        res.json({ mensaje: 'Comentario eliminado' });
    } catch (err) { res.status(500).send(err.message); }
});

// 4. MÓDULO: CONTACTO (BANDEJA DE ENTRADA)
app.get('/api/contacto', async (req, res) => {
    try {
        const snapshot = await db.collection('MensajesContacto').orderBy('fechaEnvio', 'desc').get();
        const lista = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(lista);
    } catch (err) { res.status(500).send(err.message); }
});

app.post('/api/contacto', async (req, res) => {
    try {
        const nuevoMensaje = { ...req.body, fechaEnvio: new Date().toISOString() };
        await db.collection('MensajesContacto').add(nuevoMensaje);
        res.json({ mensaje: 'Formulario de contacto recibido correctamente' });
    } catch (err) { res.status(500).send(err.message); }
});

app.delete('/api/contacto/:id', async (req, res) => {
    try {
        await db.collection('MensajesContacto').doc(req.params.id).delete();
        res.json({ mensaje: 'Mensaje eliminado' });
    } catch (err) { res.status(500).send(err.message); }
});

// LANZAMIENTO DEL SERVIDOR
app.listen(port, () => {
    console.log(`===========================================`);
    console.log(`✅ SERVIDOR RSG OPERATIVO -> PUERTO ${port}`);
    console.log(`===========================================`);
});