import firebase from "../../firebase";

const Login = () => {
    const handleLogin = () => {
        const provider = new firebase.firebase.auth.GoogleAuthProvider();

        firebase.firebase.auth().signInWithPopup(provider).then(async (result) => {
            // Lista de correos electrónicos permitidos
            const snapshot = await firebase.firebase.firestore().collection('usuarios').get();
            const allowedEmails = snapshot.docs.map(doc => doc.data().correo);
            
            // Puedes acceder a la información del usuario aquí
            var user = result.user;

            if (allowedEmails.includes(user.email)) {
                console.log(user);
            } else {
                // Si el correo electrónico del usuario no está en la lista de correos electrónicos permitidos, cierra la sesión
                firebase.firebase.auth().signOut();
                alert("No tienes permiso para acceder a esta aplicación.");
            }
        }).catch((error) => {
            console.error(error);
        });
    };

    return (
        <div>
            <button onClick={handleLogin}>Iniciar sesión con Google</button>
        </div>
    );
};

export default Login;