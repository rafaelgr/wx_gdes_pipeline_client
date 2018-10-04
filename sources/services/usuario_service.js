import { cookieApi } from "../utilities/cookies";
import { devConfig } from "../config/config";
export const usuarioService = {
    // getUsuarioCookie
    // Obtains usuario infor information from its cookie if there isn't
    // an usuario cookie returns null
    getUsuarioCookie: () => {
        var usuario = cookieApi.getCookie('gdes_pipeline_usuario');
        if (!usuario) return null;
        return JSON.parse(usuario);
    },
    // setUsuarioCookie
    // Saves usuario's information in a cookie
    setUsuarioCookie: (usuario) => {
        cookieApi.setCookie('gdes_pipeline_usuario', JSON.stringify(usuario), 1);
    },
    // getUsuario
    getUsuarios: () => {
        var url = devConfig.getApiUrl() + "/api/usuarios";
        
    }
}