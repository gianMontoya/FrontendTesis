import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
import {Toaster} from 'react-hot-toast'
import { InsumosPage} from './pages/Insumos/InsumosPage.jsx'
import { InsumoFormPage} from './pages/Insumos/InsumoFormPage.jsx'
import {TableroPage} from './pages/TableroPage'
import {ComprasPage} from './pages/Compras/ComprasPage.jsx'
import { VentasPage } from './pages/Ventas/VentasPage.jsx'
import { ProductosPage } from './pages/Productos/ProductosPage.jsx'
import { EstimacionPage } from './pages/EstimacionPage'
import {ProductoFormPage} from "./pages/Productos/ProductoFormPage.jsx";
import {ClientesPage} from "./pages/Clientes/ClientesPage.jsx";
import {ProveedoresPage} from "./pages/Proveedores/ProveedoresPage.jsx";
import {ProveedorFormPage} from "./pages/Proveedores/ProveedorFormPage.jsx";
import {ClienteFormPage} from "./pages/Clientes/ClienteFormPage.jsx";
import {CompraFormPage} from "./pages/Compras/CompraFormPage.jsx";
import {VentasVisualizerPage} from "./pages/Ventas/VentasVisualizerPage.jsx";
import {ComprasVisualizerPage} from "./pages/Compras/ComprasVisualizerPage.jsx";

function App() {
  return(
    <BrowserRouter>
        <Routes>
            {/*DEFAULT*/}
            <Route path="/" element={<Navigate to="/tablero"/>}/>

            {/*TABLERO*/}
            <Route path="/tablero" element={<TableroPage/>}/>

            {/*COMPRAS*/}
            <Route path="/compras" element={<ComprasPage/>}/>
            <Route path="/compra-create" element={<CompraFormPage/>}/>
            <Route path="/compra/:id" element={<ComprasVisualizerPage/>}/>

            {/*PROVEEDORES*/}
            <Route path="/proveedores" element={<ProveedoresPage/>}/>
            <Route path="/proveedor-create" element={<ProveedorFormPage/>}/>
            <Route path="/proveedor/:id" element={<ProveedorFormPage/>}/>

            {/*VENTAS*/}
            <Route path="/ventas" element={<VentasPage/>}/>
            <Route path="/venta/:id" element={<VentasVisualizerPage/>}/>

            {/*CLIENTES*/}
            <Route path="/clientes" element={<ClientesPage/>}/>
            <Route path="/cliente-create" element={<ClienteFormPage/>}/>
            <Route path="/cliente/:id" element={<ClienteFormPage/>}/>

            {/*PRODUCTOS*/}
            <Route path="/productos" element={<ProductosPage/>}/>
            <Route path="/producto-create" element={<ProductoFormPage/>}/>
            <Route path="/producto/:id" element={<ProductoFormPage/>}/>

            {/*INSUMOS*/}
            <Route path="/insumos" element={<InsumosPage/>}/>
            <Route path="/insumo-create" element={<InsumoFormPage/>}/>
            <Route path="/insumo/:id" element={<InsumoFormPage/>}/>

            {/*ESTIMACION*/}
            <Route path="/estimacion" element={<EstimacionPage/>}/>


            <Route
                path="*"
                element={<Navigate to="/" replace={true} />}
            />
        </Routes>
        <Toaster/>
    </BrowserRouter>
  )
}

export default App
