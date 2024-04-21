import { Routes, Route } from "react-router";

import Ordenes from "./components/paginas/Ordenes";

/* Si por supuesto seguirá siendo lo mismo, 
Hay algunas cositas que cambiaran por ejemplo 
los archivos en vite debe ser nombrados al final 
con  .jsx y no solamente .js asi mismo las 
variables de entorno seria VITE_NOMBRE_VARIABLE 
por ultimo tus Providers y Ruta de tus paginas los 
colocaras en el App.jsx De alli todo es igual. */

function App() {
  return(
    <div>
      <Routes>
        <Route path="/" element={<Ordenes/>} />
      </Routes>  
    </div>
  )
}


export default App;
