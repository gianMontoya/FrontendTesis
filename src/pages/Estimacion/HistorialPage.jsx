import {Sidebar} from '../../components/Sidebar.jsx'
import {useEffect, useState} from "react"
import {useNavigate} from "react-router-dom"
import {getAllEjecuciones} from "../../api/EstimacionAPI.api.ks.js";

// eslint-disable-next-line react/prop-types
export function HistorialPage({setUser}) {
  const [estimaciones, setEstimaciones] = useState([])
  const navigate = useNavigate()
  const itemsPerPage = 5; // Number of items per page
  const totalPages = Math.ceil(estimaciones.length / itemsPerPage);

  const [currentPage, setCurrentPage] = useState(1);

  const handleClick = (type) => {
    if (type === 'prev') {
      setCurrentPage((prev) => (prev <= 1 ? prev : prev - 1));
    } else if (type === 'next') {
      setCurrentPage((prev) => (prev >= totalPages ? prev : prev + 1));
    }
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const currentItems = estimaciones.slice(startIndex, endIndex);

  useEffect(() => {
    async function loadTasks() {
      return await getAllEjecuciones();
    }

    const fetchData = async () => {
      const data = await loadTasks();
      let finalData = []
      let j = data.length/2
      for(let i=data.length-1; i>=0;i--){
        if((i===data.length-1) || (i<data.length-1 && data[i].fechaEjecucion!==data[i+1].fechaEjecucion)){
          let obj = {
            id: j,
            fechaEjecucion: data[i-1].fechaEjecucion
          }
          j-=1
          finalData.push(obj)
        }

      }
      setEstimaciones(finalData);
    };

    fetchData();

  }, []);

  return (
      <div className="flex">
        <Sidebar setUser={setUser}/>
        <div className="w-4/6 mx-auto">
          <div className="mt-10 mb-10 font-extrabold text-3xl">
            Historial de Estimaciones
          </div>
          <div className="flex justify-end">
            <button className="bg-dark-purple text-white p-2 rounded-lg w-1/6 ml-2"
                    onClick={
                      async () => {
                        navigate("/estimacion")
                      }
                    }
            >
              Último Resultado
            </button>
            <button className="bg-dark-purple text-white p-2 rounded-lg w-1/6 ml-2"
                    onClick={
                      async () => {
                        navigate("/insumo-create")
                      }
                    }
            >
              Ejecutar Estimación
            </button>
            <button className="bg-dark-purple text-white p-2 rounded-lg w-1/6 ml-2"
                    onClick={
                      async () => {
                        navigate("/estimacion/datos")
                      }
                    }
            >
              Ver Datos Extra
            </button>
          </div>

          <table className="w-full mt-4">
            <thead className="bg-grat-50 border-b-2 border-gray-200">
            <tr>
              <th className='p-3 text-l font-semibold tracking-wide text-left'>ID</th>
              <th className='p-3 text-l font-semibold tracking-wide text-center'>Fecha Ejecución</th>
              <th className='p-3 text-l font-semibold tracking-wide text-center'>Acción</th>
            </tr>
            </thead>
            <tbody>
            {currentItems.length > 0 ? (
                    currentItems.map((estimacion, index) => (
                        <tr key={index} className="bg-zinc-100 p-3  rounded-lg odd:bg-white even:bg-slate-50">
                          <td className='p-3 text-gray-700'>{estimacion.id}</td>
                          <td className='p-3 text-gray-700 text-center'>{estimacion.fechaEjecucion.split("T")[0]}</td>
                          <td className='p-3 text-center'>
                            <button className="bg-dark-purple p-2 rounded-lg text-white text-sm"
                                    onClick={
                                      () => {
                                        navigate(`/estimacion/${estimacion.fechaEjecucion}`)
                                      }
                                    }
                            >
                              Visualizar
                            </button>
                          </td>
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
  )
}
