import { Sidebar } from '../../components/Sidebar.jsx'
import { useForm} from "react-hook-form"
import { useNavigate, useParams} from "react-router-dom"
import {useEffect, useState} from "react";
import { toast} from 'react-hot-toast'
import {createOrUpdateInsumo, getInsumo} from '../../api/InsumosAPI.api.js'

// eslint-disable-next-line react/prop-types
export function InsumoFormPage({setUser}) {

    const navigate = useNavigate()
    const params = useParams()
    const {register, handleSubmit, formState:{errors}, setValue} = useForm()
    const [active, setActive] = useState(false)

    const onSubmit = handleSubmit(async data=>{
        data = {...data, activo:active}
        if(params.id){
            await createOrUpdateInsumo(params.id, data)
            toast.success('Insumo actualizado correctamente',{
              position: "top-right",
              style: {
                background:"#101010",
                color: "#fff"
              }
            })
        }else{
            await createOrUpdateInsumo(0,data)
            toast.success('Insumo creado correctamente',{
              position: "top-right",
              style: {
                background:"#101010",
                color: "#fff"
              }
            })
        }
      navigate("/insumos")
    })

    useEffect(() => {
      async function loadInsumo() {
        if (params.id) {
          const {data} = await getInsumo(params.id);
          setValue('nombreInsumo', data.nombreInsumo)
          setValue('pesoPaquete', data.pesoPaquete)
          setValue('descripcion', data.descripcion)
          setActive(data.activo)
        }
      }

    loadInsumo();
    //eslint-disable-next-line
    },[]);

    return (
      <div className="flex">
        <Sidebar setUser={setUser}/>
        <div className="w-4/6 mx-auto">
          <div className="mt-10 mb-10 font-extrabold text-3xl">
            {(params.id?"Editar ":"Crear ") + "Insumo"}
          </div>
          <form onSubmit={onSubmit}>

            <label className="block text-zinc-500 mt-5">Nombre
              <input
                  className="bg-zinc-100 text-sm p-2 w-2/6 border border-stone-500 block rounded-lg mt-3 placeholder:italic placeholder:text-zinc"
                  type="text"
                  placeholder="Nombre" {...register("nombreInsumo", {required: true})}/> {errors.nombreInsumo &&
                  <span className="text-red-500 text-xs">*Obligatorio</span>}
            </label>

            <label className="block text-zinc-500 mt-5">Peso por Paquete (Kg)
              <input
                  className="bg-zinc-100 text-sm p-2 w-2/6 border border-stone-500 block rounded-lg mt-3 placeholder:italic placeholder:text-zinc"
                  type="number" placeholder="Peso"
                  step="0.01" {...register("pesoPaquete", {required: true})}/> {errors.pesoPaquete &&
                  <span className="text-red-500 text-xs">*Obligatorio</span>}
            </label>

            <label className="block text-zinc-500 mt-5">Descripción
              <textarea
                  className="bg-zinc-100 text-sm p-2 w-5/6 border border-stone-500 block rounded-lg mt-3 placeholder:italic placeholder:text-zinc"
                  rows="2"
                  placeholder="Descripción" {...register("descripcion", {required: true})}/> {errors.descripcion &&
                  <span className="text-red-500 text-xs">*Obligatorio</span>}
            </label>

            <label className="inline-flex items-center cursor-pointer mt-4">
              <span className="text-zinc-500 dark:text-zinc-500">Activo</span>
              <input type="checkbox" checked={active} className="sr-only peer ml-3"
                     onChange={(event) => setActive(event.target.checked)}/>
              <div
                  className="ml-3 relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>

            <div className="flex justify-center">
              <button className="bg-dark-purple p-3 w-1/6 rounded-lg block mt-3 text-white">Guardar</button>
            </div>
          </form>
        </div>

      </div>
    )
}