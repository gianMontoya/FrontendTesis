import axios from "axios";
import {pathname} from "../config/config.js";

//ALL
const usuariosApi = axios.create({
  baseURL: pathname+"/api/v1/usuarios"
})

export const getAllUsuarios = async () =>{
  try {
    const response = await usuariosApi.get('');
    return response.data;
  } catch (error) {
    console.error("Error fetching usuarios:", error);
    throw error;
  }
}

export const getAllUsuariosByName = async (value) =>{
  try {
    const response = await usuariosApi.get(`/nombre/${value}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching usuarios:", error);
    throw error;
  }
}

export const getAllUsuariosActivos = async () =>{
  try {
    const response = await usuariosApi.get('/activos');
    return response.data;
  } catch (error) {
    console.error("Error fetching usuarios:", error);
    throw error;
  }
}

//ONE

export const login = async(data)=>{
  return usuariosApi.post(`/login`,data)
}

export const createOrUpdateUsuario = (id, data) =>{
  if (id>0) data["id"] = id;
  if (data["contrasena"]==null) data["contrasena"] = "";
  return usuariosApi.post('',data);
}

export const savePassword = (data) =>{
  return usuariosApi.post('/password',data);
}

export const getUsuario = (id) =>{
  return usuariosApi.get(`/${id}`)
}

export const deleteUsuario = (id) =>{
  return usuariosApi.delete(`/${id}`);
}

const rolesApi = axios.create({
  baseURL: pathname+"/api/v1/roles"
})

//ROLES
export const getAllRoles = async () =>{
  try {
    const response = await rolesApi.get('');
    return response.data;
  } catch (error) {
    console.error("Error fetching roles:", error);
    throw error;
  }
}



// const permisosApi = axios.create({
//   baseURL: "http://localhost:8080/api/v1/permisos"
// })

// //PERMISOS
// export const getPermisoFidUsuario =  (idUsuario) =>{
//   return permisosApi.get(`/${idUsuario}`)
// }