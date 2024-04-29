import {useNavigate} from "react-router-dom";
import {useForm} from "react-hook-form";
import {Sidebar} from "../../components/Sidebar.jsx";
import {useEffect, useState} from "react";
import { getAllProveedoresActivos} from "../../api/ProveedoresAPI.api.js";
import {getAllInsumos} from "../../api/InsumosAPI.api.js";
import {toast} from "react-hot-toast";
import {createLineaOrdenCompra, createOrUpdateCompras} from "../../api/ComprasAPI.api.js";

export function CompraFormPage(){
  const navigate = useNavigate();
  // const params = useParams();
  const {handleSubmit} = useForm()
  const [proveedores, setProveedores] = useState([])
  const [extraRows, setExtraRows] = useState(0)
  const [dataRows, setDataRows] = useState([])
  const [insumos, setInsumos] = useState([])
  const [totalFinal, setTotalFinal] = useState(0)
  const today = new Date().toLocaleDateString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
  }).split('/').reverse().join('-');

  const addRowInsumo = () =>{
    setExtraRows(extraRows+1)
  }

  const formatter = new Intl.NumberFormat('en-EN', {
    style: 'currency', // Format as a decimal number
    maximumFractionDigits: 2, // No decimals
    minimumFractionDigits: 0, // No decimals (in case of 0)
    useGrouping: true, // Add commas as thousands separators
    currency: 'USD',
  });

  useEffect(()=>{
    const fetchData = async () => {
      const dataProveedores = await getAllProveedoresActivos();
      const dataInsumos = await getAllInsumos();
      setProveedores(dataProveedores);
      setInsumos(dataInsumos);
    };
    fetchData();
    document.getElementById('input-date').setAttribute('value', today);

    //eslint-disable-next-line
  },[])

  const handleInsumoChange = (e, index) => {
    const selectedId = e.target.value;
    const newDataRows = [...dataRows];
    const cantidadPaquetes = document.getElementById("input-cantidad-"+index).value
    const insumoSelected = insumos.find((insumo) => insumo.id === parseInt(selectedId))
    newDataRows[index] = {
      ...newDataRows[index],
      insumoId: parseInt(selectedId),
      pesoTotal: insumoSelected?.pesoPaquete?insumoSelected.pesoPaquete*cantidadPaquetes:0,
    };
    setDataRows(newDataRows);
  };

  const handleCantidadPaquetesChange = async (e, index) => {
    const newDataRows = [...dataRows];
    const cantidadPaquetes = document.getElementById("input-cantidad-" + index).value
    const costoUnitario = document.getElementById("input-costo-" + index).value
    let insumoSelected = null
    if (newDataRows[index])
       insumoSelected = insumos.find((insumo) => insumo.id === newDataRows[index].insumoId)
    newDataRows[index] = {
      ...newDataRows[index],
      pesoTotal: insumoSelected?.pesoPaquete? insumoSelected?.pesoPaquete*cantidadPaquetes:0,
      subtotal: costoUnitario*cantidadPaquetes,
    };
    setDataRows(newDataRows);

    const table = await document.getElementById('table-linea-compra');
    let total=0
    for (let i=1; i<table.rows.length; i++) {
      total+=parseFloat(table.rows[i].cells[4].querySelector('span').innerText.replace(" ","").split("$")[1])
    }
    setTotalFinal(total)
  }

  const handleCostoUnitarioChange = async (e, index) => {
    const newDataRows = [...dataRows];
    const costoUnitario = document.getElementById("input-costo-"+index).value
    const cantidadPaquetes = document.getElementById("input-cantidad-"+index).value
    newDataRows[index] = {
      ...newDataRows[index],
      subtotal: costoUnitario*cantidadPaquetes,
    };
    setDataRows(newDataRows);

    const table = await document.getElementById('table-linea-compra');
    let total=0
    for (let i=1; i<table.rows.length; i++) {
      total+=parseFloat(table.rows[i].cells[4].querySelector('span').innerText.replace(" ","").split("$")[1])
    }
    setTotalFinal(total)
  }


  const onSubmit = handleSubmit(async ()=> {
    const table = document.getElementById('table-linea-compra');
    const form = document.getElementById('form-compra');
    const rows = await table.rows;
    const inputDate = form.querySelector('label input')
    const selectProveedor = form.querySelector('label select')
    if (isNaN(parseInt(selectProveedor.value))){
      toast.error(`No existen proveedores activos actualmente. Verifique en la sección "Proveedores"`,{
        position: "top-right",
        style: {
          background:"#101010",
          color: "#fff"
        }
      })
      return;
    }

    const orden_compra = {
      fidProveedor : parseInt(selectProveedor.value),
      fechaEntrega: inputDate.value,
      fechaCreacion: today,
      fidUsuario: 1
    }

    let insumosCompradosList = []
    for (let j=1 ; j < rows.length; j++) {
      const currentRow = rows[j];
      const inputElements = currentRow.querySelectorAll('td input')
      const selectElement = currentRow.querySelector('td select')
      if (parseInt(selectElement.value)===-1){
        toast.error(`La fila ${j} de Insumos comprados no tiene un insumo seleccionado`,{
          position: "top-right",
          style: {
            background:"#101010",
            color: "#fff"
          }
        })
        return;
      }
      const insumoCompradoValues = {
        fidInsumo: parseInt(selectElement.value),
        cantidad: parseFloat(inputElements[0].value),
        precio: parseFloat(inputElements[1].value),
      }
      insumosCompradosList.push(insumoCompradoValues);
    }

    let result = await createOrUpdateCompras(0, orden_compra)
    const idOrden = result.data.id
    insumosCompradosList = insumosCompradosList.map((item) => ({...item, fidOrdenCompra: idOrden}))

    await createLineaOrdenCompra(insumosCompradosList)

    toast.success(`Compra registrada correctamente`,{
      position: "top-right",
      style: {
        background:"#101010",
        color: "#fff"
      }
    })

    navigate("/compras")
  })

  function formatNumber(number) {
    if (number % 1 !== 0) { // Check if it has decimals
      return number.toFixed(2);
    } else {
      return number.toString(); // Keep integers as-is
    }
  }

  return(
      <div className="flex">
        <Sidebar/>
        <div className="w-4/6 mx-auto">
          <div className="mt-10 mb-10 font-extrabold text-3xl">
            Nueva Compra
          </div>
          <form onSubmit={onSubmit} id={"form-compra"}>
            <div className="flex justify-end">
              <button className="bg-dark-purple p-3 w-1/6 rounded-lg block mt-0 text-white" type="submit">
                Guardar
              </button>
            </div>

            <label className="block text-zinc-500 mt-0">Proveedor
              <select
                  className="bg-zinc-100 text-sm p-2 w-2/6 border border-stone-500 block rounded-lg placeholder:italic placeholder:text-zinc"
              >
                {proveedores.map((item, index) => (
                    <option key={index} value={item.id}>
                      {item.nombreProveedor}
                    </option>
                ))}
              </select>
            </label>

            <label className="block text-zinc-500 mt-4">Fecha Entrega
              <input
                  id="input-date"
                  className="bg-zinc-100 text-sm p-2 w-2/6 border border-stone-500 block rounded-lg mt-3 placeholder:italic placeholder:text-zinc"
                  type="date"/>
            </label>

            <label className="block text-zinc-500 mt-4">
              Insumos solicitados
            </label>
            <div className="flex w-full">
              <div className="w-full mt-1 h-[250px] overflow-y-auto">
                <table className="w-full" id="table-linea-compra">
                  <thead className="bg-grat-50 border-b-2 border-gray-200">
                  <tr>
                    <th className='p-2 text-l font-semibold tracking-wide text-left'>Insumo</th>
                    <th className='p-2 text-l font-semibold tracking-wide text-left'>Paquetes</th>
                    <th className='p-2 text-l font-semibold tracking-wide text-left'>Peso Total</th>
                    <th className='p-2 text-l font-semibold tracking-wide text-left'>Costo Unitario</th>
                    <th className='p-2 text-l font-semibold tracking-wide text-left'>Subtotal</th>
                    <th className='p-2 text-l font-semibold tracking-wide text-left'>Borrar</th>
                  </tr>
                  </thead>
                  <tbody className="h-1.5">
                  <>
                    <tr id={0}
                        className="bg-zinc-100 p-2 rounded-lg odd:bg-white even:bg-slate-50">
                      <td className='p-2 text-gray-700 w-auto'>
                        <select
                            className="bg-zinc-100 text-sm p-2 w-full border border-stone-500 block rounded-lg mt-1 placeholder:italic placeholder:text-zinc"
                            onChange={(e) => handleInsumoChange(e, 0)}
                        >
                          <option value="-1">Elegir Insumo...</option>
                          {insumos.map((item, index) => (
                              <option key={index} value={item.id}>
                                {item.nombreInsumo}
                              </option>
                          ))}
                        </select>
                      </td>
                      <td className='p-2 text-gray-700 w-[120px]'>
                        <input
                            className="bg-zinc-100 text-sm p-2 w-[80px] min-w-[62px] border border-stone-500 block rounded-lg mt-1 placeholder:italic placeholder:text-zinc"
                            type="number"
                            step="0.01"
                            defaultValue={0}
                            min={0.01}
                            id={"input-cantidad-0"}
                            onChange={(e) => handleCantidadPaquetesChange(e, 0)}
                        />
                      </td>
                      <td className='p-2 text-gray-700 w-[120px]'>
                        <span>
                          {dataRows[0]?.pesoTotal ? formatNumber(dataRows[0].pesoTotal) : 0} Kg
                        </span>
                      </td>
                      <td className='p-2 text-gray-700 w-[130px]' >$
                        <input
                            className="bg-zinc-100 ml-2 text-sm p-2 w-[70px] min-w-[62px] border border-stone-500 rounded-lg mt-1 placeholder:italic placeholder:text-zinc"
                            type="number"
                            step="0.01"
                            defaultValue={0}
                            min={0.01}
                            id={"input-costo-0"}
                            onChange={(e) => handleCostoUnitarioChange(e, 0)}
                        />
                      </td>
                      <td className='p-2 text-gray-700 w-[130px]'>
                        <span>
                          {dataRows[0]?.subtotal ? formatter.format(dataRows[0].subtotal).replace(/,/g, ' ') : formatter.format(0).replace(/,/g, ' ')}
                        </span>
                      </td>
                      <td className='p-2 text-gray-700 w-[80px]' ></td>
                    </tr>
                    {extraRows > 0 && Array(extraRows).fill(null).map((value, index) => (
                        <tr key={index + 1}
                            className="bg-zinc-100 p-2  rounded-lg odd:bg-white even:bg-slate-50">
                          <td className='p-2 text-gray-700 w-auto'>
                            <select
                                className="bg-zinc-100 text-sm p-2 w-full border border-stone-500 block rounded-lg mt-1 placeholder:italic placeholder:text-zinc"
                                onChange={(e) => handleInsumoChange(e, index + 1)}
                            >
                              <option value="-1">Elegir Insumo...</option>
                              {insumos.map((item, index) => (
                                  <option key={index} value={item.id}>
                                    {item.nombreInsumo}
                                  </option>
                              ))}
                            </select>
                          </td>
                          <td className='p-2 text-gray-700 w-[120px]'>
                            <input
                                className="bg-zinc-100 text-sm p-2 w-3/12 min-w-[62px] border border-stone-500 block rounded-lg mt-1 placeholder:italic placeholder:text-zinc"
                                type="number"
                                step="0.01"
                                defaultValue={0}
                                min={0.01}
                                id={"input-cantidad-" + (index + 1)}
                                onChange={(e) => handleCantidadPaquetesChange(e, index + 1)}
                            />
                          </td>
                          <td className='p-2 text-gray-700 w-[120px]'>
                            <span>
                              {dataRows[index + 1]?.pesoTotal ? formatNumber(dataRows[index + 1].pesoTotal) : 0} Kg
                            </span>
                          </td>
                          <td className='p-2 text-gray-700 w-[130px]'> $
                            <input
                                className="bg-zinc-100 ml-2 text-sm p-2 w-3/12 min-w-[62px] border border-stone-500 rounded-lg mt-1 placeholder:italic placeholder:text-zinc"
                                type="number"
                                step="0.01"
                                defaultValue={0}
                                min={0.01}
                                id={"input-costo-" + (index + 1)}
                                onChange={(e) => handleCostoUnitarioChange(e, index + 1)}
                            />
                          </td>
                          <td className='p-2 text-gray-700 w-[130px]'>
                            <span>
                              {dataRows[index + 1]?.subtotal ? formatter.format(dataRows[index + 1].subtotal).replace(/,/g, ' ') : formatter.format(0).replace(/,/g, ' ')}
                            </span>
                          </td>
                          <td className='p-2 text-gray-700 w-[80px]'>
                            <button
                                className={"bg-red-500 text-white rounded-full w-[30px] h-[30px]"}
                                type="button"
                                onClick={(event) => {
                                  const table = document.getElementById('table-linea-compra');
                                  table.deleteRow(event.target.parentNode.parentNode.rowIndex);
                                  let total=0
                                  for (let i=1; i<table.rows.length; i++) {
                                      total+=parseFloat(table.rows[i].cells[4].querySelector('span').innerText.replace(" ","").split("$")[1])
                                  }
                                  setTotalFinal(total)
                                }}
                            >
                              {" - "}
                            </button>
                          </td>
                        </tr>
                    ))}
                  </>
                  </tbody>
                </table>
              </div>
              <div className="w-[30px] justify-center ml-5">
                <button
                    className="bg-dark-purple p-1 w-full rounded-lg block mt-3 mb-3 text-white"
                    onClick={addRowInsumo}
                    type="button"
                >
                  +
                </button>
              </div>
            </div>
            <span className="">
              {"Total Final: "+ formatter.format(totalFinal).replace(/,/g, ' ')}
            </span>
          </form>
        </div>
      </div>
  )

}