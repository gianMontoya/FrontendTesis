import { Sidebar } from '../components/Sidebar'
import {Area, AreaChart, Bar, BarChart, Cell, Legend, Tooltip, XAxis, YAxis} from "recharts";
import Select from 'react-select';
import {useEffect, useState} from "react";
import {getAllProveedores} from "../api/ProveedoresAPI.api.js";
import {getAllInsumos} from "../api/InsumosAPI.api.js";
import {getAllProductos} from "../api/ProductosAPI.api.js"; // Asegúrate de tener instalado react-select

// eslint-disable-next-line react/prop-types
export function TableroPage({setUser}) {
  const [proveedores, setProveedores] = useState([])
  const [insumos, setInsumos] = useState([])
  // const [productos, setProductos] = useState([])

  const rangeData = [
    {
      "month": "Enero",
      "Real": 87.39,
      "Estimado": 86.46,
    },
    {
      "month": "Febrero",
      "Real": 83.51,
      "Estimado": 80.59,
    },
    {
      "month": "Marzo",
      "Real": 80.59,
      "Estimado": 79.87,
    },
    {
      "month": "Abril",
      "Real": 74.77,
      "Estimado": 75.37,
    },
    {
      "month": "Mayo",
      "Real": 58.26,
      "Estimado": 59.83,
    },
    {
      "month": "Junio",
      "Real": 48.55,
      "Estimado": 52.81,
    },
    {
      "month": "Julio",
      "Estimado": 54.23,
    },
    {
      "month": "Agosto",
      "Estimado": 53.46,
    },
    {
      "month": "Setiembre",
      "Estimado": 54.64,
    },
    {
      "month": "Octubre",
      "Estimado": 66.61,
    },
    {
      "month": "Noviembre",
      "Estimado": 79.76,
    },
    {
      "month": "Diciembre",
      "Estimado": 83.41,
    }
  ]
  const costData = [
    {
      "month": "Enero",
      "Real": 215874,
      "Costo promedio": 1.12,
    },
    {
      "month": "Febrero",
      "Real": 257569,
      "Costo promedio": 1.25,
    },
    {
      "month": "Marzo",
      "Real": 258000,
      "Costo promedio": 1.16,
    },
    {
      "month": "Abril",
      "Real": 250000,
      "Costo promedio": 1.21,
    },
    {
      "month": "Mayo",
      "Real": 200000,
      "Costo promedio": 1.12,
    },
    {
      "month": "Junio",
      "Real": 296521,
      "Costo promedio": 1.23,
    },
    {
      "month": "Julio",
      "Real": 243684,
      // "Costo promedio": 2.80,
    },
    {
      "month": "Agosto",
      "Real": 203681,
      // "Costo promedio": 2.60,
    },
    {
      "month": "Setiembre",
      "Real": 245678,
      // "Costo promedio": 2.70,
    },
    {
      "month": "Octubre",
      "Real": 239787,
      // "Costo promedio": 2.40,
    },
    {
      "month": "Noviembre",
      "Real": 265876,
      // "Costo promedio": 2.20,
    },
    {
      "month": "Diciembre",
      "Real": 201245,
      // "Costo promedio": 2.40,
    }
  ]
  const percentData = [
    {
      "month": "Enero",
      "crecimiento": 10,
    },
    {
      "month": "Febrero",
      "crecimiento": 20,
    },
    {
      "month": "Marzo",
      "crecimiento": -10,
    },
    {
      "month": "Abril",
      "crecimiento": 50,
    },
    {
      "month": "Mayo",
      "crecimiento": -20,
    },
    {
      "month": "Junio",
      "crecimiento": 70,
    },
    {
      "month": "Julio",
      "crecimiento": 10,
    },
    {
      "month": "Agosto",
    },
    {
      "month": "Setiembre",
    },
    {
      "month": "Octubre",
    },
    {
      "month": "Noviembre",
    },
    {
      "month": "Diciembre",
    }
  ]

  useEffect(() => {
    async function loadProveedores() {
      return await getAllProveedores();
    }
    async function loadInsumos() {
      return await getAllInsumos();
    }
    async function loadProductos() {
      return await getAllProductos();
    }

    const fetchData = async () => {
      const dataProveedores = await loadProveedores();
      const dataInsumos = await loadInsumos();
      const dataProductos = await loadProductos();

      const proveedoresName = []
      const insumosName = []
      const productosName = []
      for(const value of dataProveedores){
        proveedoresName.push({
          value: value.id,
          label: value.nombreProveedor
        })
      }
      for(const value of dataInsumos){
        insumosName.push({
          value: value.id,
          label: value.nombreInsumo
        })
      }
      for(const value of dataProductos){
        productosName.push({
          value: value.id,
          label: value.nombreProducto
        })
      }
      setProductos(productosName)
      setProveedores(proveedoresName);
      setInsumos(insumosName);
    };
    // eslint-disable-next-line
    fetchData();
  }, []);

  const years =
      [{value: 2024, label: "2024"},{value: 2023, label: "2023"}]

  const labelFormatterDolar = (value) => {
    return value.toFixed(2) + ' $';
  };

  const labelFormatterTons = (value) => {
    return value.toFixed(1) + ' tn';
  };

  return (

      <div className="flex h-screen">
        <Sidebar setUser={setUser} />
          <div className="w-5/6 mx-auto">
            <div className="flex-1 p-8 mx-auto">
              <div className="flex justify-between items-center mb-8">
                <h1 className="font-extrabold text-3xl">Tablero Informativo</h1>
                <Select
                    defaultValue={years[0]}
                    options={years} className="w-40"
                />
              </div>
              <div className="bg-white rounded-lg p-3 shadow shadow-gray-500 mb-5">
                <div className="flex mb-4">
                  <span className="text-lg font-semibold mr-10 text-center align-middle">PROVEEDOR:</span>

                  {proveedores.length > 0 &&
                      <Select defaultValue={proveedores[0]} options={proveedores} className="w-64"/>
                  }
                  {insumos.length > 0 && (
                        <Select defaultValue={insumos[0]} options={insumos} className="w-64 ml-[600px]"/>
                    )
                }
              </div>
              <div className="grid grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-md font-medium mb-2">Tasa de crecimiento de compras a Proveedor (%)</h3>
                    <BarChart
                        height={400}
                        width={950}
                        data={percentData}
                        margin={{
                          top: 20, right: 50, bottom: 50, left: 0,
                        }}
                    >
                      <XAxis dataKey="month" angle={-45} tickMargin={20}/>
                      <YAxis
                          type="number"
                          domain={["dataMin", "dataMax"]} // Dominio del 0% al 100%
                          tickFormatter={(tick) => `${tick}%`}
                      />
                      <Bar dataKey="crecimiento" fill="#82ca9d" unit="%">
                        {
                          percentData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.crecimiento < 0 ? '#FF4136' : '#82ca9d'}/>
                          ))
                        }
                      </Bar>
                      <Tooltip/>
                    </BarChart>
                  </div>
                  <div>
                    <h3 className="text-md font-medium mb-2">Cantidad Comprada de Insumo al proveedor (tn)</h3>
                    <BarChart
                        height={400}
                        width={950}
                        data={rangeData}
                        margin={{
                          top: 20, right: 40, bottom: 50, left: 0,
                        }}
                    >
                      <XAxis dataKey="month" angle={-45} tickMargin={20} />
                      <YAxis type="number" unit=" tn"/>
                      <Bar type="monotone" dataKey="Real" stroke="#8884d8" fill="#82ca9d" label={{ position: 'top' , formatter: labelFormatterTons}} unit=" tn" />
                      <Tooltip/>
                    </BarChart>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-3 shadow shadow-gray-500 mb-5">
                <div className="flex mb-4">
                  <div className="text-center">
                    <h2 className="text-lg font-semibold mr-10 text-center">INSUMO:</h2>
                  </div>
                  {insumos.length > 0 &&
                      <Select defaultValue={insumos[0]} options={insumos} className="w-64"/>
                  }
                </div>
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-md font-medium mb-2">Necesidad de Insumo Real vs Estimado (tn)</h3>
                    <AreaChart
                        height={400}
                        width={950}
                        data={rangeData}
                        margin={{
                          top: 20, right: 50, bottom: 50, left: 10,
                        }}
                    >
                      <Legend verticalAlign="top" height={36}/>
                      <XAxis dataKey="month" angle={-45} tickMargin={20}/>
                      <YAxis type="number" domain={['dataMin', 'dataMax']} unit=" tn"/>
                      <Area type="monotone" dataKey="Real" stroke="#82ca9d" fill="#82ca9d" dot={{ stroke: '#82ca9d', strokeWidth: 2 }} unit=" tn"/>
                      <Area type="monotone" dataKey="Estimado" stroke="#8884d8" fill="#8884d8" dot={{ stroke: '#8884d8', strokeWidth: 2 }} unit=" tn"/>
                      <Tooltip
                          // content={CustomTooltip}
                      />
                    </AreaChart>
                  </div>
                  <div>
                    <h3 className="text-md font-medium mb-2">Costo Promedio Mensual por Kg ($)</h3>
                    <BarChart
                        height={400}
                        width={950}
                        data={costData}
                        margin={{
                          top: 20, right: 50, bottom: 50, left: 0,
                        }}
                    >
                      <XAxis dataKey="month" angle={-45} tickMargin={20} />
                      <YAxis type="number" unit=" $" domain={["dataMin - 0.1", "auto"]}/>
                      <Bar type="monotone" dataKey="Costo promedio" stroke="#8884d8" fill="#82ca9d" label={{ position: 'top' , formatter: labelFormatterDolar}} unit=" $"/>
                      <Tooltip/>
                    </BarChart>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

  );
}
