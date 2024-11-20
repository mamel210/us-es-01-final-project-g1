import React, { useContext, useEffect } from 'react'
import { CardIndicator } from '../component/CardIndicator.jsx'
import { CreateCard } from '../component/CreateCard.jsx'
import { CardInfo } from '../component/CardInfo.jsx'
import { Loader } from '../component/Loader.jsx'
import { Context } from '../store/appContext.js'
import "../../styles/dashboard.css"

export const Dashboard = () => {
  const { store } = useContext(Context)

  const seriesDone = store.exercisesStates.sessionExercises.filter(se => se.is_done).length

  const tpGoals = store.trainingPlansStates.trainingPlans.filter((tp) => tp.status === "completed").length

  return (
    <main className='container'>
      <div className='main-overview'>
        <div className='overview-cardIndicator'>
          <CardIndicator value={store?.trainingPlansStates?.trainingPlansCount ?? "0"} description={"Plans Created"} section={"planCount"} />
        </div>
        <div className='overview-cardIndicator'>
          <CardIndicator value={seriesDone} description={"Series Done"} section={"membersCount"} />
        </div>
        <div className='overview-cardIndicator'>
          <CardIndicator value={store?.sessionsStates.sessionsCount} description={"Sessions Created"} section={"timeCount"} />
        </div>
        <div className='overview-cardIndicator'>
          <CardIndicator value={tpGoals} description={"Gaols Completed"} section={"percentageGoal"} />
        </div>
      </div>
      <div className='powerpulse'>
        <div className="row">
          <div className='col-12 col-sm-12 col-md-6 col-lg-6'>
            {store.isAppLoading ? <Loader /> : (
              <CardInfo title={"Exercises"} subtitle={"Powerful exercises!"} description={"List of exercises, take a look at them and see the details."} model={"exercises"} />
            )}
          </div>
          <div className='col-12 col-sm-12 col-md-6 col-lg-6'>
            {store.isAppLoading ? <Loader /> : store?.trainingPlansStates?.trainingPlans?.length ? (
              <CardInfo model={"training_plans"} title={"Planes de Ejercicio"} subtitle={"Best Exercises"} description={"Here you can find a plan that suits your needs."} />
            ) : (<CreateCard model={"training_plans"} />)}
          </div>
        </div>
        <div className="row">
          <div className='col-12 col-sm-12 col-md-6 col-lg-6'>
            {store.isAppLoading ? <Loader /> : store?.sessionsStates?.sessions?.length ? (
              <CardInfo title={"Sesions"} subtitle={"All Sessions here!"} description={"improve your sessions here"} model={"sessions"} />
            ) : (<CreateCard model={"sessions"} />)}
          </div>
          <div className='col-12 col-sm-12 col-md-6 col-lg-6'>
            {store.isAppLoading ? <Loader /> : <CardInfo title={"Muscles"} subtitle={"Muscles details"} description={"View a guidance of the muscles"} model={"muscles"} />}
          </div>
        </div>
      </div>
    </main>
  )
}
