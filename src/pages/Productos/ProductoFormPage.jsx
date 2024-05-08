import { Sidebar } from '../../components/Sidebar.jsx'
import { useForm} from "react-hook-form"
import { useNavigate, useParams} from "react-router-dom"
import {useEffect, useState} from "react";
import { toast} from 'react-hot-toast'
import {createOrUpdateProducto, getProducto, createOrUpdateInsumosProducto} from "../../api/ProductosAPI.api.js";
import {getAllInsumosActivos} from "../../api/InsumosAPI.api.js";

// eslint-disable-next-line react/prop-types
export function ProductoFormPage({setUser}) {

    const navigate = useNavigate()
    const params = useParams()
    const {register, handleSubmit, formState:{errors}, setValue} = useForm()
    const [insumosProducto, setInsumosProducto] = useState([])
    const [insumos, setInsumos] = useState([])
    const [extraRows, setExtraRows] = useState(0)
    const [active, setActive] = useState(false)

    const addRowInsumo = () =>{
        setExtraRows(extraRows+1)
    }

    useEffect(() => {
        async function loadProducto() {
            if (params.id) {
                const {data} = await getProducto(params.id);
                setValue('nombreProducto', data.nombreProducto)
                setValue('pesoRollo', data.pesoRollo)
                setValue('descripcion', data.descripcion)
                setActive(data.activo)
                setInsumosProducto(data.insumosProducto)
            }
            const list = await getAllInsumosActivos();
            setInsumos(list)
        }

        loadProducto();
        //eslint-disable-next-line
    }, []);

    const onSubmit = handleSubmit(async data=>{
        const table = document.getElementById('table-insumos');
        const rows = await table.rows;
        let insumosProductoList = []
        for (let j=1 ; j < rows.length; j++) {
            const currentRow = rows[j];
            const inputElement = currentRow.querySelector('td input')
            const selectElement = currentRow.querySelector('td select')

            if (isNaN(parseInt(selectElement.value))){
                toast.error(`No existen insumos activos actualmente. Verifique en la sección "Insumos"`,{
                    position: "top-right",
                    style: {
                        background:"#101010",
                        color: "#fff"
                    }
                })
                return;
            }

            const insumoProductoValues = {
                fidInsumo: parseInt(selectElement.value),
                cantidad1kilo: parseFloat(inputElement.value)
            }
            insumosProductoList.push(insumoProductoValues);
        }
        const newData = {
            nombreProducto: data.nombreProducto,
            descripcion: data.descripcion,
            pesoRollo: data.pesoRollo,
            activo: active,
        }
        let result

        result = await createOrUpdateProducto(params.id?params.id:0, newData)

        const prodId = result.data.id;

        insumosProductoList= insumosProductoList.map((insumo)=>({...insumo, fidProducto: prodId}))

        await createOrUpdateInsumosProducto(insumosProductoList)

        toast.success(`Producto ${params.id?"actualizado":"creado"} correctamente`,{
            position: "top-right",
            style: {
                background:"#101010",
                color: "#fff"
            }
        })

        navigate("/productos")
    })

    return (
        <div className="flex">
            <Sidebar setUser={setUser}/>
            <div className="w-4/6 mx-auto">
                <div className="mt-10 mb-0 font-extrabold text-4xl">
                    {(params.id?"Editar ":"Crear ")+"Producto"}
                </div>
                <form onSubmit={onSubmit}>
                    <div className="flex justify-end">
                        <button className="bg-dark-purple p-3 w-1/6 rounded-lg block mt-0 text-white" type="submit">
                            Guardar
                        </button>
                    </div>

                    <label className="block text-zinc-500 mt-0">Nombre
                        <input
                            className="bg-zinc-100 text-sm p-2 w-2/6 border border-stone-500 block rounded-lg mt-3 placeholder:italic placeholder:text-zinc"
                            type="text"
                            placeholder="Nombre" {...register("nombreProducto", {required: true})}/> {errors.nombreProducto &&
                            <span className="text-red-500 text-xs">*Obligatorio</span>}
                    </label>
                    <label className="block text-zinc-500 mt-4">Peso por Rollo (Kg)
                        <input
                            className="bg-zinc-100 text-sm p-2 w-2/6 border border-stone-500 block rounded-lg mt-3 placeholder:italic placeholder:text-zinc"
                            type="number" placeholder="Peso"
                            step="0.01" {...register("pesoRollo", {required: true})}/> {errors.pesoRollo &&
                            <span className="text-red-500 text-xs">*Obligatorio</span>}
                    </label>
                    <label className="block text-zinc-500 mt-4">Descripción
                        <textarea
                            className="bg-zinc-100 text-sm p-2 w-5/6 border border-stone-500 block rounded-lg mt-3 placeholder:italic placeholder:text-zinc"
                            rows="2"
                            placeholder="Descripción" {...register("descripcion", {required: true})}/> {errors.descripcion &&
                            <span className="text-red-500 text-xs">*Obligatorio</span>}
                    </label>
                    <label className="inline-flex items-center cursor-pointer mt-4">
                        <span className="text-zinc-500 dark:text-zinc-500">Activo</span>
                        <input type="checkbox" checked={active} className="sr-only peer ml-3"
                               onChange={(event) => setActive(event.target.checked)}/>
                        <div className="ml-3 relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                    <label className="block text-zinc-500 mt-4">
                        Componenentes
                    </label>

                    <div className="flex w-full">
                        <div className="w-5/6 mt-1 h-[220px] overflow-y-auto">
                            <table className="w-full" id="table-insumos">
                                <thead className="bg-grat-50 border-b-2 border-gray-200">
                                    <tr>
                                        <th className='p-2 text-l font-semibold tracking-wide text-left'>Insumo</th>
                                        <th className='p-2 text-l font-semibold tracking-wide text-left'>Cantidad para 1Kg de Producto</th>
                                        <th className='p-2 text-l font-semibold tracking-wide text-left'>Borrar</th>
                                    </tr>
                                </thead>
                                <tbody className="h-1.5">
                                {insumosProducto && insumosProducto.length > 0 ? (
                                    <>
                                        {insumosProducto.map((insumoProducto, index) => (
                                            <tr key={index}
                                                className="bg-zinc-100 p-2 rounded-lg odd:bg-white even:bg-slate-50">
                                                <td className='p-2 text-gray-700'>
                                                    <select
                                                        className="bg-zinc-100 text-sm p-2 w-full border border-stone-500 block rounded-lg placeholder:italic placeholder:text-zinc"
                                                    >
                                                        {insumos.map((item, index) => (
                                                            <option key={index} value={item.id} selected={insumoProducto.fidInsumo === item.id}>
                                                                {item.nombreInsumo}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </td>
                                                <td className='p-2 text-gray-700 flex'>
                                                    <input
                                                        className="bg-zinc-100 text-sm p-2 w-3/12 min-w-[62px] border border-stone-500 block rounded-lg placeholder:italic placeholder:text-zinc"
                                                        type="number" placeholder="Kg"
                                                        step="0.01"
                                                        defaultValue={insumoProducto.cantidad1kilo}
                                                        min={0.01}/>
                                                    <span className="flex items-center ml-4">Kg</span>
                                                </td>
                                                {index > 0 ? (
                                                    <td className='justify-center align-middle'>
                                                        <button
                                                            className={"bg-red-500 text-white rounded-full w-[30px] h-[30px]"}
                                                            type="button"
                                                            onClick={(event) => {
                                                                const table = document.getElementById('table-insumos');
                                                                table.deleteRow(event.target.parentNode.parentNode.rowIndex);
                                                            }}
                                                        >
                                                            {" - "}
                                                        </button>
                                                    </td>
                                                ) : (<td></td>)}
                                            </tr>
                                        ))}
                                        {extraRows > 0 && Array(extraRows).fill(null).map((item, index) => (
                                            <tr key={index}
                                                className="bg-zinc-100 p-2  rounded-lg odd:bg-white even:bg-slate-50">
                                                <td className='p-2 text-gray-700'>
                                                    <select
                                                        className="bg-zinc-100 text-sm p-2 w-full border border-stone-500 block rounded-lg mt-1 placeholder:italic placeholder:text-zinc"
                                                    >
                                                        {insumos.map((item, index) => (
                                                            <option key={index} value={item.id}>
                                                                {item.nombreInsumo}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </td>
                                                <td className='p-2 text-gray-700 flex'>
                                                    <input
                                                        className="bg-zinc-100 text-sm p-2 w-3/12 min-w-[62px] border border-stone-500 block rounded-lg mt-1 placeholder:italic placeholder:text-zinc"
                                                        type="number" placeholder="Kg"
                                                        step="0.01" min={0.01}
                                                        defaultValue={0}
                                                    />
                                                    <span className="flex items-center ml-4">Kg</span>
                                                </td>
                                                <td>
                                                    <button
                                                        className={"bg-red-500 text-white rounded-full w-[30px] h-[30px]"}
                                                        type="button"
                                                        onClick={(event) => {
                                                            const table = document.getElementById('table-insumos');
                                                            table.deleteRow(event.target.parentNode.parentNode.rowIndex);
                                                        }}
                                                    >
                                                        {" - "}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </>
                                ) : (
                                    <>
                                        <tr className="bg-zinc-100 p-2  rounded-lg odd:bg-white even:bg-slate-50">
                                            <td className='p-2 text-gray-700'>
                                                <select
                                                    className="bg-zinc-100 text-sm p-2 w-full border border-stone-500 block rounded-lg mt-1 placeholder:italic placeholder:text-zinc"
                                                >
                                                    {insumos.map((item, index) => (
                                                        <option key={index} value={item.id}>
                                                            {item.nombreInsumo}
                                                        </option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td className='p-2 text-gray-700 flex'>
                                                <input
                                                    className="bg-zinc-100 text-sm p-2 w-3/12 min-w-[62px] border border-stone-500 block rounded-lg mt-1 placeholder:italic placeholder:text-zinc"
                                                    type="number" placeholder="Kg"
                                                    step="0.01"
                                                    defaultValue={0}
                                                    min={0.01}
                                                />
                                                <span className="flex items-center ml-4">Kg</span>
                                            </td>
                                        </tr>
                                        {extraRows > 0 && Array(extraRows).fill(null).map((value, index) => (
                                            <tr key={index}
                                                className="bg-zinc-100 p-2  rounded-lg odd:bg-white even:bg-slate-50">
                                                <td className='p-2 text-gray-700'>
                                                    <select
                                                        className="bg-zinc-100 text-sm p-2 w-full border border-stone-500 block rounded-lg mt-1 placeholder:italic placeholder:text-zinc"
                                                    >
                                                        {insumos.map((item, index) => (
                                                            <option key={index} value={item.id}>
                                                                {item.nombreInsumo}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </td>
                                                <td className='p-2 text-gray-700 flex'>
                                                    <input
                                                        className="bg-zinc-100 text-sm p-2 w-3/12 min-w-[62px] border border-stone-500 block rounded-lg mt-1 placeholder:italic placeholder:text-zinc"
                                                        type="number" placeholder="Kg"
                                                        step="0.01"
                                                        defaultValue={0}
                                                        min={0.01}/>
                                                    <span className="flex items-center ml-4">Kg</span>
                                                </td>
                                                <td>
                                                    <button
                                                        className={"bg-red-500 text-white rounded-full w-[30px] h-[30px]"}
                                                        type="button"
                                                        onClick={(event) => {
                                                            const table = document.getElementById('table-insumos');
                                                            table.deleteRow(event.target.parentNode.parentNode.rowIndex);
                                                        }}
                                                    >
                                                        {" - "}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </>
                                )}
                                </tbody>
                            </table>
                        </div>
                        <div className="w-1/6 justify-center ml-5">
                            <button
                                className="bg-dark-purple p-2 w-full rounded-lg block mt-3 mb-3 text-white"
                                onClick={addRowInsumo}
                                type="button"
                            >
                                + Agregar Insumo
                            </button>
                        </div>
                    </div>
                </form>
            </div>

        </div>
    )
}