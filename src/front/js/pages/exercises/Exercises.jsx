import React, { Children, useContext, useEffect, useState } from "react"
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { Context } from '../../store/appContext.js'


export const Exercises = () => {
  const { store, actions } = useContext(Context)
  const { exercisesStates, } = store
  const navigate = useNavigate()

  return (
    <div className={"container mt-2"}>
      <table className="table table-dark table-striped">
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Category</th>
            <th scope="col">Muscle</th>
            <th scope="col">Description</th>
          </tr>
        </thead>
        <tbody>
          {Children.toArray(exercisesStates.exercises.map((exercise) => {
            return (
              <tr>
                <td>{exercise.name}</td>
                <td>{exercise.category_id}</td>
                <td>{exercise.muscle}</td>
                <td>{exercise.description}</td>
              </tr>
            )
          }))}

        </tbody>
      </table>
    </div>
  )
}

// {
//   "category_id": 10,
//   "description": "El movimiento crunch es uno de los ejercicios m\u00e1s b\u00e1sicos dise\u00f1ados para fortalecer los m\u00fasculos centrales del cuerpo. El ejercicio ayuda a fortalecer los m\u00fasculos centrales, mejorar la postura y aumentar la movilidad y flexibilidad muscular.\nMejora los m\u00fasculos del six pack: Cuando se realiza el ejercicio de abdominales, los m\u00fasculos rectos abdominales y oblicuos se tensan, por lo que se desarrollan los m\u00fasculos abdominales superiores y los m\u00fasculos del six pack.\nAumenta la fuerza de los m\u00fasculos abdominales: La funci\u00f3n principal de los m\u00fasculos abdominales es estabilizar la secci\u00f3n media. Te apoya mientras levantas objetos pesados, lo que te permite girar y rotar tu cuerpo. Estas son acciones de todo el d\u00eda que no notas, por lo que es importante que tus m\u00fasculos abdominales puedan soportar largas horas de trabajo. El ejercicio crunch ayuda a desarrollar esta importante resistencia en los m\u00fasculos abdominales. La resistencia muscular es la capacidad de estas fibras para resistir la resistencia durante mucho tiempo.",
//   "exercise_base": "1319",
//   "id": 2291,
//   "muscle": "muscles",
//   "name": "Abdominales HD"
// },