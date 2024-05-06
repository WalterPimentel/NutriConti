import { useState } from 'react';
import firebase from "../firebase";

const EmailPasswordLogin = () => {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    firebase.auth().signInWithEmailAndPassword(correo, password)
      .then((userCredential) => {
        // Inicio de sesión exitoso
        console.log(userCredential.user);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  };

  return (
    <>
      <div className='mb-2'>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="nombre"
          >
            Correo
          </label>
          <div className="flex items-center">
            <i className="fas fa-user text-gray-800 fa-xl mr-2" />
            <input
              className="w-full shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-inset"
              id="correo"
              name="correo"
              type="email"
              placeholder='ejemplo@dominio.com'
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
            />
          </div>
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="nombre"
          >
            Contraseña
          </label>
          <div className="flex items-center">
            <i className="fas fa-lock text-gray-800 fa-xl mr-2" />
            <input
              className="w-full shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-inset"
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='&#5867; &#5867; &#5867; &#5867; &#5867; &#5867; &#5867; &#5867;'
            />
          </div>
        </div>
        <button
          className="w-full py-2 px-4 text-white bg-blue-500 hover:bg-blue-600 rounded"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? 'Cargando...' : 'Iniciar sesión'}
        </button>
      </div>


    </>
  );
};

export default EmailPasswordLogin;