import { useState } from "react";
import {NavLink} from 'react-router-dom'
import { useNavigate} from "react-router-dom"
export function Sidebar() {

  const [open, setOpen] = useState(true);
  const navigate = useNavigate()

  const Menus = [
    { title: "Tablero Informativo", src: "tablero", gap: true, link:"/tablero"},
    { gap: true},
    { title: "Insumos", src: "insumo", gap: true, link:"/insumos"},
    { title: "Proveedores", src: "proveedor", gap: false, link:"/proveedores"},
    { title: "Compras", src: "compra", gap: false, link:"/compras"},
    { title: "Productos", src: "producto", gap: false, link:"/productos"},
    { title: "Clientes", src: "cliente", gap: false, link:"/clientes"},
    { title: "Ventas", src: "venta", gap: false, link:"/ventas"},
    { gap: true},
    { title: "Estimación", src: "estimacion", gap: true, link:"/estimacion"},
    { gap: true},
    { title: "Usuarios", src: "usuario", gap: true, link:"/usuarios"},
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
                if (Menu.title == null) {
                  return (
                      <div key = {index} className = {`flex mt-0.5`}></div>
                  )
                }else{
                  return(
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

              }
            )}
        </ul>

        <button
            className={`${!open && "hidden"} w-full bg-red-500 text-white rounded-md p-1 relative top-9`}
            onClick={() => {
            }}
          >
            Cerrar Sesión
        </button>



      </div>

  );
}