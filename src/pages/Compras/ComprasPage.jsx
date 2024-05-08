import { Sidebar } from '../../components/Sidebar.jsx'
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {
  createLineaOrdenCompra,
  createOrUpdateCompras,
  getAllCompras,
  getAllComprasFilterDate
} from "../../api/ComprasAPI.api.js";
import Modal from "../../components/Modal.jsx";
import XLSX from 'xlsx';
import {toast} from "react-hot-toast";
import {CSVLink} from "react-csv";

// eslint-disable-next-line react/prop-types
export function ComprasPage( {setUser}) {
  const [compras, setCompras] = useState([])
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false)
  const [jsonData, setJsonData] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [cancelFilter, setCancelFilter] = useState(false)
  const navigate = useNavigate()
  const itemsPerPage = 8; // Number of items per page
  const totalPages = Math.ceil(compras.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = compras.slice(startIndex, endIndex);
  const today = new Date().toLocaleDateString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
  }).split('/').reverse().join('-');

  const formatter = new Intl.NumberFormat('en-EN', {
    style: 'currency', // Format as a decimal number
    maximumFractionDigits: 2, // No decimals
    minimumFractionDigits: 0, // No decimals (in case of 0)
    useGrouping: true, // Add commas as thousands separators
    currency: 'USD',
  });

  const handleClick = (type) => {
    if (type === 'prev') {
      setCurrentPage((prev) => (prev <= 1 ? prev : prev - 1));
    } else if (type === 'next') {
      setCurrentPage((prev) => (prev >= totalPages ? prev : prev + 1));
    }
  };

  const importarCompras = async () =>{
    setIsLoading(true)
    let idOrdenActual = 0
    let arrayLineaOrdenCompra = []

    for (let i = 0; i < jsonData.length; i++) {
      if(i===0 || (i>0 && jsonData[i].A !== jsonData[i-1].A)){
        if (arrayLineaOrdenCompra.length>0){
          await createLineaOrdenCompra(arrayLineaOrdenCompra);
          arrayLineaOrdenCompra = []
        }

        let orden ={
          fidProveedor: jsonData[i].B,
          fechaCreacion: jsonData[i].D.toLocaleDateString('es-PE', {
            day: 'numeric',
            month: '2-digit',
            year: 'numeric'
          }).toString().split('/').reverse().join('-'),
          fechaEntrega: jsonData[i].E.toLocaleDateString('es-PE', {
            day: 'numeric',
            month: '2-digit',
            year: 'numeric'
          }).toString().split('/').reverse().join('-'),
          fidUsuario: 1,
        }
        idOrdenActual = jsonData[i].A
        await createOrUpdateCompras(idOrdenActual,orden)
        let lineaOrdenCompra = {
          fidOrdenCompra : idOrdenActual,
          fidInsumo: jsonData[i].F,
          cantidad: parseFloat(jsonData[i].H),
          precio: parseFloat(jsonData[i].I),
        }
        arrayLineaOrdenCompra.push(lineaOrdenCompra)
      }
      else{
        let lineaOrdenCompra = {
          fidOrdenCompra : idOrdenActual,
          fidInsumo: jsonData[i].F,
          cantidad: parseInt(jsonData[i].H),
          precio: parseFloat(jsonData[i].I),
        }
        arrayLineaOrdenCompra.push(lineaOrdenCompra)
      }
    }

    if (arrayLineaOrdenCompra.length>0){
      await createLineaOrdenCompra(arrayLineaOrdenCompra);
    }
    setIsLoading(false)
    setShowModal(false)

    toast.success('Compras importadas correctamente',{
      position: "top-right",
      style: {
        background:"#101010",
        color: "#fff"
      }
    })

    const data = await getAllCompras();
    setCompras(data);
  }

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
    };

    reader.readAsBinaryString(file);
  }

  useEffect(() => {
    async function loadTasks() {
      return await getAllCompras();
    }

    const fetchData = async () => {
      const data = await loadTasks();
      setCompras(data);
    };

    // eslint-disable-next-line
    fetchData();
    document.getElementById('input-compra-date-from').setAttribute('value', "2015-01-01");
    document.getElementById('input-compra-date-to').setAttribute('value', today);
    //eslint-disable-next-line
  }, []);

  const handleDateFilterChange = async ()=>{
    const inputDateFrom = document.getElementById('input-compra-date-from');
    const inputDateTo = document.getElementById('input-compra-date-to');
    setCancelFilter(true)
    if (inputDateFrom.value>inputDateTo.value){
      toast.error(`La fecha Inicial debe ser mayor a la fecha Final`,{
        position: "top-right",
        style: {
          background:"#101010",
          color: "#fff"
        }
      })
      return;
    }

    const fetchData = async () => {
      const data = await getAllComprasFilterDate(inputDateFrom.value, inputDateTo.value);
      setCompras(data);
    };
    // eslint-disable-next-line
    fetchData();
  }

  const handleCancelFilter = async ()=>{

    const inputDateFrom = document.getElementById('input-compra-date-from');
    inputDateFrom.value = "2015-01-01";
    const inputDateTo = document.getElementById('input-compra-date-to');
    inputDateTo.value = today;
    async function loadTasks() {
      return await getAllCompras();
    }

    const fetchData = async () => {
      const data = await loadTasks();
      setCompras(data);
    };
    // eslint-disable-next-line
    fetchData();
    setCancelFilter(false)
  }

  return (
      <div className="flex">
        <Sidebar setUser={setUser}/>
        <div className="w-4/6 mx-auto">
          <div className="w-full">
            <div className="mt-10 mb-10 font-extrabold text-3xl">
              Compras
            </div>
            <div className="flex justify-end">
              <CSVLink data={compras} className="w-1/6" filename={"compras-exp-"+today}>
                <button className="bg-dark-purple text-white p-2 rounded-lg w-full">
                  Exportar Compras
                </button>
              </CSVLink>
              <button className="bg-dark-purple text-white p-2 rounded-lg w-1/6 ml-2"
                      onClick={() => setShowModal(true)}
              >
                Importar Compras
              </button>
              <button className="bg-dark-purple text-white p-2 rounded-lg w-1/6 ml-2"
                      onClick={
                        async () => {
                          navigate("/compra-create")
                        }
                      }
              >
                Nueva Compra
              </button>
            </div>

            <div className="flex mt-2">
              <div className="flex">
                <span className="text-center self-center mr-2">Desde:</span>
                <input
                    id="input-compra-date-from"
                    className="bg-zinc-100 text-sm p-2 w-[130px] border border-stone-500 block rounded-lg placeholder:italic placeholder:text-zinc"
                    type="date"
                    onChange={handleDateFilterChange}
                />
              </div>
              <div className="flex">
                <span className="text-center self-center ml-4 mr-2">Hasta:</span>
                <input
                    id="input-compra-date-to"
                    className="bg-zinc-100 text-sm p-2 w-[130px] border border-stone-500 block rounded-lg placeholder:italic placeholder:text-zinc"
                    type="date"
                    onChange={handleDateFilterChange}
                />
              </div>
              { cancelFilter &&
                <button className="bg-dark-purple text-white p-2 rounded-lg w-1/12 ml-2"
                        onClick={handleCancelFilter}>
                  Cancelar
                </button>
              }

            </div>

          </div>


          <div className="min-h-[500px]">
            <table className="w-full mt-4">
            <thead className="bg-grat-50 border-b-2 border-gray-200">
              <tr>
                <th className='p-3 text-l font-semibold tracking-wide text-left'>ID</th>
                <th className='p-3 text-l font-semibold tracking-wide text-left'>Proveedor</th>
                <th className='p-3 text-l font-semibold tracking-wide text-left'>Fecha de Creación</th>
                <th className='p-3 text-l font-semibold tracking-wide text-left'>Costo Total</th>
                <th className='p-3 text-l font-semibold tracking-wide text-left'>Acción</th>
              </tr>
              </thead>
              <tbody>
              {currentItems.length > 0 ? (
                      currentItems.map((compra, index) => (
                          <tr key={index} className="bg-zinc-100 p-3  rounded-lg odd:bg-white even:bg-slate-50">
                            <td className='p-3 text-gray-700'>{compra.id}</td>
                            <td className='p-3 text-gray-700'>{compra.nombreProveedor}</td>
                            <td className='p-3 text-gray-700'>
                              {compra.fecha?.split("T")[0].split("-").reverse().join('-')}
                            </td>
                            <td className='p-3 text-gray-700'>{formatter.format(compra.costoTotal).replace(/,/g, ' ')}</td>
                            <td className='p-2'>
                              <button className="bg-dark-purple p-2 rounded-lg text-white text-sm"
                                      onClick={
                                        () => {
                                          navigate(`/compra/${compra.id}`)
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
          </div>

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
        <Modal showModal={showModal} setShowModal={setShowModal}>
          <h2 className="text-2xl font-bold mb-5">Importar Compras</h2>
          <div>
            <input className="mb-5" type="file" onChange={handleFileUpload}/>
          </div>
          <div className="flex justify-between">
            <button className="bg-dark-purple p-2 rounded-lg text-white text-sm"
                    onClick={importarCompras}
                    disabled={isLoading}
            >
              Importar
            </button>
            {isLoading && <img src="/assets/Cargando.gif" alt="/src/assets/Cargando.gif"/>}
          </div>
        </Modal>
      </div>
  )
}
