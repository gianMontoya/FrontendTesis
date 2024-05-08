import axios from "axios";
import {pathname} from "../config/config.js";

//ALL
const insumosApi = axios.create({
    baseURL: pathname+"api/v1/insumos"
})

export const getAllInsumos = async () =>{
    try {
        const response = await insumosApi.get('');
        return response.data;
    } catch (error) {
        console.error("Error fetching insumos:", error);
        throw error;
    }
}

export const getAllInsumosActivos = async () =>{
    try {
        const response = await insumosApi.get('/activos');
        return response.data;
    } catch (error) {
        console.error("Error fetching insumos:", error);
        throw error;
    }
}

export const getAllInsumosByNombre = async (nombre) =>{
    try {
        const response = await insumosApi.get(`/nombre/${nombre}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching insumos:", error);
        throw error;
    }
}

//ONE

export const createOrUpdateInsumo = (id, data) =>{
    if (id>0) data["id"] = id;
    return insumosApi.post('',data);
}

export const getInsumo = (id) =>{
    return insumosApi.get(`/${id}`)
}

export const deleteInsumo = (id) =>{
    return insumosApi.delete(`/${id}`);
}