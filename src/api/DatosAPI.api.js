import axios from "axios";
import {pathname} from "../config/config.js";

const informacionApi = axios.create({
  baseURL: pathname+"/api/v1/informacion"
})

export const getAllInformacion= async () =>{
  try {
    const response = await informacionApi.get('');
    return response.data;
  } catch (error) {
    console.error("Error fetching datos:", error);
    throw error;
  }
}

//ONE

export const getInformacion = (id) =>{
  return informacionApi.get(`/${id}`)
}

export const createOrUpdateInformacion = (id, data) =>{
  if (id>0) data["id"] = id;
  return informacionApi.post('',data);
}

const datosGeneralApi = axios.create({
  baseURL: pathname+"/api/v1/valores-extra-general"
})

export const getDatosGeneralByInformacion= async (id) =>{
  return datosGeneralApi.get(`/${id}`)
}

export const createOrUpdateDatosGeneral = (id, data) =>{
  if (id>0) data["id"] = id;
  return datosGeneralApi.post('',data);
}

export const deleteAllDatosGeneral = async (id)=>{
  return datosGeneralApi.post(`delete/${id}`)
}
