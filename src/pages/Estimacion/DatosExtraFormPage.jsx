import { Sidebar } from '../../components/Sidebar.jsx'
import { useForm} from "react-hook-form"
import { useNavigate, useParams} from "react-router-dom"
import {useEffect, useState} from "react";
import { toast} from 'react-hot-toast'
import XLSX from "xlsx";
import {
  createOrUpdateDatosGeneral,
  createOrUpdateInformacion, deleteAllDatosGeneral,
  getDatosGeneralByInformacion,
  getInformacion
} from "../../api/DatosAPI.api.js";

// eslint-disable-next-line react/prop-types
export function DatosExtraFormPage({setUser}) {
  const navigate = useNavigate()
  const params = useParams()
  const {register, handleSubmit, formState: {errors}, setValue} = useForm()
  const [active, setActive] = useState(false)
  const [exclusivo, setExclusivo] = useState(false)
  const [jsonData, setJsonData] = useState([])
  const [threefirstRows, setThreeFirstRows] = useState([])

  var monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Setiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  const onSubmit = handleSubmit(async data => {
    data = {...data, activo:active, exclusivaProducto: exclusivo}

    if (params.id) {
      createOrUpdateInformacion(params.id, data)
      if(jsonData.length!==0){
        await deleteAllDatosGeneral(params.id)
        await importarDatos(params.id)
      }
      toast.success('Dato Extra actualizado correctamente', {
        position: "top-right",
        style: {
          background: "#101010",
          color: "#fff"
        }
      })
    } else {
      const informacion = await createOrUpdateInformacion(0, data)
      console.log(informacion.data.id)
      await importarDatos(informacion.data.id)
      toast.success('Dato Extra creado correctamente', {
        position: "top-right",
        style: {
          background: "#101010",
          color: "#fff"
        }
      })
    }

    navigate("/estimacion/datos")
  })

  const  handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = async (e) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: 'binary',cellDates: true });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet,
          {
            header: "A",
            defval: "", // Asegura que valores vacíos se manejen con consistencia
            raw: true,
            dateNF: 'YYYY-MM-DD'
          });
      jsonData.shift()
      await setJsonData(jsonData)
      let rows = []
      for(let i=0; i<3; i++){
        let value = {
          month: jsonData[i].A.toLocaleDateString("es-PE", {month: 'long'}),
          year: jsonData[i].A.getFullYear(),
          valor: jsonData[i].B
        }
        rows.push(value)
      }
      await setThreeFirstRows(rows)
    };

    reader.readAsBinaryString(file);
  }

  const importarDatos = async (id)=>{
    for (let i = 0; i < jsonData.length; i++) {
      let value = {
        idInformacion: parseInt(id),
        month: jsonData[i].A.getMonth()+1,
        year: jsonData[i].A.getFullYear(),
        valor: + jsonData[i].B.toFixed(2)
      }
      await createOrUpdateDatosGeneral(0, value)
    }
  }

  useEffect(() => {
    async function loadInformacion() {
      if (params.id) {
        const {data} = await getInformacion(params.id);
        setValue('cabeceraInformacionExtra', data.cabeceraInformacionExtra)
        setActive(data.activo)
        setExclusivo(data.exclusivaProducto)
        const datos = await getDatosGeneralByInformacion(data.id);
        let rows = []
        for(let i=0; i<3; i++){
          let value = {
            month: monthNames[datos.data[i].month-1],
            year: datos.data[i].year,
            valor: datos.data[i].valor
          }
          rows.push(value)
        }
        setThreeFirstRows(rows)
      }
    }

    loadInformacion();
    //eslint-disable-next-line
  },[]);

  return (
      <div className="flex">
        <Sidebar setUser={setUser}/>
        <div className="w-4/6 mx-auto">
          <div className="mt-10 mb-10 font-extrabold text-3xl">
            {(params.id?"Editar ":"Agregar ") + "Dato extra"}
          </div>
          <form onSubmit={onSubmit}>

            <label className="block text-zinc-500 mt-5">Nombre
              <input
                  className="bg-zinc-100 text-sm p-2 w-2/6 border border-stone-500 block rounded-lg mt-3 placeholder:italic placeholder:text-zinc"
                  type="text"
                  placeholder="Nombre" {...register("cabeceraInformacionExtra", {required: true})}/> {errors.nombreDato &&
                  <span className="text-red-500 text-xs">*Obligatorio</span>}
            </label>

            <label className="block items-center cursor-pointer mt-4 text-zinc-500"> Exclusivo de cada Producto
              <input type="checkbox" checked={exclusivo} className="sr-only peer"
                     onChange={(event) => setExclusivo(event.target.checked)}/>
              <div
                  className="mt-4 relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>

            <label className="block items-center cursor-pointer mt-4 text-zinc-500"> Activo
              <input type="checkbox" checked={active} className="sr-only peer"
                     onChange={(event) => setActive(event.target.checked)}/>
              <div
                  className="mt-4 relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>

            <label className="block items-center cursor-pointer mt-4 text-zinc-500">
              Archivo con datos
              <input className="bg-zinc-100 text-sm p-2 w-2/6 border border-stone-500 block rounded-lg mt-3 placeholder:italic placeholder:text-zinc"
                     type="file"
                     onChange={handleFileUpload}/>
            </label>


            <label className="block text-zinc-500 mt-4">
              Tres primeros valores
            </label>

            <div className="flex w-full">
              <div className="w-full mt-1 h-[250px] overflow-y-auto">
                <table className="w-3/6" id="table-linea-compra">
                  <thead className="bg-grat-50 border-b-2 border-gray-200">
                  <tr>
                    <th className='p-2 text-l font-semibold tracking-wide text-left'>Año</th>
                    <th className='p-2 text-l font-semibold tracking-wide text-left'>Mes</th>
                    <th className='p-2 text-l font-semibold tracking-wide text-left'>Valor</th>
                  </tr>
                  </thead>
                  <tbody className="h-1.5">
                  {
                    threefirstRows.length > 0 ? (
                      threefirstRows.map((row, index) =>(
                        <tr key={index} className="bg-zinc-100 p-3  rounded-lg odd:bg-white even:bg-slate-50">
                          <td className='p-3 text-gray-700'>{row.year}</td>
                          <td className='p-3 text-gray-700'>{row.month}</td>
                          <td className='p-3 text-gray-700'>{row.valor}</td>
                        </tr>
                      ))) :
                        (<tr>
                          <td>Aún no existen valores para esta tabla.</td>
                        </tr>)
                  }
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-center">
              <button className="bg-dark-purple p-3 w-1/6 rounded-lg block mt-3 text-white">Guardar</button>
            </div>
          </form>

        </div>

      </div>
  )
}