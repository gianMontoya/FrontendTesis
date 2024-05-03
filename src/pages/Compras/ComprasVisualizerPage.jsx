import {useParams} from "react-router-dom";
import {Sidebar} from "../../components/Sidebar.jsx";
import {useEffect, useState} from "react";
import {getCompra, getLineaOrdenCompra} from "../../api/ComprasAPI.api.js";

export function ComprasVisualizerPage(){
  const params = useParams();
  const [compra, setCompra] = useState({})
  const [lineasOrdenCompra, setLineasOrdenCompra] = useState([])
  const today = new Date().toLocaleDateString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
  }).split('/').reverse().join('-');

  const formatter = new Intl.NumberFormat('en-EN', {
    style: 'currency', // Format as a decimal number
    maximumFractionDigits: 2, // No decimals
    minimumFractionDigits: 2, // No decimals (in case of 0)
    useGrouping: true, // Add commas as thousands separators
    currency: 'USD',
  });

  useEffect(()=>{
    const loadCompra = async () => {
      const {data} = await getCompra(params.id)
      setCompra(data)
      const dataLineas = await getLineaOrdenCompra(data.id)
      setLineasOrdenCompra(dataLineas.data)
    };
    //eslint-disable-next-line
    loadCompra()
    document.getElementById('input-date').setAttribute('value', today);
    //eslint-disable-next-line
  },[])

  const totalFinal = lineasOrdenCompra.reduce((acumulador, item) => {
    return acumulador + (item.precio * item.cantidad);
  }, 0);

  return(
      <div className="flex">
        <Sidebar/>
        <div className="w-4/6 mx-auto">
          <div className="mt-10 mb-10 font-extrabold text-3xl">
            Información Compra
          </div>
          <form id="form-venta">
            <div className="flex justify-end">
              <button className="bg-dark-purple p-3 w-1/6 rounded-lg block mt-0 text-white">
                Imprimir Orden
              </button>
            </div>

            <label className="block text-zinc-500 mt-0">Proveedor
              <input
                  className="bg-zinc-100 text-sm p-2 w-2/6 border border-stone-500 block rounded-lg mt-3 placeholder:italic placeholder:text-zinc"
                  type="text"
                  defaultValue={compra?.nombreProveedor}
                  disabled
              />
            </label>

            <label className="block text-zinc-500 mt-4">Fecha de Recepción
              <input
                  id="input-date"
                  className="bg-zinc-100 text-sm p-2 w-2/6 border border-stone-500 block rounded-lg mt-3 placeholder:italic placeholder:text-zinc"
                  defaultValue={compra.fechaEntrega?.split('-').reverse().join('/')}
                  disabled
                  type="text"/>
            </label>

            <label className="block text-zinc-500 mt-4">
              Insumos solicitados
            </label>

            <div className="flex w-full">
              <div className="w-full mt-1 h-[250px] overflow-y-auto">
                <table className="w-full" id="table-linea-venta">
                  <thead className="bg-grat-50 border-b-2 border-gray-200">
                  <tr>
                    <th className='p-2 text-l font-semibold tracking-wide text-left'>Insumo</th>
                    <th className='p-2 text-l font-semibold tracking-wide text-left'>Paquetes</th>
                    <th className='p-2 text-l font-semibold tracking-wide text-left'>Peso Total</th>
                    <th className='p-2 text-l font-semibold tracking-wide text-left'>Precio Unitario</th>
                    <th className='p-2 text-l font-semibold tracking-wide text-left'>Subtotal</th>
                  </tr>
                  </thead>
                  <tbody className="h-1.5">
                  <>
                    {lineasOrdenCompra.map((item, index) => (
                        <tr key={index}
                            className="bg-zinc-100 p-2  rounded-lg odd:bg-white even:bg-slate-50">
                          <td className='p-2 text-gray-700 w-auto'>
                            <span>
                              {item.nombreInsumo}
                            </span>
                          </td>
                          <td className='p-2 text-gray-700 w-[120px]'>
                            <span>
                              {item.cantidad}
                            </span>
                          </td>
                          <td className='p-2 text-gray-700 w-[120px]'>
                            <span>
                              {item.pesoTotal} Kg
                            </span>
                          </td>
                          <td className='p-2 text-gray-700 w-[130px]'>
                            <span>
                              {formatter.format(item.precio).replace(/,/g, ' ')}
                            </span>
                          </td>
                          <td className='p-2 text-gray-700 w-[130px]'>
                            <span>
                              {formatter.format(item.precio * item.cantidad).replace(/,/g, ' ')}
                            </span>
                          </td>
                        </tr>
                    ))}
                  </>
                  </tbody>
                </table>
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