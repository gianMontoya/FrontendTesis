import {useState} from "react";
import {login} from "../api/UsuariosAPI.api.js";

// eslint-disable-next-line react/prop-types
export function Login({setUser}){
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");

  const [error, setError] = useState(false);
  const [errorCred, setErrorCred] = useState(false)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (correo==="" || contrasena===""){
      setErrorCred(false)
      setError(true);
      return;
    }else{
      setError(false);
      setErrorCred(false)
    }
    const dataLogin ={
      correo: correo,
      contrasena: contrasena
    }

    const {data} = await login(dataLogin);
    if (data.login){
      localStorage.setItem('user', correo);
      localStorage.setItem('idRol', data.idRol);
      setUser(correo);
    }else{
      setErrorCred(true)
    }
  }

  return (
      <div className="flex items-center justify-center h-screen">
        <section
            className="container mx-auto max-w-sm p-4 bg-gray-100 rounded-lg shadow-md ">
          <h1 className="text-3xl font-bold text-center text-dark-purple mb-6">Iniciar Sesión</h1>
          <form className="login-form" onSubmit={handleSubmit}>
            <label className="block text-sm font-medium text-gray-700 mb-2">Correo electrónico</label>
            <input
                type="email"
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:dark-purple"
                onChange={(e) => setCorreo(e.target.value)}
                autoComplete="email"
            />
            <label className="block text-sm font-medium text-gray-700 mt-4 mb-2">Contraseña</label>
            <input
                type="password"
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:dark-purple"
                onChange={(e) => setContrasena(e.target.value)}
                autoComplete="current-password"
            />
            <button
                type="submit"
                className="w-full py-2 px-4 mt-6 bg-dark-purple text-white font-medium rounded-md hover:bg-bg-dark-purple focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-dark-blue"
            >
              Iniciar Sesión
            </button>
          </form>
          {error && <p className="text-red-500 text-center mt-4">Todos los campos son obligatorios</p>}
          {errorCred && <p className="text-red-500 text-center mt-4">Credenciales Incorrectas</p>}

        </section>
      </div>
  )
}