import { useState } from "react";
import {NavLink} from 'react-router-dom'
import { useNavigate} from "react-router-dom"

// eslint-disable-next-line react/prop-types
export function Sidebar({setUser}) {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate()
  const idRol = parseInt(localStorage.getItem('idRol'))
  const handleLogout =()=>{
    setUser("")
    localStorage.setItem("user", "")
    localStorage.setItem('idRol', "");
    navigate("/")
  }

  const Menus = [
    { title: "Tablero Informativo", src: "tablero", gap: true, link:"/tablero", rol:[1,2]},
    { title: "Insumos", src: "insumo", gap: true, link:"/insumos", rol:[1]},
    { title: "Proveedores", src: "proveedor", gap: false, link:"/proveedores", rol:[1]},
    { title: "Compras", src: "compra", gap: false, link:"/compras", rol:[1]},
    { title: "Productos", src: "producto", gap: true, link:"/productos", rol:[1,2]},
    { title: "Clientes", src: "cliente", gap: false, link:"/clientes", rol:[1,2]},
    { title: "Ventas", src: "venta", gap: false, link:"/ventas", rol:[1,2]},
    { title: "Estimación", src: "estimacion", gap: true, link:"/estimacion", rol:[1]},
    { title: "Usuarios", src: "usuario", gap: true, link:"/usuarios", rol:[1]},
  ];
  
  return (
      <div
        className={` ${
          open ? "w-60" : "w-20"
        } bg-dark-purple vh-100 p-4 pt-8 relative duration-300 h-screen`}
      >
        <img
          src="/src/assets/control.png"
          className={`absolute cursor-pointer -right-3 top-9 w-7 border-dark-purple
           border-2 rounded-full  ${!open && "rotate-180"}`}
          onClick={() => setOpen(!open)}
          alt="/src/assets/control.png"
        />
        <div className="flex gap-x-4 items-center cursor-pointer " onClick={() => {
            navigate("/tablero")}}>
          <img
            src="/src/assets/logo.png"
            className={`duration-500 ${
              open && "rotate-[360deg]"
            }`}
            alt="/src/assets/logo.png"
          />
          <div className="w-full">
            <h1
                className={`text-white text-center font-medium text-3xl duration-200 ${
                    !open && "scale-0"
                }`}
            >
              Empresa
            </h1>
          </div>

        </div>
        <ul className="pt-6">
          {Menus.map((Menu, index) => {
                return(
                    Menu.rol.includes(idRol) &&
                  <NavLink
                      key = {index}
                      to = {Menu.link}
                      className = {`flex rounded-md p-2 cursor-pointer hover:bg-light-white text-gray-300 text-sm items-center gap-x-4 ${Menu.gap ? "mt-8" : "mt-1"}`}
                  >
                      <img src={`/src/assets/${Menu.src}.png`} alt={`/src/assets/${Menu.src}.png`}/>
                      <span className={`${!open && "hidden"} origin-left duration-200 font-bold`}>
                          {Menu.title}
                      </span>
                  </NavLink>
                )
              }
            )}
        </ul>

        <button
            className={`${!open && "hidden"} w-full bg-red-500 text-white rounded-md p-1 relative top-9`}
            onClick={handleLogout}
          >
            Cerrar Sesión
        </button>

      </div>

  );
}