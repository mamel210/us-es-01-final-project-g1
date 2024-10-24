import React, { useContext, useState } from "react";
import { Context } from "../store/appContext.js";
import { Link } from "react-router-dom";
import { FormLayout } from "../component/FormLayout.jsx";

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
                    Password
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
            <div className='mb-3'>
                <label htmlFor='password' className='form-label'>
                    Name
                </label>
                <input
                    type='password'
                    className='form-control'
                    id='password'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </div>
            <div className='mb-3'>
                <label htmlFor='password' className='form-label'>
                    Age
                </label>
                <input
                    type='password'
                    className='form-control'
                    id='password'
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    required
                />
            </div>
            <div className='mb-3'>
                <label htmlFor='password' className='form-label'>
                    Weight
                </label>
                <input
                    type='password'
                    className='form-control'
                    id='password'
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    required
                />
            </div>
            <div className='mb-3'>
                <label htmlFor='password' className='form-label'>
                    Height
                </label>
                <input
                    type='password'
                    className='form-control'
                    id='password'
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    required
                />
            </div>
            <div className='mb-3'>
                <label htmlFor='password' className='form-label'>
                    Target Weight
                </label>
                <input
                    type='password'
                    className='form-control'
                    id='password'
                    value={targetWeight}
                    onChange={(e) => setTargetWeight(e.target.value)}
                    required
                />
            </div>
        </FormLayout>
    )
}




