import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext.js";
import { FormLayout } from "../component/FormLayout.jsx";
import { Input } from "../component/Input.jsx";
import { BannerMessage } from "../component/BannerMessage.jsx";


export const Register = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("")
    const [name, setName] = useState('')
    const [age, setAge] = useState('')
    const [weight, setWeight] = useState('')
    const [height, setHeight] = useState('')
    const [targetWeight, setTargetWeight] = useState('')

    const [errors, setErrors] = useState({});

    const { store, actions } = useContext(Context)
    const navigate = useNavigate()

    const validate = () => {
        const newErrors = {}

        if (!email) newErrors.email = "Email must exist"
        if (!password) newErrors.password = "Password must exist"
        if (!name) newErrors.name = "name must exist"
        if (!age) newErrors.age = "Age must exist"
        if (!weight) newErrors.weight = "Weight must exist"
        if (!height) newErrors.height = "Height must exist"
        if (!targetWeight) newErrors.targetWeight = "Target Weight must exist"

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleRegister = (e) => {
        e.preventDefault()

        if (!validate()) return;

        const data = {
            email, password, name, age, weight, height, "target_weight": targetWeight
        }
        actions.register(data, navigate)
    }
    return (
        <FormLayout isLoading={store.isLoginLoading} customWidth={"600px"} title={'Registrate'} onSubmit={handleRegister} actionText={'Registrar'} customMessage={<BannerMessage evaluation={store.errorMessage} message={store.message} />} >
            <div className="row">
                <div className="col-6">
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
                    <Input
                        label="Name"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        type={"text"}
                        isInvalid={!!errors.name}
                        errorMessage={errors.name}
                    />
                    <Input
                        label="Age"
                        id="age"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        type={"text"}
                        isInvalid={!!errors.age}
                        errorMessage={errors.age}
                    />
                </div>
                <div className="col-6">
                    <Input
                        label="Weight"
                        id="weight"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        type={"text"}
                        isInvalid={!!errors.weight}
                        errorMessage={errors.weight}
                    />
                    <Input
                        label="Height"
                        id="height"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                        type={"text"}
                        isInvalid={!!errors.height}
                        errorMessage={errors.height}
                    />
                    <Input
                        label="Target Weight"
                        id="targetWeight"
                        value={targetWeight}
                        onChange={(e) => setTargetWeight(e.target.value)}
                        type={"text"}
                        isInvalid={!!errors.targetWeight}
                        errorMessage={errors.targetWeight}
                    />
                </div>
            </div>
        </FormLayout>
    )
}
