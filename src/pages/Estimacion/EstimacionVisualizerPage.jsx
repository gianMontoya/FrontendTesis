import {useParams} from "react-router-dom";
import {Sidebar} from "../../components/Sidebar.jsx";
import {useEffect, useState} from "react";
import {getEjecucionesFecha, getInfoExtra, getResultados} from "../../api/EstimacionAPI.api.ks.js";
import {getAllProductos} from "../../api/ProductosAPI.api.js";

export function EstimacionVisualizerPage({setUser}){
  const params = useParams();
  const [productos, setProductos] = useState([])
  const [ejecucion, setEjecucion] = useState(null)
  const [ejecuciones, setEjecuciones] = useState([])
  const [productoSelected, setProductoSelected] = useState(null)
  const [infoExtra, setInfoExtra] = useState([])

  useEffect(() => {
    async function loadTasks() {
      return await getEjecucionesFecha(params.fechahora);
    }
    async function loadResultados(idEjecucion) {
      return await getResultados(idEjecucion);
    }

    async function loadProductos(){
      return await getAllProductos();
    }

    const fetchData = async () => {
      const datos = await loadTasks();
      let ejecucionesList = []
      for (let i=0; i<datos.length; i++){
        const resultados = await loadResultados(datos[i].id);
        let ejecucionObj = {...datos[i],
          idProducto: resultados[0].fidProducto,
        }
        ejecucionesList.push(ejecucionObj)
      }
      await setEjecuciones(ejecucionesList)

      const data = await loadProductos();
      await setProductos(data);
    }

    fetchData()

  }, []);

  useEffect( ()=>{
    async function loadTasks(id) {
      return await getInfoExtra(id);
    }

    let flag = 0
    if (ejecuciones.length > 0 && productos.length > 0) {
      for (let i in productos){
        for(let j in ejecuciones){
          if (ejecuciones[j].idProducto === productos[i].id){
            setEjecucion(ejecuciones[j])
            loadTasks(ejecuciones[j].id).then(data => {
              setInfoExtra(data);
            });
            flag = 1
            break
          }
        }
        if (flag===1) break
      }
    }

  }, [ejecuciones, productos])

  const handleSelectedProducto = (e) => {

    async function loadTasks(id) {
      return await getInfoExtra(id);
    }

    const selectedId = e.target.value;
    setProductoSelected(selectedId);
    for(let j in ejecuciones){
      if (ejecuciones[j].idProducto === parseInt(selectedId)){
        setEjecucion(ejecuciones[j])
        loadTasks(ejecuciones[j].id).then(data => {
          setInfoExtra(data);
        });
        break
      }
    }
  };

  return(
      <div className="flex">
        <Sidebar setUser={setUser}/>
        <div className="w-4/6 mx-auto">
          <div className="mt-10 mb-10 font-extrabold text-3xl">
            Información Estimación
          </div>
          <form id="form-venta">

            <label className="block text-zinc-500 mt-0">Producto
              <select
                  className="bg-zinc-100 text-sm p-2 w-2/6 border border-stone-500 block rounded-lg placeholder:italic placeholder:text-zinc"
                  onChange={handleSelectedProducto}
              >
                {productos.map((item, index) => (
                    <option key={index} value={item.id} selected={item.id === productoSelected}>
                      {item.nombreProducto}
                    </option>
                ))}
              </select>
            </label>

            <label className="block text-zinc-500 mt-4">Fecha Estimación
              <input
                  id="input-date"
                  className="bg-zinc-100 text-sm p-2 w-2/6 border border-stone-500 block rounded-lg mt-3 placeholder:italic placeholder:text-zinc"
                  defaultValue={ejecucion?.fechaEjecucion.split('T')[0]}
                  disabled
                  type="text"/>
            </label>

            <label className="block text-zinc-500 mt-4">Ajuste del Modelo
              <input
                  className="bg-zinc-100 text-sm p-2 w-2/6 border border-stone-500 block rounded-lg mt-3 placeholder:italic placeholder:text-zinc"
                  type="number"
                  defaultValue={ejecucion?.ajusteModelo}
                  disabled
              />
            </label>

            <label className="block text-zinc-500 mt-4">Error Promedio (Kg)
              <input
                  className="bg-zinc-100 text-sm p-2 w-2/6 border border-stone-500 block rounded-lg mt-3 placeholder:italic placeholder:text-zinc"
                  type="number"
                  defaultValue={ejecucion?.errorPromedio}
                  disabled
              />
            </label>

            <label className="block text-zinc-500 mt-4">RMSE (Kg)
              <input
                  className="bg-zinc-100 text-sm p-2 w-2/6 border border-stone-500 block rounded-lg mt-3 placeholder:italic placeholder:text-zinc"
                  type="number"
                  defaultValue={ejecucion?.rmse}
                  disabled
              />
            </label>

            <div className="flex w-full">
              <div className="w-full mt-1 h-[250px] overflow-y-auto">
                <table className="w-full" id="table-linea-venta">
                  <thead className="bg-grat-50 border-b-2 border-gray-200">
                  <tr>
                    <th className='p-2 text-l font-semibold tracking-wide text-left'>Informacion Extra</th>
                  </tr>
                  </thead>
                  <tbody className="h-1.5">
                    <>
                      {infoExtra?.map((item, index) => (
                        <tr key={index} className="bg-zinc-100 p-2  rounded-lg odd:bg-white even:bg-slate-50">
                          <td className='p-2 text-gray-700 w-auto'>
                            <span>
                              {item.cabeceraInformacion}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </>
                  </tbody>
                </table>
              </div>
            </div>


          </form>
        </div>

      </div>

  )
}