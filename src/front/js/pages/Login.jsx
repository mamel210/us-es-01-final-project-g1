import React, { useContext, useState } from "react"
import { Context } from "../store/appContext.js";
import { FormLayout } from "../component/FormLayout.jsx";


export const Login = () => {
  const { store, actions } = useContext(Context);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("")
  const handleSubmit = (event) => {
    event.preventDefault()
    const data = { email, password }
    actions.login(data)

  };

  return (
    <FormLayout title={'Inicie Sesion'} onSubmit={handleSubmit} actionText={'Iniciar Sesion'} adionalActionText={"Registrate"} adionalActionPath={'/register'} adionalActionHint={'¿No tienes una cuenta?'}>
      <div className='mb-3'>
        <label htmlFor='email' className='form-label'>
          Email
        </label>
        <input
          type='email'
          className='form-control'
          id='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className='mb-3'>
        <label htmlFor='password' className='form-label'>
          Contraseña
        </label>
        <input
          type='password'
          className='form-control'
          id='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
    </FormLayout>
  );
};
