import React, { useEffect } from 'react';
import { Button } from 'native-base';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import firebase from '../firebase';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';

function GoogleLogin() {    

    useEffect(() => {
        GoogleSignin.configure({            
            webClientId: firebase.firebaseConfig.clientId,
        });
    }, []);

    const handleLogin = async () => {
        try {
            await GoogleSignin.hasPlayServices();
            const { idToken } = await GoogleSignin.signIn();            
            const credential = GoogleAuthProvider.credential(idToken);
            const userCredential = await signInWithCredential(firebase.auth(), credential);
            const user = userCredential.user;

        } catch (error) {
            console.error('Error en GoogleLogin: ', error.message, error.code);
        }
    };

    return <Button onPress={handleLogin}>Login with Google</Button>;
}

export default GoogleLogin;