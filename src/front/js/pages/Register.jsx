import React, { useContext, useState } from "react";
import { Context } from "../store/appContext.js";
import { FormLayout } from "../component/FormLayout.jsx";
import { Input } from "../component/Input.jsx";

export const Register = () => {
    const { store, actions } = useContext(Context)
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("")
    const [name, setName] = useState('')
    const [age, setAge] = useState('')
    const [weight, setWeight] = useState('')
    const [height, setHeight] = useState('')
    const [targetWeight, setTargetWeight] = useState('')
    const handleRegister = (e) => {
        e.preventDefault()
        const data = {
            email, password, name, age, weight, height, "target_weight": targetWeight
        }
        actions.register(data)
    }
    return (
        <FormLayout title={'Registrate'} onSubmit={handleRegister} actionText={'Registrar'}>
            <Input label="Email" id="email" value={email} onChange={(e) => setEmail(e.target.value)}  type={"text"}/>
            <Input label="Password" id="password" value={password} onChange={(e) => setPassword(e.target.value)}  type={"password"}/>
            <Input label="Name" id="name" value={name} onChange={(e) => setName(e.target.value)}  type={"text"}/>
            <Input label="Age" id="age" value={age} onChange={(e) => setAge(e.target.value)}  type={"text"}/>
            <Input label="Weight" id="age" value={weight} onChange={(e) => setWeight(e.target.value)}  type={"text"}/>
            <Input label="Height" id="height" value={height} onChange={(e) => setHeight(e.target.value)}  type={"text"}/>
            <Input label="Target Weight" id="targetWeight" value={targetWeight} onChange={(e) => setTargetWeight(e.target.value)}  type={"text"}/>
        </FormLayout>
    )
}




