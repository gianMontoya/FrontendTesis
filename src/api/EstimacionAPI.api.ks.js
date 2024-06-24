import axios from "axios";
import {pathname} from "../config/config.js";

const ejecucionApi = axios.create({
  baseURL: pathname+"/api/v1/ejecuciones"
})

export const getAllEjecuciones= async () =>{
  try {
    const response = await ejecucionApi.get('');
    return response.data;
  } catch (error) {
    console.error("Error fetching datos:", error);
    throw error;
  }
}

export const getEjecucionesFecha= async (fecha) =>{
  try {
    const response = await ejecucionApi.get(`/${fecha}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching datos:", error);
    throw error;
  }
}

const resultadosApi = axios.create({
  baseURL: pathname+"/api/v1/demanda-estimada"
})

export const getResultados= async (idEjecucion) =>{
  try {
    const response = await resultadosApi.get(`/${idEjecucion}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching datos:", error);
    throw error;
  }
}

const infoExtraApi = axios.create({
  baseURL: pathname+"/api/v1/info-extra-ejecucion"
})

export const getInfoExtra= async (idEjecucion) =>{
  try {
    const response = await infoExtraApi.get(`/${idEjecucion}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching datos:", error);
    throw error;
  }
}