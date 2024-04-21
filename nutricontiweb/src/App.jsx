import { Routes, Route } from "react-router";

import Ordenes from "./components/paginas/Ordenes";
import Menu from "./components/paginas/Menu";
import NuevoPlatillo from "./components/paginas/NuevoPlatillo";
import Sidebar from "./components/ui/Sidebar";

/* Si por supuesto seguirá siendo lo mismo, Hay algunas cositas que cambiaran por ejemplo 
los archivos en vite debe ser nombrados al final con  .jsx y no solamente .js asi mismo las 
variables de entorno seria VITE_NOMBRE_VARIABLE por ultimo tus Providers y Ruta de tus paginas los 
colocaras en el App.jsx De alli todo es igual. */

function App() {
  return (
    <div className=" md:flex min-h-screen">
      <Sidebar />
      <div className="md:w-3/5 xl:w-4/5 p-6">
        <Routes>
          <Route path="/" element={<Ordenes />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/nuevo-platillo" element={<NuevoPlatillo />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
