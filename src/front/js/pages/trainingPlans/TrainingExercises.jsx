import React, { useContext, useState } from 'react';
import { Context } from '../../store/appContext';
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";

export const TrainingExercises = ({ trainingPlan }) => {
  const [showExercisesDetails, setShowExercisesDetails] = useState(false)
  const { store } = useContext(Context);
  const { exercisesStates } = store
  const { exercises, trainingPlanExercises } = exercisesStates

  const linkedExercises = trainingPlanExercises?.filter(
    (exercise) => exercise.training_plan_id === trainingPlan?.id
  );

  return (
    <>
      <>
        {!showExercisesDetails ? (
          <div className='innerTableForm-container-exercisesDetails'>
            <div>{linkedExercises.length} Exercises</div>
            <div className='innerTableForm-container-exercisesDetails-iconWrapper' onClick={() => setShowExercisesDetails((prev) => !prev)}>
              <FaRegEye />
            </div>
          </div>
        ) : (<>
          <div className={"innerTableForm-container-exercises"}>
            <div className='innerTableForm-container-exercisesDetails-iconWrapper2' onClick={() => setShowExercisesDetails(false)}>
              <div className='innerTableForm-container-exercisesDetails-iconWrapper-icon'>
                <FaRegEyeSlash className='algo' />
              </div>
            </div>
            {linkedExercises?.map((exercise, index) => {
              const exerciseDetails = exercises.find(exe => exe.id === exercise.exercise_id)
              const exerciseName = exerciseDetails ? exerciseDetails.name : "unk"
              return (
                <div key={index} className='trainingExercises-exercises-details'>
                  <div> <b>Exercise Name: </b>{exerciseName}</div>
                  <div><b>Series:</b> {exercise?.series}</div>
                  <div><b>Repetitions:</b> {exercise?.repetitions}</div>
                </div>
              )
            })}
          </div>
        </>)
        }
      </>
    </>
  );
};

