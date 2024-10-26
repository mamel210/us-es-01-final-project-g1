import React, { useContext, useState } from "react"
import { Context } from "../store/appContext.js";
import { FormLayout } from "../component/FormLayout.jsx";
import { Input } from "../component/Input.jsx";
import { useNavigate } from "react-router-dom";
import { RegisterMessage } from "../component/RegisterMessage.jsx";


export const Login = () => {
  const { store, actions } = useContext(Context);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

  const handleSubmit = (event) => {
    event.preventDefault()
    const data = { email, password }
    actions.login(data, navigate )
  };

  return (
    <FormLayout customMessage={<RegisterMessage/>} title={'Inicie Sesion'} onSubmit={handleSubmit} actionText={'Iniciar Sesion'} adionalActionText={"Registrate"} adionalActionPath={'/register'} adionalActionHint={'¿No tienes una cuenta?'}>
      <Input label="Email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} type={"text"} />
      <Input label="Password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} type={"password"} />
    </FormLayout>
  );
};
