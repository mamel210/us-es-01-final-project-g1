import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext.js";
import { FormLayout } from "../component/FormLayout.jsx";
import { Input } from "../component/Input.jsx";
import { BannerMessage } from "../component/BannerMessage.jsx";

export const Register = () => {
    const { store, actions } = useContext(Context)
    console.log("ADENTRO DE REGISTER", store.error)
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("")
    const [name, setName] = useState('')
    const [age, setAge] = useState('')
    const [weight, setWeight] = useState('')
    const [height, setHeight] = useState('')
    const [targetWeight, setTargetWeight] = useState('')
    const navigate = useNavigate()
    const handleRegister = (e) => {
        e.preventDefault()
        const data = {
            email, password, name, age, weight, height, "target_weight": targetWeight
        }
        actions.register(data, navigate)
    }
    return (
        <FormLayout title={'Registrate'} onSubmit={handleRegister} actionText={'Registrar'} customMessage={<BannerMessage evaluation={store.errorMessage} message={store.message} />} > <div className="row">
            <div className="col-6">
                <Input label="Email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} type={"text"} />
                <Input label="Password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} type={"password"} />
                <Input label="Name" id="name" value={name} onChange={(e) => setName(e.target.value)} type={"text"} />
                <Input label="Age" id="age" value={age} onChange={(e) => setAge(e.target.value)} type={"text"} />
            </div>
            <div className="col-6">
                <Input label="Weight" id="age" value={weight} onChange={(e) => setWeight(e.target.value)} type={"text"} />
                <Input label="Height" id="height" value={height} onChange={(e) => setHeight(e.target.value)} type={"text"} />
                <Input label="Target Weight" id="targetWeight" value={targetWeight} onChange={(e) => setTargetWeight(e.target.value)} type={"text"} />
            </div>
        </div>
        </FormLayout>
    )
}
