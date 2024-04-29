import {Sidebar} from "../../components/Sidebar.jsx";
import {useNavigate, useParams} from "react-router-dom";
import {useForm} from "react-hook-form";
import {useEffect, useState} from "react";
import {toast} from "react-hot-toast";
import {createOrUpdateCliente, getCliente} from "../../api/ClientesAPI.api.js";

export function ClienteFormPage() {

  const navigate = useNavigate()
  const params = useParams()
  const {register, handleSubmit, formState:{errors}, setValue} = useForm()
  const [active, setActive] = useState(false)

  const onSubmit = handleSubmit(async data=>{
    data = {...data, activo:active}
    if(params.id){
      await createOrUpdateCliente(params.id, data)
      toast.success('Cliente actualizado correctamente',{
        position: "top-right",
        style: {
          background:"#101010",
          color: "#fff"
        }
      })
    }else{
      await createOrUpdateCliente(0,data)
      toast.success('Cliente creado correctamente',{
        position: "top-right",
        style: {
          background:"#101010",
          color: "#fff"
        }
      })
    }
    navigate("/clientes")
  })

  useEffect(() => {
    async function loadCliente() {
      if (params.id) {
        const {data} = await getCliente(params.id);
        setValue('nombreCliente', data.nombreCliente)
        setValue('nombreContacto', data.nombreContacto)
        setValue('correoContacto', data.correoContacto)
        setValue('numeroContacto', data.numeroContacto)
        setValue('ruc', data.ruc)
        setActive(data.activo)
      }
    }

    loadCliente();
    //eslint-disable-next-line
  }, []);

  return (
      <div className="flex">
        <Sidebar/>
        <div className="w-4/6 mx-auto">
          <div className="mt-10 mb-10 font-extrabold text-3xl">
            {(params.id?"Editar ":"Crear ") + "Cliente"}
          </div>
          <form onSubmit={onSubmit}>
            <div className="grid grid-cols-2">

              <label className="block text-zinc-500 mt-5">Nombre Cliente
                <input
                    className="bg-zinc-100 text-sm p-2 w-4/6 border border-stone-500 block rounded-lg mt-3 placeholder:italic placeholder:text-zinc"
                    type="text"
                    placeholder="Nombre" {...register("nombreCliente", {required: true})}/> {errors.nombreCliente &&
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

              <label className="block items-center cursor-pointer mt-4 text-zinc-500"> Activo
                <input type="checkbox" checked={active} className="sr-only peer"
                       onChange={(event) => setActive(event.target.checked)}/>
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