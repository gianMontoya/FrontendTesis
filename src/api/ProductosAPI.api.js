import axios from "axios";
import {pathname} from "../config/config.js";

//ALL
const productosApi = axios.create({
    baseURL: pathname+"/api/v1/productos"
})

export const getAllProductos = async () =>{
    try {
        const response = await productosApi.get('');
        return response.data;
    } catch (error) {
        console.error("Error fetching insumos:", error);
        throw error;
    }
}

//ONE
export const createOrUpdateProducto = (id, data) =>{
    if (id>0) data["id"] = id;
    return productosApi.post('', data)
}

export const getProducto = (id) =>{
    return productosApi.get(`/${id}`)
}

export const getProductoByNombre = async (nombre) =>{
    try {
        const response = await productosApi.get(`/nombre/${nombre}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching insumos:", error);
        throw error;
    }
}

export const deleteProducto = (id) =>{
    return productosApi.delete(`/${id}`);
}

const insumosProductoApi = axios.create({
    baseURL: pathname+"/api/v1/insumo-producto"
})

//INSUMOS_PRODUCTO
export const createOrUpdateInsumosProducto = (list) =>{
    return insumosProductoApi.post('', list)
}