import React, { useContext, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CardIndicator } from '../component/CardIndicator.jsx'
import { CreateCard } from '../component/CreateCard.jsx'
import { CardInfo } from '../component/CardInfo.jsx'
import { Loader } from '../component/Loader.jsx'
import { Context } from '../store/appContext.js'
import { useItems } from '../hooks/useItems.js'
import "../../styles/dashboard.css"

//--> esto para nosotros es un un pseudo home! o nuestra pagina principal
export const Dashboard = () => {
  const { store, actions } = useContext(Context)
  const authToken = localStorage.getItem("token")
  const user = localStorage.getItem("user")
  const navigate = useNavigate()
  const { detailsPlanLevelDetails } = useItems()


  useEffect(() => {
    if (!store.isLogin) {
      console.log("AQUI DEBERIA NAVEGAR AL LOGIN Y NO LO HACE")
      navigate("/")
    }
    actions.isLogin()
  }, [store.isLogin]);

  return (
    <main className='dashboard-container'>
      <div className='main-overview'>
        <div className='overview-cardIndicator'>
          <CardIndicator value={store?.trainingPlansStates?.trainingPlansCount ?? "0"} description={"Planes de Ejercicio"} section={"planCount"} />
        </div>
        <div className='overview-cardIndicator'>
          <CardIndicator value={"0"} description={"Cantidad de Miembros"} section={"membersCount"} />
        </div>
        <div className='overview-cardIndicator'>
          <CardIndicator value={"0"} description={"Tiempo aproximado por ejercicio"} section={"timeCount"} />
        </div>
        <div className='overview-cardIndicator'>
          <CardIndicator value={"0"} description={"Metas Alcanzadas"} section={"percentageGoal"} />
        </div>
      </div>
      <div className='container-fluid'>
        <div className="row">
          <div className='col col-sm-12 col-md-6 col-lg-6'>
            {store.trainingPlansStates.isTrainingPlansLoading ? <Loader /> : store?.trainingPlansStates?.trainingPlans?.length ? (
              <CardInfo setupItems={detailsPlanLevelDetails} model={"training_plans"} title={"Planes de Ejercicio"} subtitle={"Los Mejores planes de Ejercicios"} description={"Aqui puedes encontrar un plan que se adapte a tus necesidades"} />
            ) : (<CreateCard model={"training_plans"} />)}
          </div>
          <div className='col col-sm-12 col-md-6 col-lg-6'>
            {store.sessionsStates.isSessionsLoading ? <Loader /> : store?.sessionsStates?.sessions?.length ? (
              <CardInfo title={"Sesions"} subtitle={"Best Sessions bound to the training plan"} description={"some description"} model={"sessions"} setupItems={{}} />
            ) : (<CreateCard model={"sessions"} />)}
          </div>
        </div>
        <div className="row">
        <div className='col col-sm-12 col-md-6 col-lg-6'>
            {store.exercisesStates.isExercisesLoading ? <Loader /> : store?.exercisesStates?.exercises?.length ? (
              <CardInfo title={"Exercises"} subtitle={"Powerful exercises for your training and you!"} description={"awesome exercises"} model={"exercises"} setupItems={{}} />
            ) : (<CreateCard model={"sessions"} />)}
          </div>
          <div className='col col-sm-12 col-md-6 col-lg-6'>
            {/* <CardInfo title={"titulo modelo3"} subtitle={"algun mensaje motivador4"} description={"algun mensaje"} /> */}
            <CreateCard />
          </div>
        </div>
      </div>
    </main>
  )
}
