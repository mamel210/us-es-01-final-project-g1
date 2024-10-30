import React, { useContext, useState, } from 'react'
import { FormLayout } from './FormLayout.jsx'
import { Input } from './Input.jsx'
import { Context } from '../store/appContext.js'
import Select from 'react-select'
import { formatDate } from '../helper/formatDate.js'
import { useNavigate } from 'react-router-dom'


export const CreatePlanForm = () => {
    const { actions, store } = useContext(Context)
    const user = JSON.parse(localStorage.getItem("user"))
    const [name, setName] = useState("")
    const [registrationDate, setRegistrationDate] = useState("") // definir formato de fechas
    const [finalizationDate, setFinalizationDate] = useState("") // definir formato de fechas
    const [quantitySession, setQuantitySession] = useState("")
    const [level, setLevel] = useState("begginer") // 'begginer', 'intermediate', 'advanced',
    const navigate = useNavigate()
    const createPlan = (e) => {
        e.preventDefault()
        const data = {
            name,
            registration_date: "12/12/12",
            finalization_date: "12/12/12",
            quantity_session: quantitySession,
            level: level
        }
        actions.createPlan(data, navigate)
        
    }
    const levelOptions = [
        { value: 'begginer', label: 'Begginer' },
        { value: 'intermediate', label: 'Intermediate' },
        { value: 'advanced', label: 'Advanced' }
    ]

    return (
        <FormLayout title={"Create your Exercise Plan"} onSubmit={createPlan} actionText={"Create Plan"}>
            <Input label="Name" id="name" value={name} onChange={(e) => setName(e.target.value)} type={"text"} />
            <Input label="Registration Date" id="registrationDate" value={formatDate(registrationDate)} onChange={(e) => setRegistrationDate(e.target.value)} type={"text"} />
            <Input label="Finalization Date" id="finalizationDate" value={formatDate(finalizationDate)} onChange={(e) => setFinalizationDate(e.target.value)} type={"text"} />
            <Input label="Quantity Sessions" id="quantitySesions" value={quantitySession} onChange={(e) => setQuantitySession(e.target.value)} type={"number"} />
            <div className='mb-3'>
                <label htmlFor={"level"} className='form-label'>
                    Level
                </label>
                <Select options={levelOptions} onChange={(data) => setLevel(data.value)} />
            </div>
        </FormLayout >
    )
}



// (name=data.get('name'),
//                             level=data.get('level'),
//                             registration_date=data.get('registration_date'),
//                             finalization_date=data.get('finalization_date'),
//                             quantity_session=data.get('quantity_session'),
//                             is_active=data.get('is_active'),
//                             user_id=current_user['user_id'])