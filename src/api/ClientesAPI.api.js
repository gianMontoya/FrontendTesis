import axios from "axios";

//ALL
const clientesApi = axios.create({
  baseURL: "http://localhost:8080/api/v1/clientes"
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

//ONE
export const createOrUpdateCliente = (id, data) =>{
  if (id>0) data["id"] = id;
  return clientesApi.post('',data);
}

export const getCliente = (id) =>{
  return clientesApi.get(`/${id}`)
}