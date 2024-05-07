require('dotenv').config();

const express = require('express');
const admin = require('firebase-admin');
const path = require('path');
const cors = require('cors');

// Carga las credenciales de la cuenta de servicio desde las variables de entorno
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

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const app = express();

app.use(express.json());

app.use(cors());

app.use('/favicon.ico', express.static(path.join(__dirname, 'public', 'favicon.ico')));

app.post('/createUser', (req, res) => {
  const { password, ...userInfoWithoutPassword } = req.body;
  admin.auth().createUser({
    email: req.body.email,
    password: password
  })
    .then((userRecord) => {
      // Aquí puedes crear el documento del usuario en Firebase
      return admin.firestore().collection('usuarios').doc(userRecord.uid).set(userInfoWithoutPassword);
    })
    .then(() => {
      res.status(200).send('Usuario creado con éxito');
    })
    .catch((error) => {
      res.status(500).send(error.message);
    });
});

app.delete('/deleteUser', async (req, res) => {
  const { uid } = req.body;

  try {
    await admin.auth().deleteUser(uid);
    res.status(200).send({ message: 'Usuario eliminado exitosamente' });
  } catch (error) {
    res.status(500).send({ message: 'Error al eliminar desde el servidor: ', error });
  }
});

app.get('/', (req, res) => {
  res.send('Servidor funcionando correctamente');
});

app.listen(3001, () => {
  console.log('Servidor corriendo en http://localhost:3001');
});
