import { useState } from "react";
import eye from '../assets/eye_show.svg'
import eyeOff from '../assets/eye_hide.svg'
import "./styles/textInput.css"

export default function TextInput({label, error, type, ...props }) {
    const [showPassword, setShowPassword] = useState(false);

    // Si el input es de tipo password, cambiar el type dinámico
    const isPassword = type === "password";
    const inputType = isPassword && showPassword ? "text" : type;

    return (
      <div className="input-group">
      <label>{label}</label>

      <div className={isPassword ? "password-wrapper" : ""}>
        <input
          type={inputType}
          className={error ? "error" : ""}
          {...props}
        />

        {isPassword && (
          <button
            type="button"
            className="toggle-password"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
          >
            {showPassword ? <img src={eyeOff} /> : <img src={eye} />}
          </button>
        )}
      </div>

      <label className="message">{error}</label>
    </div>
    );
}
