import React, { Children, useContext, useEffect, useState } from "react"
import Swal from 'sweetalert2';
import { FaRegTrashCan } from "react-icons/fa6";
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { MdEdit } from "react-icons/md";
import { Context } from '../../store/appContext.js'
import "../../../styles/trainingPlans.css"
import { BannerMessage } from "../../component/BannerMessage.jsx";
import { formatDate } from "../../helper/formatDate.js";


export const Sessions = () => {
  const { store, actions } = useContext(Context)
  const { sessionsStates, trainingPlansStates } = store
  const navigate = useNavigate()

  const findTPName = (id) => {
    const plan = trainingPlansStates?.trainingPlans.find(t => t.id === id)
    return plan?.name
  }

  // useEffect(() => {
  //   const getSessions = async () => {
  //     actions.getSessions()
  //   }
  //   getSessions()
  // }, []);

  if (false) {
    return (
      <div className={"container mt-2"}>
        <h1 style={{ color: "yellow" }}>Loader de Tabla</h1>
      </div>
    )
  }
  return (
    <div className={"container mt-2"}>
      {/* <BannerMessage variant={"info"} message={"Crea tu Session eligiendo un plan de entrenamiento"} evaluation={true}/> */}
      <div className="trainingPlans-header-container">

        <div className={""}>
          <Link to={"/create-sessions"} className={"btn btn-primary"}>
            Crear Session
          </Link>
        </div>
      </div>
      <table className="table table-dark table-striped">
        <thead>
          <tr>
            <th scope="col">date</th>
            <th scope="col">training plan</th>
          </tr>
        </thead>
        <tbody>
          {Children.toArray(sessionsStates.sessions.map((session) => {
            return (
              <tr>
                <td>{formatDate(session.date)}</td>
                <td>{findTPName(session.training_plan_id)}</td>
              </tr>
            )
          }))}


        </tbody>
      </table>
    </div>
  )
}
