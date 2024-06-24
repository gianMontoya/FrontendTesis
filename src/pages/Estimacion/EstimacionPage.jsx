import {Sidebar} from '../../components/Sidebar.jsx'
import {useEffect, useState} from "react";
import {getAllProductos} from "../../api/ProductosAPI.api.js";
import {useNavigate} from "react-router-dom";
import {getAllEjecuciones, getResultados} from "../../api/EstimacionAPI.api.ks.js";
import {getAllVentasMensualesPorProducto} from "../../api/VentasAPI.api.js";

// eslint-disable-next-line react/prop-types
export function EstimacionPage({setUser}) {
  const [productos, setProductos] = useState([])
  const [productoSelected, setProductoSelected] = useState(null)
  const [estimacion, setEstimacion] = useState([])
  const [ejecuciones, setEjecuciones] = useState([])
  const [ejecucion, setEjecucion] = useState([])
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Number of items per page
  const totalPages = Math.ceil(estimacion.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = estimacion.slice(startIndex, endIndex);
  const navigate = useNavigate()

  useEffect(() => {
    async function loadTasks() {
      return await getAllProductos();
    }

    async function loadResultados(idEjecucion) {
      return await getResultados(idEjecucion)
    }

    async function loadEjecuciones() {
      return await getAllEjecuciones();
    }

    async function loadCantidadesVentasProd(idProd){
      const value = await getAllVentasMensualesPorProducto(idProd);
      return value.slice(-12)
    }

    const fetchData = async () => {
      const data = await loadTasks();
      setProductos(data);
      const ejecucionesData = await loadEjecuciones();
      let ejecucionesList = []
      for (let i=0; i<ejecucionesData.length; i++){
        const resultados = await loadResultados(ejecucionesData[i].id);
        let ejecucionObj = {...ejecucionesData[i],
          idProducto: resultados[0].fidProducto,
        }
        ejecucionesList.push(ejecucionObj)
      }
      await setEjecuciones(ejecucionesList)
      let flag = 0

      for (let i in data){
        for(let j in ejecucionesList){
          if (ejecucionesList[j].idProducto === data[i].id){
            setEjecucion(ejecucionesList[j])
            loadResultados(ejecucionesList[j].id).then(async values => {
              const datos = await loadCantidadesVentasProd(data[i].id)
              // setVentas(datos)
              //
              // setResultados(values);
              let estimationData = []

              for (i in values) {
                let flag = 0
                for (j in datos) {
                  if (values[i].anho === datos[j].anho && values[i].mes === datos[j].mes) {
                    const obj = {
                      año: values[i].anho,
                      mes: values[i].mes,
                      estimacion: values[i].valor,
                      real: datos[j].cantidad_total_vendida
                    }
                    estimationData.push(obj)
                    flag = 1;
                    break;
                  }
                }
                if (flag === 0){
                  const obj = {
                    año: values[i].anho,
                    mes: values[i].mes,
                    estimacion: values[i].valor,
                    real: "-"
                  }
                  estimationData.push(obj)
                }
              }
              setEstimacion(estimationData)

            });
            flag = 1
            break
          }
        }
        if (flag===1) break
      }

    };

    fetchData();
  }, []);

  const handleClick = (type) => {
    if (type === 'prev') {
      setCurrentPage((prev) => (prev <= 1 ? prev : prev - 1));
    } else if (type === 'next') {
      setCurrentPage((prev) => (prev >= totalPages ? prev : prev + 1));
    }
  };

  const handleSelectedProducto = (e) =>{

    async function loadCantidadesVentasProd(idProd){
      const value = await getAllVentasMensualesPorProducto(idProd);
      return value.slice(-12)
    }

    async function loadResultados(idEjecucion) {
      return await getResultados(idEjecucion)
    }



    const selectedId = e.target.value;
    setProductoSelected(selectedId);
    for(let j in ejecuciones) {
      if (ejecuciones[j].idProducto === parseInt(selectedId)) {
        setEjecucion(ejecuciones[j])
        loadResultados(ejecuciones[j].id).then(async values => {
          const datos = await loadCantidadesVentasProd(selectedId)
          // setVentas(datos)
          //
          // setResultados(values);
          let estimationData = []

          for (let i in values) {
            let flag = 0
            for (j in datos) {
              if (values[i].anho === datos[j].anho && values[i].mes === datos[j].mes) {
                const obj = {
                  año: values[i].anho,
                  mes: values[i].mes,
                  estimacion: values[i].valor,
                  real: datos[j].cantidad_total_vendida
                }
                estimationData.push(obj)
                flag = 1;
                break;
              }
            }
            if (flag === 0){
              const obj = {
                año: values[i].anho,
                mes: values[i].mes,
                estimacion: values[i].valor,
                real: "-"
              }
              estimationData.push(obj)
            }
          }
          setEstimacion(estimationData)

        });
        break
      }
    }
  }

  return (
    <div className="flex">
      <Sidebar setUser={setUser}/>
      <div className="w-4/6 mx-auto">

        <div className="mt-10 mb-10 font-extrabold text-3xl">
          Estimación
        </div>

        <div className="flex justify-end">
          <button className="bg-dark-purple text-white p-2 rounded-lg w-1/12 ml-2"
                  onClick={
                    async () => {
                      navigate("/estimacion/historial")
                    }
                  }
          >
            Historial
          </button>
          <button className="bg-dark-purple text-white p-2 rounded-lg w-1/6 ml-2">
            Ejecutar Estimación
          </button>
          <button className="bg-dark-purple text-white p-2 rounded-lg w-1/6 ml-2"
                  onClick={
                    async () => {
                      navigate("/estimacion/datos")
                    }
                  }
          >
            Agregar Datos
          </button>
        </div>

        <div className='p-2 w-2/6'>
          <select
              className="bg-zinc-100 text-sm p-2 w-full border border-stone-500 block rounded-lg mt-1 placeholder:italic placeholder:text-zinc"
              onChange={handleSelectedProducto}
          >
            {productos.map((item, index) => (
                <option key={index} value={item.id} selected={item.id === productoSelected}>
                  {item.nombreProducto}
                </option>
            ))}
          </select>
        </div>
        <div className="min-h-[500px]">
          <div className="p-2">
            {`Fecha Ejecución: ${ejecucion?.fechaEjecucion?.split("T")[0]} - Ajuste del modelo: ${ejecucion?.ajusteModelo?.toFixed(2)} - Error Promedio - ${ejecucion?.errorPromedio?.toFixed(2)} Kg`}
          </div>
          <table className="w-full mt-4">
            <thead className="bg-grat-50 border-b-2 border-gray-200">
            <tr>
              <th className='p-3 text-l font-semibold tracking-wide text-left'>Año</th>
              <th className='p-3 text-l font-semibold tracking-wide text-left'>Mes</th>
              <th className='p-3 text-l font-semibold tracking-wide text-left'>Valor Estimado (Kg)</th>
              <th className='p-3 text-l font-semibold tracking-wide text-left'>Valor Real (Kg)</th>
            </tr>
            </thead>
            <tbody>
            {currentItems.length > 0 ? (
                    currentItems.map((estimacion, index) => (
                        <tr key={index} className="bg-zinc-100 p-3  rounded-lg odd:bg-white even:bg-slate-50">
                          <td className='p-3 text-gray-700'>{estimacion.año}</td>
                          <td className='p-3 text-gray-700'>{estimacion.mes}</td>
                          <td className='p-3 text-gray-700'>{estimacion.estimacion}</td>
                          <td className='p-3 text-gray-700 font-bold'>{estimacion.real}</td>
                        </tr>
                    )))
                : (<tr>
                  <td>Aún no existen valores para esta tabla.</td>
                </tr>)
            }
            </tbody>
          </table>
          <div className="mt-4 flex justify-evenly items-center">
            <button
                className={currentPage !== 1 ? "bg-blue-400 p-2 rounded-md" : "bg-gray-200 p-2 rounded-md"}
                onClick={() => handleClick('prev')}
                disabled={currentPage === 1}
            >
              {"<<"}
            </button>
            <span> Página {currentPage} de {totalPages} </span>
            <button
                className={(currentPage !== totalPages && totalPages > 1) ? "bg-blue-400 p-2 rounded-md" : "bg-gray-200 p-2 rounded-md"}
                onClick={() => handleClick('next')}
                disabled={currentPage === totalPages}
            >
              {">>"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
