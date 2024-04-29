import { Sidebar } from '../../components/Sidebar.jsx'
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import Modal from "../../components/Modal.jsx";
import XLSX from 'xlsx';
import {toast} from "react-hot-toast";
import {
  createLineaOrdenVenta,
  createOrUpdateVentas,
  getAllVentas,
  getAllVentasFilterDate
} from "../../api/VentasAPI.api.js";

export function VentasPage() {
  const [ventas, setVentas] = useState([])
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false)
  const [jsonData, setJsonData] = useState([])
  const navigate = useNavigate()
  const itemsPerPage = 10; // Number of items per page
  const totalPages = Math.ceil(ventas.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = ventas.slice(startIndex, endIndex);
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

  const importarVentas = async () =>{
    let idOrdenActual = 0
    let arrayLineaOrdenVenta = []

    for (let i = 0; i < jsonData.length; i++) {
      if(i===0 || (i>0 && jsonData[i].A !== jsonData[i-1].A)){
        if (arrayLineaOrdenVenta.length>0){
          await createLineaOrdenVenta(arrayLineaOrdenVenta);
          arrayLineaOrdenVenta = []
        }

        let orden ={
          fidCliente: jsonData[i].B,
          fechaCreacion: jsonData[i].D.toLocaleDateString('es-PE', {
            day: 'numeric',
            month: '2-digit',
            year: 'numeric'
          }).toString().split('/').reverse().join('-'),
          fechaVencimiento: jsonData[i].E.toLocaleDateString('es-PE', {
            day: 'numeric',
            month: '2-digit',
            year: 'numeric'
          }).toString().split('/').reverse().join('-'),
          fidUsuario: 1,
        }

        idOrdenActual = jsonData[i].A
        await createOrUpdateVentas(idOrdenActual,orden)
        let lineaOrdenVenta = {
          fidOrdenVenta : idOrdenActual,
          fidProducto: jsonData[i].F,
          cantidad: parseFloat(jsonData[i].H),
          precio: parseFloat(jsonData[i].I),
          fechaEntrega: jsonData[i].J.toLocaleDateString('es-PE', {
            day: 'numeric',
            month: '2-digit',
            year: 'numeric'
          }).toString().split('/').reverse().join('-'),
        }
        arrayLineaOrdenVenta.push(lineaOrdenVenta)
      }
      else{
        let lineaOrdenVenta = {
          fidOrdenVenta : idOrdenActual,
          fidProducto: jsonData[i].F,
          cantidad: parseInt(jsonData[i].H),
          precio: parseFloat(jsonData[i].I),
          fechaEntrega: jsonData[i].J.toLocaleDateString('es-PE', {
            day: 'numeric',
            month: '2-digit',
            year: 'numeric'
          }).toString().split('/').reverse().join('-'),
        }
        arrayLineaOrdenVenta.push(lineaOrdenVenta)
      }
    }

    if (arrayLineaOrdenVenta.length>0){
      await createLineaOrdenVenta(arrayLineaOrdenVenta);
    }
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
      return await getAllVentas();
    }

    const fetchData = async () => {
      const data = await loadTasks();
      setVentas(data);
    };

    // eslint-disable-next-line
    fetchData();
    document.getElementById('input-venta-date-from').setAttribute('value', today);
    document.getElementById('input-venta-date-to').setAttribute('value', today);
    //eslint-disable-next-line
  }, []);

  const handleDateFilterChange = async ()=>{
    const inputDateFrom = document.getElementById('input-venta-date-from');
    const inputDateTo = document.getElementById('input-venta-date-to');
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
      const data = await getAllVentasFilterDate(inputDateFrom.value, inputDateTo.value);
      setVentas(data);
    };
    // eslint-disable-next-line
    fetchData();
  }


  return (
      <div className="flex">
        <Sidebar/>
        <div className="w-4/6 mx-auto">
          <div className="w-full">
            <div className="mt-10 mb-10 font-extrabold text-3xl">
              Ventas
            </div>
            <div className="flex justify-end">
              <button className="bg-dark-purple text-white p-2 rounded-lg w-1/6"
                      onClick={() => setShowModal(true)}
              >
                Importar Ventas
              </button>
            </div>
            <div className="flex">
              <div className="flex">
                <span className="text-center self-center mr-2">Desde:</span>
                <input
                    id="input-venta-date-from"
                    className="bg-zinc-100 text-sm p-2 w-[130px] border border-stone-500 block rounded-lg placeholder:italic placeholder:text-zinc"
                    type="date"
                    onChange={handleDateFilterChange}
                />
              </div>
              <div className="flex">
                <span className="text-center self-center ml-4 mr-2">Hasta:</span>
                <input
                    id="input-venta-date-to"
                    className="bg-zinc-100 text-sm p-2 w-[130px] border border-stone-500 block rounded-lg placeholder:italic placeholder:text-zinc"
                    type="date"
                    onChange={handleDateFilterChange}
                />
              </div>
            </div>

          </div>
          <div className="min-h-[572px]">
            <table className="w-full mt-4">
              <thead className="bg-grat-50 border-b-2 border-gray-200">
              <tr>
                <th className='p-3 text-l font-semibold tracking-wide text-left'>ID</th>
                <th className='p-3 text-l font-semibold tracking-wide text-left'>Cliente</th>
                <th className='p-3 text-l font-semibold tracking-wide text-left'>Fecha de Creación</th>
                <th className='p-3 text-l font-semibold tracking-wide text-left'>Venta Total</th>
                <th className='p-3 text-l font-semibold tracking-wide text-left'>Acción</th>
              </tr>
              </thead>
              <tbody>
              {currentItems.length > 0 ? (
                      currentItems.map((venta, index) => (
                          <tr key={index} className="bg-zinc-100 p-3  rounded-lg odd:bg-white even:bg-slate-50">
                            <td className='p-3 text-gray-700'>{venta.id}</td>
                            <td className='p-3 text-gray-700'>{venta.nombreCliente}</td>
                            <td className='p-3 text-gray-700'>
                              {venta.fecha?.split("T")[0].split("-").reverse().join('-')}
                            </td>
                            <td className='p-3 text-gray-700'>{formatter.format(venta.ventaTotal).replace(/,/g, ' ')}</td>
                            <td className='p-2'>
                              <button className="bg-dark-purple p-2 rounded-lg text-white text-sm"
                                      onClick={
                                        () => {
                                          navigate(`/venta/${venta.id}`)
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
          <h2 className="text-2xl font-bold mb-5">Importar Ventas</h2>
          <div>
            <input className="mb-5" type="file" onChange={handleFileUpload}/>
          </div>
          <div>
            <button className="bg-dark-purple p-2 rounded-lg text-white text-sm"
                    onClick={importarVentas}>
              Importar
            </button>
          </div>
        </Modal>
      </div>
  )
}
