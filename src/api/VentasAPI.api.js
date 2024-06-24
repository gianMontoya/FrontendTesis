import axios from "axios";
import {pathname} from "../config/config.js";

//ALL
const ventasApi = axios.create({
  baseURL: pathname+"/api/v1/ventas"
})

const lineasVentaApi = axios.create({
  baseURL: pathname+"/api/v1/linea-orden-venta"
})

export const getAllVentas= async () =>{
  try {
    const response = await ventasApi.get('');
    return response.data;
  } catch (error) {
    console.error("Error fetching ventas:", error);
    throw error;
  }
}

export const getAllVentasFilterDate= async (from, to) =>{
  try {
    const response = await ventasApi.get(`/${from}/${to}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching ventas:", error);
    throw error;
  }
}

export const getAllVentasMensualesPorProducto= async (idProd) =>{
  try {
    const response = await ventasApi.get(`/mensual/${idProd}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching ventas:", error);
    throw error;
  }
}



//ONE
export const createOrUpdateVentas = (id, data) =>{
  if (id>0) data["id"] = id;
  return ventasApi.post('',data);
}

export const getVenta = (id) =>{
  return ventasApi.get(`/${id}`)
}

//LINEAS-ORDEN

export const createLineaOrdenVenta = (list) =>{
  return lineasVentaApi.post('', list)
}

export const getLineaOrdenVenta = (id) =>{
  return lineasVentaApi.get(`/${id}`);
}

