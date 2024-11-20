import React, { useContext, useState } from "react"
import { Context } from "../store/appContext.js";
import { FormLayout } from "../component/FormLayout.jsx";
import { Input } from "../component/Input.jsx";
import { useNavigate } from "react-router-dom";
import { BannerMessage } from "../component/BannerMessage.jsx";


export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState("")

  const { store, actions } = useContext(Context);
  const navigate = useNavigate()

  const validate = () => {
    const newErrors = {}
    if (!email) newErrors.email = "email must exist"
    if (!password) newErrors.password = "password must exist"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!validate()) return
    const data = { email, password }
    actions.login(data, navigate)
  };

  return (
    <FormLayout isLoading={store.isLoginLoading} customMessage={<BannerMessage evaluation={store.errorMessage} message={store.message} />} title={'Log In'} onSubmit={handleSubmit} actionText={'Start!'} adionalActionText={"Register"} adionalActionPath={'/register'} adionalActionHint={"Don't have an account?"} aditionalCallback={() => actions.resetState()}>
      <Input
        label="Email"
        id="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        type={"text"}
        isInvalid={!!errors.email}
        errorMessage={errors.email}
      />
      <Input
        label="Password"
        id="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type={"password"}
        isInvalid={!!errors.password}
        errorMessage={errors.password}
      />
    </FormLayout>
  );
};
