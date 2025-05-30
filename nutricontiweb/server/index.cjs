require('dotenv').config();

const serviceAccount = {
  "type": process.env.FIREBASE_TYPE,
  "project_id": process.env.FIREBASE_PROJECT_ID,
  "private_key_id": process.env.FIREBASE_PRIVATE_KEY_ID,
  "private_key": process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  "client_email": process.env.FIREBASE_CLIENT_EMAIL,
  "client_id": process.env.FIREBASE_CLIENT_ID,
  "auth_uri": process.env.FIREBASE_AUTH_URI,
  "token_uri": process.env.FIREBASE_TOKEN_URI,
  "auth_provider_x509_cert_url": process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
  "client_x509_cert_url": process.env.FIREBASE_CLIENT_X509_CERT_URL
};

const express = require('express');
const admin = require('firebase-admin');
const path = require('path');
const cors = require('cors');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const app = express();

app.use(express.json());

app.use(cors());

app.use('/favicon.ico', express.static(path.join(__dirname, 'public', 'favicon.ico')));

app.post('/createUser', async (req, res) => {
  const { email, password, ...userInfoWithoutPassword } = req.body;
  try {
    let uid;
    try {
      const userRecord = await admin.auth().getUserByEmail(email);
      uid = userRecord.uid;
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        const userRecord = await admin.auth().createUser({ email, password });
        uid = userRecord.uid;
      } else {
        throw error;
      }
    }
    await admin.firestore().collection('usuarios').doc(uid).set({ email, ...userInfoWithoutPassword });
    res.status(200).send('Usuario creado con éxito');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.delete('/deleteUser', async (req, res) => {
  const { uid } = req.body;

  try {
    await admin.firestore().collection('usuarios').doc(uid).delete();
    res.status(200).send({ message: 'Usuario eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar el usuario: ', error);
    res.status(500).send({ message: 'Error al eliminar desde el servidor: ', error });
  }
});

app.get('/checkDni/:dni', async (req, res) => {
  const { dni } = req.params;
  try {
    const snapshot = await admin.firestore().collection('usuarios').where('dni', '==', dni).get();
    if (!snapshot.empty) {
      res.json({ exists: true });
    } else {
      res.json({ exists: false });
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.get('/checkUser/:email', async (req, res) => {
  const { email } = req.params;
  try {
    const snapshot = await admin.firestore().collection('usuarios').where('email', '==', email).get();
    if (!snapshot.empty) {
      res.json({ exists: true });
    } else {
      res.json({ exists: false });
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.get('/', (req, res) => {
  res.send('Servidor funcionando correctamente en http://localhost:3001');
});

app.listen(3001, () => {
  console.log('Servidor corriendo en http://localhost:3001');
});
