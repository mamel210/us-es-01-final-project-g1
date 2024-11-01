import React, { useContext, useState, } from 'react'
import Select from 'react-select'
import { useNavigate } from 'react-router-dom'
import { FormLayout } from '../../component/FormLayout.jsx'
import { Input } from '../../component/Input.jsx'
import { Context } from '../../store/appContext.js'



export const EditPlanForm = () => {
    const { actions, store } = useContext(Context)
    const user = JSON.parse(localStorage.getItem("user"))
    const [name, setName] = useState(store.currentTrainingPlan.name)
    const [registrationDate, setRegistrationDate] = useState(store.currentTrainingPlan.registration_date) // definir formato de fechas
    const [finalizationDate, setFinalizationDate] = useState(store.currentTrainingPlan.finalization_date) // definir formato de fechas
    const [quantitySession, setQuantitySession] = useState(store.currentTrainingPlan.quantity_session)
    const [level, setLevel] = useState(store.currentTrainingPlan.level) // 'begginer', 'intermediate', 'advanced',
    const navigate = useNavigate()

    const onEdit = (e) => {
        e.preventDefault()
        const data = {
            name,
            registration_date: registrationDate,
            finalization_date: finalizationDate,
            quantity_session: quantitySession,
            level: level,
            is_active: store.currentTrainingPlan.is_active
        }
        actions.editPlan(data, navigate, store.currentTrainingPlan.id)
    }

    const levelOptions = [
        { value: 'begginer', label: 'Begginer' },
        { value: 'intermediate', label: 'Intermediate' },
        { value: 'advanced', label: 'Advanced' }
    ]

    return (
        <FormLayout title={"Edita tu Plan de Entrenamiento"} onSubmit={onEdit} actionText={"Edit Plan"}>
            <Input label="Name" id="name" value={name} onChange={(e) => setName(e.target.value)} type={"text"} />
            <Input label="Registration Date" id="registrationDate" value={registrationDate} onChange={(e) => setRegistrationDate(e.target.value)} type={"date"} />
            <Input label="Finalization Date" id="finalizationDate" value={finalizationDate} onChange={(e) => setFinalizationDate(e.target.value)} type={"date"} />
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

