import React from 'react';
import { Container, View, Heading } from 'native-base';
import { StyleSheet } from 'react-native';
import globalStyles from '../styles/global';
import EmailLogin from '../auth/EmailLogin';

const Login = () => {
    return (
        <Container style={[globalStyles.contenedor, styles.contenedor]}>
            <Heading style={[globalStyles.titulo, styles.titulo]}>Iniciar Sesión
            </Heading>
            <View style={styles.view}>
                <View style={styles.contenido}>
                    <View>
                        <EmailLogin />
                    </View>
                </View>
            </View>
        </Container>
    );
};

const styles = StyleSheet.create({
    contenedor: {
        backgroundColor: '#1F2937',
        flex: 1,
        padding: 0,
        width: '100%',
        alignItems: 'center',
    },
    contenido: {
        backgroundColor: '#FFF',
        padding: 7,
        alignItems: 'center',
        borderRadius: 7,
    },
    view: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
    },
    titulo: {
        color: '#fff',
        fontWeight: 'bold',
        marginTop: 50,
    },
});

export default Login;
