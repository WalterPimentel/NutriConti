/* eslint-disable prettier/prettier */
import { StyleSheet, Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

const globalStyles = StyleSheet.create({
  contenedor: {
    flex: 1,
    maxWidth: screenWidth,
    width: screenWidth,
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
    marginTop: 30,
    marginBottom: 20,
    fontSize: 30,
  },
  imagen: {
    height: 300,
    width: screenWidth - (screenWidth * 0.13),
  },
  cantidad:{
    marginVertical: 20,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 'bold',
  },
  anchoPantalla:{
    minWidth: screenWidth,
    maxWidth: screenWidth,
    width: screenWidth,
  },
  botonDanger:{
    backgroundColor: '#D64947',
  },
});

export default globalStyles;
