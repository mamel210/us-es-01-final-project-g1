import React, { useContext, useState } from 'react';
import { Badge, Button } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { FaInfo } from 'react-icons/fa';
import { FaRegTrashCan } from 'react-icons/fa6';
import { Link, useNavigate } from 'react-router-dom';
import { MdEdit } from 'react-icons/md';
import { Context } from '../../store/appContext.js';
import { BannerMessage } from '../../component/BannerMessage.jsx';
import { Filters } from '../../component/Filters.jsx';
import { SkeletonTable } from '../../component/Loader.jsx';
import { Title } from '../../component/Title.jsx';
import { NoRecords } from '../../component/NoRecords.jsx';
import { formatDate } from '../../helper/formatDate.js';
import { TrainingExercises } from './TrainingExercises.jsx';
import './trainingPlans.css';
import { StatusBadge } from '../../component/StatusBadge.jsx';

export const TrainingPlans = () => {
  const [filter, setFilter] = useState("");

  const { store, actions } = useContext(Context);
  const { trainingPlansStates, isAppLoading } = store;
  const { trainingPlans, isTrainingPlansLoading, } = trainingPlansStates;

  const navigate = useNavigate();

  const filteredPlans = trainingPlans.filter(plan => filter ? plan.level === filter : true);

  const filterOptions = [
    { label: "Begginers", value: "begginer" },
    { label: "Intermediate", value: "intermediate" },
    { label: "Advanced", value: "advanced" }
  ];


  const crud = (plan, action) => {
    actions.getCurrentTrainingPlan(plan);
    actions.setAction(action);
    if (action === 'edit') {
      return navigate('/update-plan');
    }
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ff5733',
      cancelButtonColor: '#d3c7bb',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        actions.crudTrainingPlans({
          formData: plan,
          navigate,
          currentPlanId: plan.id,
          action: 'delete'
        });
        Swal.fire({
          title: 'Deleted!',
          text: 'Your Training Plan has been deleted.',
          icon: 'success',
          confirmButtonText: "Close",
          confirmButtonColor: '#ff5733',
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          title: "Cancelled",
          text: "Your Training Plan is safe :)",
          icon: "error",
          confirmButtonText: "Close",
          confirmButtonColor: '#ff5733',
        });
      }
    });
  };



  const Message = () => <div className='infoMessage'><FaInfo /> You can add your exercises directly from the table or when creating a new training plan.</div>

  if (isAppLoading) {
    return (
      <div className={'container mt-5'}>
        <SkeletonTable />
      </div>
    );
  }
  return (
    <div className={'container mt-2'}>
      <Title title={"Training Plans"}>
        <div className="sessions-header-container">

          <Button variant={"info"} as={Link} to={"/create-plan"}>
            Create a Plan
          </Button>
        </div>
      </Title>
      <Filters options={filterOptions} onFilterChange={setFilter} title={"Filter by Level"} />
      <table className='table table-dark table-striped table-responsive'>
        <thead>
          <tr>
            <th scope='col'>Name</th>
            <th scope='col'>Registration Date</th>
            <th scope='col'>Finalization Date</th>
            <th scope='col'># Session</th>
            <th scope='col'>Status</th>
            <th scope='col'>Level</th>
            <th scope='col'>Exercises</th>

            <th scope='col'></th>
          </tr>
        </thead>
        <tbody>
          {filteredPlans.length ? trainingPlans &&
            filteredPlans?.map((trainingPlan, index) => {
              return (
                <tr key={index}>
                  <td>{trainingPlan?.name}</td>
                  <td>{formatDate(trainingPlan?.registration_date)}</td>
                  <td>{formatDate(trainingPlan?.finalization_date)}</td>
                  <td>{trainingPlan?.quantity_session}</td>
                  <td>
                    <StatusBadge status={trainingPlan?.status} />
                  </td>
                  <td>{trainingPlan?.level}</td>
                  <td style={{ position: "relative" }}>
                    <TrainingExercises trainingPlan={trainingPlan} />
                  </td>
                  <td>
                    <div className='d-flex gap-2'>
                      <Button variant={"info"} className='btn btn-sm btn-warning rounded' onClick={() => crud(trainingPlan, 'edit')} style={{
                        padding: "0.25rem 0.5rem", fontSize: ".75rem"
                      }}>
                        <MdEdit size={'1.125rem'} />
                      </Button>
                      <div className='btn btn-sm btn-secondary rounded'>
                        <FaRegTrashCan size={'1.125rem'} onClick={() => crud(trainingPlan, 'delete')} />
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })
            : <NoRecords message='No Training Plans to show' />}
        </tbody>
      </table>
    </div>
  );
};
