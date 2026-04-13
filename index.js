const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// CONFIGURACIÓN DE FIREBASE (Realtime Database)
let db;
try {
    const keyPath = path.join(__dirname, 'firebase-key.json');
    const serviceAccount = require(keyPath);

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        // REEMPLAZA ESTA URL por la de tu consola de Firebase
        databaseURL: "https://rsg-app-299a2-default-rtdb.firebaseio.com" 
    });
    
    db = admin.database(); // Cambiado a .database() para Realtime
    console.log("🔥 [Firebase]: Realtime Database conectada.");
} catch (error) {
    console.error("❌ Error en conexión:", error.message);
}

// MANTENIMIENTO
app.get('/api/mantenimiento', (req, res) => {
    db.ref('Solicitudes').once('value', (snapshot) => {
        const data = snapshot.val();
        const lista = data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : [];
        res.json(lista);
    }, (error) => res.status(500).json({ error: error.message }));
});

// COMENTARIOS
app.get('/api/comentarios', (req, res) => {
    db.ref('Comentarios').once('value', (snapshot) => {
        const data = snapshot.val();
        const lista = data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : [];
        res.json(lista);
    }, (error) => res.status(500).json({ error: error.message }));
});

// CONTACTO
app.get('/api/contacto', (req, res) => {
    db.ref('MensajesContacto').once('value', (snapshot) => {
        const data = snapshot.val();
        const lista = data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : [];
        res.json(lista);
    }, (error) => res.status(500).json({ error: error.message }));
});

app.listen(port, () => {
    console.log(`✅ SERVIDOR RSG OPERATIVO EN PUERTO ${port}`);
});