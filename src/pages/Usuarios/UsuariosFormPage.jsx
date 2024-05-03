import {Sidebar} from "../../components/Sidebar.jsx";
import {useNavigate, useParams} from "react-router-dom";
import {useForm} from "react-hook-form";
import {useEffect, useState} from "react";
import {toast} from "react-hot-toast";
import {createOrUpdateUsuario, getAllRoles, getUsuario} from "../../api/UsuariosAPI.api.js";

export function UsuarioFormPage() {

  const navigate = useNavigate()
  const params = useParams()
  const {register, handleSubmit, formState:{errors}, setValue} = useForm()
  const [active, setActive] = useState(false)
  const [roles, setRoles] = useState([])
  const [rolSelected, setRolSelected] = useState(0)
  const onSubmit = handleSubmit(async data=>{
    data = {...data, activo:active, idRol: rolSelected}
    if(params.id){
      await createOrUpdateUsuario(params.id, data)

      toast.success('Usuario actualizado correctamente',{
        position: "top-right",
        style: {
          background:"#101010",
          color: "#fff"
        }
      })
    }else{
      await createOrUpdateUsuario(0,data)
      toast.success('Usuario creado correctamente',{
        position: "top-right",
        style: {
          background:"#101010",
          color: "#fff"
        }
      })
    }
    navigate("/usuarios")
  })

  useEffect( () => {
    async function loadUsuario() {
      if (params.id) {
        const {data} = await getUsuario(params.id);
        setValue('nombres', data.nombres)
        setValue('apellidoPaterno', data.apellidoPaterno)
        setValue('apellidoMaterno', data.apellidoMaterno)
        setValue('correo', data.correo)
        setValue('numeroCelular', data.numeroCelular)
        setValue('contrasena', data.contrasena)
        setActive(data.activo)
        setRolSelected(data.idRol)
      }
      let data = await getAllRoles();
      setRoles(data)
    }

    //eslint-disable-next-line
    loadUsuario();

    //eslint-disable-next-line
  }, []);

  const handleSelectedRol = (e) => {
    const selectedId = e.target.value;
    setRolSelected(selectedId);
  };

  return (
      <div className="flex">
        <Sidebar/>
        <div className="w-4/6 mx-auto">
          <div className="mt-10 mb-10 font-extrabold text-3xl">
            {(params.id?"Editar ":"Crear ") + "Usuario"}
          </div>
          <form onSubmit={onSubmit}>
            <div className="grid grid-cols-2">

              <label className="block text-zinc-500 mt-5">Nombres
                <input
                    className="bg-zinc-100 text-sm p-2 w-4/6 border border-stone-500 block rounded-lg mt-3 placeholder:italic placeholder:text-zinc"
                    type="text"
                    placeholder="Nombres" {...register("nombres", {required: true})}/> {errors.nombres &&
                    <span className="text-red-500 text-xs">*Obligatorio</span>}
              </label>

              <label className="block text-zinc-500 mt-5">Apellido Paterno
                <input
                    className="bg-zinc-100 text-sm p-2 w-4/6 border border-stone-500 block rounded-lg mt-3 placeholder:italic placeholder:text-zinc"
                    type="text"
                    placeholder="Apellido Paterno" {...register("apellidoPaterno", {required: true})}/> {errors.apellidoPaterno &&
                    <span className="text-red-500 text-xs">*Obligatorio</span>}
              </label>

              <label className="block text-zinc-500 mt-5">Apellido Materno
                <input
                    className="bg-zinc-100 text-sm p-2 w-4/6 border border-stone-500 block rounded-lg mt-3 placeholder:italic placeholder:text-zinc"
                    type="text"
                    placeholder="Apellido Materno" {...register("apellidoMaterno", {required: true})}/> {errors.apellidoMaterno &&
                    <span className="text-red-500 text-xs">*Obligatorio</span>}
              </label>

              <label className="block text-zinc-500 mt-5">Correo
                <input
                    className="bg-zinc-100 text-sm p-2 w-4/6 border border-stone-500 block rounded-lg mt-3 placeholder:italic placeholder:text-zinc"
                    type="email"
                    placeholder="Correo" {...register("correo", {required: true})}/> {errors.correo &&
                    <span className="text-red-500 text-xs">*Obligatorio</span>}
              </label>

              <label className="block text-zinc-500 mt-5">Celular
                <input
                    className="bg-zinc-100 text-sm p-2 w-2/6 border border-stone-500 block rounded-lg mt-3 placeholder:italic placeholder:text-zinc"
                    type="text"
                    placeholder="Numero" {...register("numeroCelular", {required: true})}/> {errors.numeroCelular &&
                    <span className="text-red-500 text-xs">*Obligatorio</span>}
              </label>

              <label className="block text-zinc-500 mt-6">Rol
                <select
                    className="bg-zinc-100 text-sm p-2 w-2/6 border border-stone-500 block rounded-lg placeholder:italic placeholder:text-zinc"
                    onChange={handleSelectedRol}
                >
                  {roles.map((item, index) => (
                      <option key={index} value={item.id} selected={item.id===rolSelected}>
                        {item.nombreRol}
                      </option>
                  ))}
                </select>
              </label>

              <label className="block items-center cursor-pointer mt-4 text-zinc-500"> Activo
                <input type="checkbox" checked={active} className="sr-only peer"
                       onChange={(event) => setActive(event.target.checked)}/>
                <div
                    className="mt-4 relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
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