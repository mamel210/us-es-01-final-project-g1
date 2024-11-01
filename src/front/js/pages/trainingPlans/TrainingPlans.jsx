import React, { Children, useContext, useEffect } from "react"
import { Context } from '../../store/appContext.js'
import { Link } from 'react-router-dom'
import { MdEdit } from "react-icons/md";
import { FaRegTrashCan } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom'

export const TrainingPlans = () => {
  const { store, actions } = useContext(Context)
  const { trainingPlans, isTrainingPlansLoading } = store
  const navigate = useNavigate()

  const edit = (plan) => {
    actions.getCurrentTrainingPlan(plan)
    navigate("/edit-plan")
  }

  useEffect(() => {
    const getTP = async () => {
      actions.getTrainingPlans()
    }
    getTP()
  }, []);

  if (isTrainingPlansLoading) {
    return (
      <div className={"container mt-2"}>
        <h1 style={{ color: "yellow" }}>Loader de Tabla</h1>
      </div>
    )
  }

  return (
    <div className={"container mt-2"}>
      <div className={"mx-0 my-3 float-end"}>
        <Link to={"/create-plan"} className={"btn btn-primary"}>
          Crear Plan de Entrenamiento
        </Link>
      </div>
      <table className="table table-dark table-striped">
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Registration Date</th>
            <th scope="col">Finalization Date</th>
            <th scope="col">Quantity Session</th>
            <th scope="col">Level</th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          {Children.toArray(trainingPlans?.results?.map((trainingPlan) => {
            return (
              <tr>
                <td>{trainingPlan?.name}</td>
                <td>{trainingPlan?.registration_date}</td>
                <td>{trainingPlan?.finalization_date}</td>
                <td>{trainingPlan?.quantity_session}</td>
                <td>{trainingPlan?.level}</td>
                <td>
                  <div className="d-flex gap-2">
                    <div className="btn btn-sm btn-primary rounded" onClick={() => edit(trainingPlan)}>
                      <MdEdit size={"1.5rem"} />
                    </div>
                    <div className="btn btn-sm btn-danger rounded">
                      <FaRegTrashCan size={"1.5rem"} />
                    </div>
                  </div>
                </td>
              </tr>
            )
          }))}
          {/* <tr>
            <th scope="row">1</th>
            <td>Mark</td>
            <td>Otto</td>
            <td>@mdo</td>
          </tr> */}
        </tbody>
      </table>
    </div>
  )
}