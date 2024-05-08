import {useEffect } from 'react';
import {useNavigate} from "react-router-dom";
import PropTypes from "prop-types";

export const Security = ({storageKey, setUser, storageRol}) => {
  const navigate = useNavigate()

  useEffect(() => {
    if (storageKey){
      window.addEventListener('storage', function(event) {
        if (event.key === storageKey) {
          setUser("")
          localStorage.setItem("user", "")
          navigate("/")
        }
      });
    }

  }, [storageKey, navigate, setUser]);

  useEffect(() => {
    if (storageRol){
      window.addEventListener('storage', function(event) {
        if (event.key === storageRol) {
          setUser("")
          localStorage.setItem(storageRol, "")
          navigate("/")
        }
      });
    }

  }, [storageRol, navigate, setUser]);

  return null;
};

Security.propTypes = {
  storageKey: PropTypes.string.isRequired,
  setUser: PropTypes.func.isRequired,
  storageRol:PropTypes.string.isRequired
};