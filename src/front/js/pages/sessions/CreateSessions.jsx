import React, { useContext, useState, } from 'react'
import Select from 'react-select'
import { useNavigate } from 'react-router-dom'
import { FormLayout } from '../../component/FormLayout.jsx'
import { Input } from '../../component/Input.jsx'
import { Context } from '../../store/appContext.js'
import { BannerMessage } from '../../component/BannerMessage.jsx'


export const CreateSessions = () => {
  const [name, setName] = useState("")
  const [date, setDate] = useState("")
  const [trainingPlan, setTrainingPlan] = useState("")
  const [errors, setErrors] = useState({})

  const { actions, store } = useContext(Context)
  const navigate = useNavigate()

  const userFromLocalStorage = JSON.parse(localStorage.getItem("user"))

  const _trainingPlans = store?.trainingPlansStates?.trainingPlans
    ?.filter(plan => plan.current_sessions < plan.quantity_session && plan.status === "active")
    ?.map(plan => ({
      label: `${plan.name} (${plan.current_sessions}/${plan.quantity_session})`,
      value: plan.id,
      registrationDate: new Date(plan.registration_date),
      finalizationDate: new Date(plan.finalization_date),
      currentSessions: plan.current_sessions,
      quantitySession: plan.quantity_session
    }));


  const hasAvailablePlans = _trainingPlans && _trainingPlans.length > 0

  const validate = () => {
    const newErrors = {}

    if (!name) newErrors.name = "Name must exist"
    if (!date) newErrors.date = "Date must exist"
    if (!trainingPlan) newErrors.trainingPlan = "Must select a training plan"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const createSession = (e) => {
    e.preventDefault()
    if (!validate()) return
    const formData = {
      date,
      name,
      training_plan_id: trainingPlan,
      user_id: store.user.id ?? userFromLocalStorage.id
    }
    actions.createSessions({ formData, navigate })
  }

  return (
    <FormLayout
      isLoading={store.sessionsStates.isSessionsLoading}
      title={"Create your Session"}
      onSubmit={createSession}
      actionText={"Create Session"}
      goBackOnClick={() => navigate("/sessions")}
      customMessage={<BannerMessage evaluation={store.errorMessage} message={store.errorMessage} />}
    >
      <Input
        label="Session Name"
        id="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        type={"text"}
        isInvalid={!!errors.name}
        errorMessage={errors.name}
      />
      <Input
        label="Date"
        id="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        type={"date"}
        isInvalid={!!errors.date}
        errorMessage={errors.date}
      />
      <div className='mb-3'>
        <label htmlFor={"level"} className='form-label'>
          Training Plans
        </label>
        {hasAvailablePlans ? (<Select
          options={_trainingPlans}
          onChange={(data) => setTrainingPlan(data.value)}
          className={errors.trainingPlan ? 'is-invalid' : ''}
          styles={{
            control: (styles) => ({
              ...styles,
              border: `${errors.trainingPlan && "1px solid red"} `
            })
          }}
        />) : (
          <BannerMessage variant={"warning"} evaluation={true} message={"No hay planes disponibles con cupos. Por favor, cree un nuevo plan de entrenamiento."} />
        )}

        {errors.trainingPlan && <div className="invalid-feedback">{errors.trainingPlan}</div>}
      </div>
    </FormLayout >
  )
}
