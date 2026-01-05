export default function normalizeError(error) {
    /* 
        Status	    Significado	            Uso

        200	        OK	                    La petición fue exitosa. Devuelve datos y listo.
        400	        Bad Request	            Validaciones del lado del backend (campos vacíos, formato incorrecto). Aquí devuelves errores por campo.
        401	        Unauthorized	        Login fallido: usuario o contraseña incorrectos.
        403	        Forbidden	            El usuario no tiene permiso para esta acción.
        409	        Conflict	            Algo ya existe: email duplicado, categoría duplicada, etc.
        500	        Internal Server Error	Error del servidor, no del usuario.
        (otros)	    …	                    Puedes usar otros según la situación.
    */

    if (!error.response) {
        return {
            type: "NETWORK",
            message: "No se pudo conectar con el servidor"
        };
    }

    const { status, data } = error.response;

    switch(status){
        case 400:
            if(Array.isArray(data.error)){
                const fieldErrors = {};

                data.error.forEach(err => {
                    const field = err.path?.[0];
                    if (field && !fieldErrors[field]) {
                        fieldErrors[field] = err.message;
                    }
                });

                return {
                    type: "VALIDATION",
                    errors: fieldErrors
                };
            }

            return {
                type: "VALIDATION",
                message: data.message || "Datos no validos"
            };
            
        
        case 401:
            return {
                type: "AUTH",
                message: data.message || "Usuario o contraseña incorrectos"
            };

        case 409:
            const conflictMessages = {
                EMAIL_DUPLICATED: {
                    field: "email",
                    message: "El correo ya está registrado", 
                },
                USERNAME_DUPLICATED: {
                    field: "username",
                    message:"El nombre de usuario ya existe"
                },
                CATEGORY_DUPLICATED: {
                    field: "categoria",
                    message: "La categoría ya existe"
                },
                PRODUCT_DUPLICATED: {
                    field: "articulo",
                    message: "El artículo ya existe"
                },
                CATEGORY_DUPLICATED: {
                    field: "nombre_categoria",
                    message: "La categoria ya existe"
                }
            };

            const duplicated = conflictMessages[data.code];
            if(duplicated) {
                return {
                    type: "ER_DUP_ENTRY",
                    errors: {
                        [duplicated.field]: duplicated.message
                    }
                };
            }
            return {
                type: "VALIDATION",
                message: "El registro ya existe"
            };
        
        case 500:
            return {
                type: "SERVER",
                message: data.message || "Error interno del servidor"
            };

        default:
            return {
                type: "UNKNOWN",
                message: "Ocurrió un error inesperado"
            };
    }
}


