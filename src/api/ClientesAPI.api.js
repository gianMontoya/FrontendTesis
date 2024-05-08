import axios from "axios";
import {pathname} from "../config/config.js";

//ALL
const clientesApi = axios.create({
  baseURL: pathname+"/api/v1/clientes"
})

export const getAllClientes= async () =>{
  try {
    const response = await clientesApi.get('');
    return response.data;
  } catch (error) {
    console.error("Error fetching clientes:", error);
    throw error;
  }
}

export const getAllClientesByName= async (name) =>{
  try {
    const response = await clientesApi.get(`/nombre/${name}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching clientes:", error);
    throw error;
  }
}

//ONE
export const createOrUpdateCliente = (id, data) =>{
  if (id>0) data["id"] = id;
  return clientesApi.post('',data);
}

export const getCliente = (id) =>{
  return clientesApi.get(`/${id}`)
}

export const deleteCliente = (id) =>{
  return clientesApi.delete(`/${id}`);
}