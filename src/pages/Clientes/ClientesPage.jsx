import { Sidebar } from '../../components/Sidebar.jsx'
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {getAllClientes, getAllClientesByName} from "../../api/ClientesAPI.api.js";

// eslint-disable-next-line react/prop-types
export function ClientesPage({setUser}) {
  const [clientes, setClientes] = useState([])
  const [currentPage, setCurrentPage] = useState(1);

  const navigate = useNavigate()
  const itemsPerPage = 5; // Number of items per page
  const totalPages = Math.ceil(clientes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const currentItems = clientes.slice(startIndex, endIndex);


  const handleClick = (type) => {
    if (type === 'prev') {
      setCurrentPage((prev) => (prev <= 1 ? prev : prev - 1));
    } else if (type === 'next') {
      setCurrentPage((prev) => (prev >= totalPages ? prev : prev + 1));
    }
  };


  useEffect(() => {
    async function loadTasks() {
      return await getAllClientes();
    }

    const fetchData = async () => {
      const data = await loadTasks();
      setClientes(data);
    };

    fetchData();
  }, []);

  const handleQuerySearch = async (e)=>{
    const q = e.target.value;
    if(q===""){
      const fetchData = async () => {
        const data = await getAllClientes();
        setClientes(data);
      };
      fetchData();
    }else{
      const fetchData = async () => {
        const data = await getAllClientesByName(q);
        setClientes(data);
      };
      fetchData();
    }
    // eslint-disable-next-line

  }

  return (
      <div className="flex">
        <Sidebar setUser={setUser}/>
        <div className="w-4/6 mx-auto">
          <div className="mt-10 mb-10 font-extrabold text-3xl">
            Clientes
          </div>
          <div className="flex justify-end">
            <button className="bg-dark-purple text-white p-2 rounded-lg w-1/6"
                    onClick={
                      async () => {
                        navigate("/cliente-create")
                      }
                    }
            >
              Crear
            </button>
          </div>
          <div className="flex">
            <div className="flex w-full">
              <span className="text-center self-center mr-2">Filtro:</span>
              <input
                  id="input-compra-date-from"
                  className="bg-zinc-100 text-sm p-2 w-2/6 border border-stone-500 block rounded-lg placeholder:italic placeholder:text-zinc"
                  type="text"
                  placeholder="Buscar por Nombre de Cliente"
                  onChange={handleQuerySearch}
              />
            </div>
          </div>

          <table className="w-full mt-4">
            <thead className="bg-grat-50 border-b-2 border-gray-200">
            <tr>
              <th className='p-3 text-l font-semibold tracking-wide text-left'>ID</th>
              <th className='p-3 text-l font-semibold tracking-wide text-left'>Cliente</th>
              <th className='p-3 text-l font-semibold tracking-wide text-left'>Contacto</th>
              <th className='p-3 text-l font-semibold tracking-wide text-left'>Estado</th>
              <th className='p-3 text-l font-semibold tracking-wide text-left'>Acción</th>
            </tr>
            </thead>
            <tbody>
            {currentItems.length > 0 ? (
                    currentItems.map((cliente, index) => (
                        <tr key={index} className="bg-zinc-100 p-3  rounded-lg odd:bg-white even:bg-slate-50">
                          <td className='p-3 text-gray-700'>{cliente.id}</td>
                          <td className='p-3 text-gray-700'>{cliente.nombreCliente}</td>
                          <td className='p-3 text-gray-700'>{cliente.nombreContacto + " - " + cliente.numeroContacto + " - " + cliente.correoContacto}</td>
                          <td className='p-3 text-gray-700'>{cliente.activo ? "Activo" : "Inactivo"}</td>
                          <td className='p-2'>
                            <button className="bg-dark-purple p-2 rounded-lg text-white text-sm"
                                    onClick={
                                      () => {
                                        navigate(`/cliente/${cliente.id}`)
                                      }
                                    }
                            >
                              Editar
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

