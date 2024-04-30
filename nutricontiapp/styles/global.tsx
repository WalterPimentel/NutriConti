/* eslint-disable prettier/prettier */
import { StyleSheet, Dimensions } from "react-native";

const screenWidth = Dimensions.get('window').width;

const globalStyles = StyleSheet.create({
  contenedor: {
    flex: 1,
    minWidth: screenWidth,
    maxWidth: screenWidth,
  },
  contenido:{
    marginHorizontal: '2.5%',
    flex: 1,
  },
  boton: {
    backgroundColor: '#FFDA00',
  },
  botonTexto: {
    textTransform: 'uppercase',
    fontWeight: 'bold',
    color: '#000',
  },
  botonIcono: {
    textTransform: 'uppercase',
    fontWeight: 'bold',
    color: '#000',
  },
  titulo: {
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 20,
    fontSize: 30,
  },
  imagen: {
    height: 300,
    width: '100%',
  },
});

export default globalStyles;
