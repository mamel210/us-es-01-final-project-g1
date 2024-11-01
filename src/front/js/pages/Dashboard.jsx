import React, { useContext, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CardIndicator } from '../component/CardIndicator.jsx'
import { CreateCard } from '../component/CreateCard.jsx'
import { CardInfo } from '../component/CardInfo.jsx'
import { Context } from '../store/appContext.js'
import "../../styles/dashboard.css"
import { Loader } from '../component/Loader.jsx'

//--> esto para nosotros es un un pseudo home! o nuestra pagina principal
export const Dashboard = () => {
  const { store, actions } = useContext(Context)
  const authToken = localStorage.getItem("token")
  const user = localStorage.getItem("user")
  const navigate = useNavigate()

  useEffect(() => {
    if (!store.isLogin) {
      navigate("/")
    }
  }, []);

  return (
    <main className='dashboard-container'>
      <div className='main-overview'>
        <div className='overview-cardIndicator'>
          <CardIndicator value={store?.trainingPlans?.results?.length ?? "0"} description={"Planes de Ejercicio"} section={"planCount"} />
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
            {store.isTrainingPlansLoading ? <Loader /> : store?.trainingPlans?.results?.length ? (
              <CardInfo model={"training_plans"} title={"Planes de Ejercicio"} subtitle={"Los Mejores planes de Ejercicios"} description={"Aqui puedes encontrar un plan que se adapte a tus necesidades"} />
            ) : (<CreateCard />)}
          </div>

          <div className='col col-sm-12 col-md-6 col-lg-6'>
            <CreateCard />
            {/* <CardInfo title={"titulo modelo2"} subtitle={"algun mensaje motivador2"} description={"algun mensaje"} /> */}
          </div>
        </div>

        <div className="row">


          <div className='col col-sm-12 col-md-6 col-lg-6'>
            {/* <CardInfo title={"titulo modelo3"} subtitle={"algun mensaje motivador3"} description={"algun mensaje"} /> */}
            <CreateCard />
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
