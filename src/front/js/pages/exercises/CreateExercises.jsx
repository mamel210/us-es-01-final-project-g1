import React, { useContext, useState, } from 'react'
import Select from 'react-select'
import { useNavigate } from 'react-router-dom'
import { FormLayout } from '../../component/FormLayout.jsx'
import { Input } from '../../component/Input.jsx'
import { Context } from '../../store/appContext.js'


export const CreateExercises = () => {
  const { actions, store } = useContext(Context)
  const userFromLocalStorage = JSON.parse(localStorage.getItem("user"))


  const [name, setName] = useState("")
  const navigate = useNavigate()
  const createExercises = (e) => {
    e.preventDefault()
    const formData = {
      name,
      description: "algo",
      muscle: "musculitos",
      exercise_base: "e b",
      category_id: 10
    }
    actions.createExercises({ formData, navigate })
  }

  return (
    <FormLayout title={"Create your Exercises"} onSubmit={createExercises} actionText={"Create Exercises"}>
      <Input label="Name" id="name" value={name} onChange={(e) => setName(e.target.value)} type={"text"} />
    </FormLayout >
  )
}
