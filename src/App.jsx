import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
import {Toaster} from 'react-hot-toast'
import { InsumosPage} from './pages/Insumos/InsumosPage.jsx'
import { InsumoFormPage} from './pages/Insumos/InsumoFormPage.jsx'
import {TableroPage} from './pages/TableroPage'
import {ComprasPage} from './pages/Compras/ComprasPage.jsx'
import { VentasPage } from './pages/Ventas/VentasPage.jsx'
import { ProductosPage } from './pages/Productos/ProductosPage.jsx'
import { EstimacionPage } from './pages/Estimacion/EstimacionPage.jsx'
import {ProductoFormPage} from "./pages/Productos/ProductoFormPage.jsx";
import {ClientesPage} from "./pages/Clientes/ClientesPage.jsx";
import {ProveedoresPage} from "./pages/Proveedores/ProveedoresPage.jsx";
import {ProveedorFormPage} from "./pages/Proveedores/ProveedorFormPage.jsx";
import {ClienteFormPage} from "./pages/Clientes/ClienteFormPage.jsx";
import {CompraFormPage} from "./pages/Compras/CompraFormPage.jsx";
import {VentasVisualizerPage} from "./pages/Ventas/VentasVisualizerPage.jsx";
import {ComprasVisualizerPage} from "./pages/Compras/ComprasVisualizerPage.jsx";
import {UsuariosPage} from "./pages/Usuarios/UsuariosPage.jsx";
import {UsuarioFormPage} from "./pages/Usuarios/UsuariosFormPage.jsx";
import {useState} from "react";
import {Login} from "./components/Login.jsx";
import {Security} from "./components/Security.jsx";
import {DatosExtraPage} from "./pages/Estimacion/DatosExtraPage.jsx";
import {HistorialPage} from "./pages/Estimacion/HistorialPage.jsx";
import {DatosExtraFormPage} from "./pages/Estimacion/DatosExtraFormPage.jsx";
import {EstimacionVisualizerPage} from "./pages/Estimacion/EstimacionVisualizerPage.jsx";

function App() {
    const [user, setUser] = useState(localStorage.getItem("user"));
    const idRol = parseInt(localStorage.getItem('idRol'))
    const permits = {
      Admin: [1],
      Sales: [2]
    }
    return(
          <BrowserRouter>
              {
                  !user>0?
                      <Login setUser={setUser}/>
                      :
                      <div>
                        <Security  setUser={setUser} storageKey={"user"} storageRol={"idRol"}/>
                        <Routes>
                              {/*DEFAULT*/}
                              {<Route path="/" element={<Navigate to="/insumos"/>}/>}

                              {/*TABLERO*/}
                              {<Route path="/tablero" element={<TableroPage setUser={setUser}/>}/>}

                              {/*COMPRAS*/}
                              {<Route path="/compras" element={<ComprasPage setUser={setUser}/>}/>}
                              {<Route path="/compra-create" element={<CompraFormPage setUser={setUser}/>}/>}
                              {<Route path="/compra/:id" element={<ComprasVisualizerPage setUser={setUser}/>}/>}

                              {/*PROVEEDORES*/}
                              {<Route path="/proveedores" element={<ProveedoresPage setUser={setUser}/>}/>}
                              {<Route path="/proveedor-create" element={<ProveedorFormPage setUser={setUser}/>}/>}
                              {<Route path="/proveedor/:id" element={<ProveedorFormPage setUser={setUser}/>}/>}

                              {/*VENTAS*/}
                              {permits.Admin.includes(idRol) && <Route path="/ventas" element={<VentasPage setUser={setUser}/>}/>}
                              {permits.Admin.includes(idRol) && <Route path="/venta/:id" element={<VentasVisualizerPage setUser={setUser}/>}/>}

                              {/*CLIENTES*/}
                              {permits.Admin.includes(idRol) && <Route path="/clientes" element={<ClientesPage setUser={setUser}/>}/>}
                              {permits.Admin.includes(idRol) && <Route path="/cliente-create" element={<ClienteFormPage setUser={setUser}/>}/>}
                              {permits.Admin.includes(idRol) && <Route path="/cliente/:id" element={<ClienteFormPage setUser={setUser}/>}/>}

                              {/*PRODUCTOS*/}
                              {permits.Admin.includes(idRol) &&<Route path="/productos" element={<ProductosPage setUser={setUser}/>}/>}
                              {permits.Admin.includes(idRol) &&<Route path="/producto-create" element={<ProductoFormPage setUser={setUser}/>}/>}
                              {permits.Admin.includes(idRol) &&<Route path="/producto/:id" element={<ProductoFormPage setUser={setUser}/>}/>}

                              {/*INSUMOS*/}
                              {<Route path="/insumos" element={<InsumosPage setUser={setUser}/>}/>}
                              {<Route path="/insumo-create" element={<InsumoFormPage setUser={setUser}/>}/>}
                              {<Route path="/insumo/:id" element={<InsumoFormPage setUser={setUser}/>}/>}

                              {/*USUARIOS*/}
                              {permits.Admin.includes(idRol) && <Route path="/usuarios" element={<UsuariosPage setUser={setUser}/>}/>}
                              {permits.Admin.includes(idRol) && <Route path="/usuario-create" element={<UsuarioFormPage setUser={setUser}/>}/>}
                              {permits.Admin.includes(idRol) && <Route path="/usuario/:id" element={<UsuarioFormPage setUser={setUser}/>}/>}

                              {/*ESTIMACION*/}
                              {permits.Admin.includes(idRol) && <Route path="/estimacion" element={<EstimacionPage setUser={setUser}/>}/>}
                              {permits.Admin.includes(idRol) && <Route path="/estimacion/datos" element={<DatosExtraPage setUser={setUser}/>}/>}
                              {permits.Admin.includes(idRol) && <Route path="/estimacion/datos-create" element={<DatosExtraFormPage  setUser={setUser}/>}/>}
                              {permits.Admin.includes(idRol) && <Route path="/estimacion/datos/:id" element={<DatosExtraFormPage  setUser={setUser}/>}/>}
                              {permits.Admin.includes(idRol) && <Route path="/estimacion/historial" element={<HistorialPage  setUser={setUser}/>}/>}
                              {permits.Admin.includes(idRol) && <Route path="/estimacion/:fechahora" element={<EstimacionVisualizerPage  setUser={setUser}/>}/>}

                              <Route
                                  path="*"
                                  element={<Navigate to="/" replace={true} />}
                              />
                          </Routes>
                          <Toaster/>
                      </div>
              }
          </BrowserRouter>

      )
}

export default App
