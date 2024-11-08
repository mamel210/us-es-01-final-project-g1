import React, { Children, useContext, useEffect, useState } from 'react';
import Select from 'react-select';
import { Context } from '../../store/appContext';
import { Input } from '../../component/Input.jsx';
import { useNavigate } from 'react-router-dom';
import { IoIosCloseCircleOutline } from "react-icons/io";

export const TrainingExercises = ({ linInitialExercise, tpId, showForm, setShowForm, }) => {
  const { store, actions } = useContext(Context);
  const [exercises, setExercises] = useState('');
  const [series, setSeries] = useState('');
  const [repetitions, setRepetitions] = useState('');

  const navigate = useNavigate();

  const exercisesCollection = store?.exercisesStates?.exercises?.map((exercises) => ({
    label: exercises.name,
    value: exercises.id
  }));

  const addExercises = async (e) => {
    e.preventDefault();
    const formData = {
      training_plan_id: tpId,
      exercise_id: exercises,
      repetitions: repetitions,
      series: series
    };

    await actions.setTrainingPlanExercises(formData, navigate);
    setShowForm(false);
  };

  if (linInitialExercise === tpId && showForm) {
    return (
      <form className={'innerTableForm-container'} onSubmit={addExercises}>
        <div className="innerTableForm-close">
          <IoIosCloseCircleOutline onClick={() => setShowForm(false)} />
        </div>
        <div className='mb-3 table-light'>
          <label htmlFor={'Exercises'} className='form-label innerTableForm-label'>
            Ejercicios
          </label>
          <Select options={exercisesCollection} onChange={(data) => setExercises(data.value)} />
        </div>
        {Boolean(exercises) && linInitialExercise === tpId ? (
          <>
            <Input
              label='Series'
              id='series'
              value={series}
              onChange={(e) => setSeries(e.target.value)}
              type={'text'}
            />
            <Input
              label='Repetition'
              id='Repetition'
              value={repetitions}
              onChange={(e) => setRepetitions(e.target.value)}
              type={'text'}
            />
          </>
        ) : null}
        <button className='btn btn-warning w-100'>Actualizar</button>
      </form>
    );
  }
  return null;
};

export const AddTrainingExercises = ({ linkedExercises, onClick, updateExercise, showUpdateButton, showForm }) => {
  const { store } = useContext(Context);
  const { exercisesStates } = store
  const { exercises } = exercisesStates

  const foundExercise =
    linkedExercises?.length > 0
      ? exercises.find((exe) => exe.id === linkedExercises[0].exercise_id)
      : null;

  return (
    <>
      {linkedExercises?.length > 0 ? (
        <>
          {linkedExercises?.map((exercise, index) => (
            <div key={index}>
              {showUpdateButton && <button className='btn btn-secondary btn-sm' onClick={updateExercise}>Actualizar</button>}
              <div><b>Exercise Name:</b> {foundExercise?.name}</div>
              <div><b>Series:</b> {exercise?.series}</div>
              <div><b>Repetitions:</b> {exercise?.repetitions}</div>
            </div>
          ))}
        </>
      ) : (
        <span className={`innerTableForm-initialMessage-${showForm ? "open" : "close"}`} onClick={onClick}>
          {!!showForm ? "Pick an exercise" : "Add Exercise"}
        </span>
      )}
    </>
  );
};

export const UpdateExercise = ({ updateExerciseState, tpId, linkedExercises }) => {
  const { store, actions } = useContext(Context);
  const { exercisesStates } = store
  const { exercises } = exercisesStates

  const [series, setSeries] = useState('');
  const [repetitions, setRepetitions] = useState('');

  const foundExercise =
    linkedExercises?.length > 0
      ? exercises.find((exe) => exe.id === linkedExercises[0].exercise_id)
      : null;

  const navigate = useNavigate();


  const update = async (e) => {
    e.preventDefault();
    const formData = {
      training_plan_id: tpId,
      exercise_id: foundExercise?.id,
      repetitions: repetitions,
      series: series
    };

    await actions.setTrainingPlanExercises(formData, navigate, true);
    setShowForm(false);
  };

  const evaluation = updateExerciseState && updateExerciseState?.id === tpId && updateExerciseState?.show

  return (
    <>
      {evaluation ? (
        <form className={'innerTableForm-container'} onSubmit={update}>
          <div className='mb-3 table-light'>
            <label htmlFor={'Exercises'} className='form-label innerTableForm-label'>
              Ejercicios
            </label>
            <Select isDisabled={true} options={[]} value={[{ label: foundExercise?.name, }]} />
          </div>
          <Input
            label='Series'
            id='series'
            value={series}
            onChange={(e) => setSeries(e.target.value)}
            type={'text'}
          />
          <Input
            label='Repetition'
            id='Repetition'
            value={repetitions}
            onChange={(e) => setRepetitions(e.target.value)}
            type={'text'}
          />
          <button className='btn btn-warning w-100'>Actualizar</button>
        </form>
      ) : null}
    </>
  );
};
