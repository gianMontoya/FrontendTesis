import axios from "axios";

//ALL
const proveedoresApi = axios.create({
  baseURL: "http://localhost:8080/api/v1/proveedores"
})

export const getAllProveedores= async () =>{
  try {
    const response = await proveedoresApi.get('');
    return response.data;
  } catch (error) {
    console.error("Error fetching proveedores:", error);
    throw error;
  }
}

export const getAllProveedoresActivos= async () =>{
  try {
    const response = await proveedoresApi.get('/activos');
    return response.data;
  } catch (error) {
    console.error("Error fetching proveedores:", error);
    throw error;
  }
}

//ONE
export const createOrUpdateProveedor = (id, data) =>{
  if (id>0) data["id"] = id;
  return proveedoresApi.post('',data);
}

export const getProveedor = (id) =>{
  return proveedoresApi.get(`/${id}`)
}

export const deleteProveedor = (id) =>{
  return proveedoresApi.delete(`/${id}`);
}