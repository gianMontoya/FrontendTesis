import {Sidebar} from "../../components/Sidebar.jsx";
import {useNavigate, useParams} from "react-router-dom";
import {useForm} from "react-hook-form";
import {useEffect, useState} from "react";
import {createOrUpdateProveedor, getProveedor} from "../../api/ProveedoresAPI.api.js";
import {toast} from "react-hot-toast";

// eslint-disable-next-line react/prop-types
export function ProveedorFormPage({setUser}) {

  const navigate = useNavigate()
  const params = useParams()
  const {register, handleSubmit, formState:{errors}, setValue} = useForm()
  const [active, setActive] = useState(false)

  const onSubmit = handleSubmit(async data=>{
    data = {...data, activo:active}
    if(params.id){
      await createOrUpdateProveedor(params.id, data)
      toast.success('Proveedor actualizado correctamente',{
        position: "top-right",
        style: {
          background:"#101010",
          color: "#fff"
        }
      })
    }else{
      await createOrUpdateProveedor(0,data)
      toast.success('Proveedor creado correctamente',{
        position: "top-right",
        style: {
          background:"#101010",
          color: "#fff"
        }
      })
    }
    navigate("/proveedores")
  })

  useEffect(() => {
    async function loadProveedor() {
      if (params.id) {
        const {data} = await getProveedor(params.id);
        setValue('nombreProveedor', data.nombreProveedor)
        setValue('nombreContacto', data.nombreContacto)
        setValue('correoContacto', data.correoContacto)
        setValue('numeroContacto', data.numeroContacto)
        setValue('ruc', data.ruc)
        setActive(data.activo)
      }
    }
    loadProveedor();
    // eslint-disable-next-line
  },[]);

  return (
      <div className="flex">
        <Sidebar setUser={setUser}/>
        <div className="w-4/6 mx-auto">
          <div className="mt-10 mb-10 font-extrabold text-3xl">
            {(params.id?"Editar ":"Crear ") + "Proveedor"}
          </div>
          <form onSubmit={onSubmit}>
            <div className="grid grid-cols-2">

              <label className="block text-zinc-500 mt-5">Nombre Proveedor
                <input
                    className="bg-zinc-100 text-sm p-2 w-4/6 border border-stone-500 block rounded-lg mt-3 placeholder:italic placeholder:text-zinc"
                    type="text"
                    placeholder="Nombre" {...register("nombreProveedor", {required: true})}/> {errors.nombreProveedor &&
                    <span className="text-red-500 text-xs">*Obligatorio</span>}
              </label>

              <label className="block text-zinc-500 mt-5"> RUC
                <input
                    className="bg-zinc-100 text-sm p-2 w-2/6 border border-stone-500 block rounded-lg mt-3 placeholder:italic placeholder:text-zinc"
                    type="text"
                    placeholder="RUC" {...register("ruc", {required: true})}/> {errors.RUC &&
                    <span className="text-red-500 text-xs">*Obligatorio</span>}
              </label>

              <label className="block text-zinc-500 mt-5">Nombre Contacto
                <input
                    className="bg-zinc-100 text-sm p-2 w-4/6 border border-stone-500 block rounded-lg mt-3 placeholder:italic placeholder:text-zinc"
                    type="text"
                    placeholder="Contacto" {...register("nombreContacto", {required: true})}/> {errors.nombreContacto &&
                    <span className="text-red-500 text-xs">*Obligatorio</span>}
              </label>

              <label className="block text-zinc-500 mt-5">Correo Contacto
                <input
                    className="bg-zinc-100 text-sm p-2 w-4/6 border border-stone-500 block rounded-lg mt-3 placeholder:italic placeholder:text-zinc"
                    type="email"
                    placeholder="Correo" {...register("correoContacto", {required: true})}/> {errors.correoContacto &&
                    <span className="text-red-500 text-xs">*Obligatorio</span>}
              </label>

              <label className="block text-zinc-500 mt-5">Celular Contacto
                <input
                    className="bg-zinc-100 text-sm p-2 w-2/6 border border-stone-500 block rounded-lg mt-3 placeholder:italic placeholder:text-zinc"
                    type="text"
                    placeholder="Numero" {...register("numeroContacto", {required: true})}/> {errors.numeroContacto &&
                    <span className="text-red-500 text-xs">*Obligatorio</span>}
              </label>

              <label className="block items-center cursor-pointer mt-4 text-zinc-500">
                <span className="text-zinc-500 dark:text-zinc-500">Activo</span>
                <input type="checkbox" checked={active} className="sr-only peer"
                       onChange={(event) => {setActive(event.target.checked)}}/>
                <div className="mt-4 relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex justify-center mt-8">
              <button className="bg-dark-purple p-3 w-1/6 rounded-lg block text-white">Guardar</button>
            </div>
          </form>
        </div>

      </div>
  )
}