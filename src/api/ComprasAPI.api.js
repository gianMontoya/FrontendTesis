import axios from "axios";

//ALL
const comprasApi = axios.create({
  baseURL: "http://localhost:8080/api/v1/compras"
})

const lineasCompraApi = axios.create({
  baseURL: "http://localhost:8080/api/v1/linea-orden-compra"
})

export const getAllCompras= async () =>{
  try {
    const response = await comprasApi.get('');
    return response.data;
  } catch (error) {
    console.error("Error fetching compras:", error);
    throw error;
  }
}

export const getAllComprasFilterDate= async (from, to) =>{
  try {
    const response = await comprasApi.get(`/${from}/${to}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching compras:", error);
    throw error;
  }
}

//ONE
export const createOrUpdateCompras = (id, data) =>{
  if (id>0) data["id"] = id;
  return comprasApi.post('',data);
}

export const getCompra = (id) =>{
  return comprasApi.get(`/${id}`)
}

//LINEAS-ORDEN

export const createLineaOrdenCompra = (list) =>{
  return lineasCompraApi.post('', list)
}

export const getLineaOrdenCompra = (id) =>{
  return lineasCompraApi.get(`/${id}`);
}