import React, { useContext, useState } from 'react';
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';
import { FormLayout } from '../../component/FormLayout.jsx';
import { Input } from '../../component/Input.jsx';
import { Context } from '../../store/appContext.js';
import { useLevelOptions } from '../../hooks/useLevelOptions.js';

export const CreatePlanForm = () => {
    const navigate = useNavigate("");
    const { levelOptions } = useLevelOptions();
    const { actions, store } = useContext(Context);
    const [formState, setFormState] = useState({
        name: "",
        registration_date: "",
        finalization_date: "",
        quantity_session: "",
        level: "begginer",
        exercises: [],
    });

    const exerciseCollection = store.exercisesStates.exercises.map((exe) => ({
        label: exe.name,
        value: exe.id,
    }));

    const createPlan = (e) => {
        e.preventDefault();
        const formData = {
            name: formState.name,
            registration_date: formState.registration_date,
            finalization_date: formState.finalization_date,
            quantity_session: formState.quantity_session,
            level: formState.level,
            exercises: formState.exercises.map((exe) => ({
                exercise_id: exe.value,
                repetitions: exe.repetitions,
                series: exe.series
            }))
        };
        actions.crudTrainingPlans({ formData, navigate, action: "create" });
    };

    const onChange = (key, value) => {
        if (key === "exercises") {
            const updatedExercises = value.map((exe) => {
                const existingExercise = formState.exercises.find((e) => e.value === exe.value);
                return {
                    ...exe,
                    repetitions: existingExercise ? existingExercise.repetitions : "",
                    series: existingExercise ? existingExercise.series : ""
                };
            });

            setFormState((prevState) => ({
                ...prevState,
                exercises: updatedExercises
            }));
        } else {
            setFormState((prevState) => ({ ...prevState, [key]: value }));
        }
    };

    const handleExerciseChange = (exerciseId, key, value) => {
        setFormState((prevState) => ({
            ...prevState,
            exercises: prevState.exercises.map((exe) =>
                exe.value === exerciseId
                    ? { ...exe, [key]: value }
                    : exe
            )
        }));
    };

    return (
        <FormLayout title={"Create your Exercise Plan"} onSubmit={createPlan} actionText={"Create Plan"} customWidth={"700px"} goBackOnClick={() => navigate("/training-plan")}>
            <div className="row">
                <div className="col-6">
                    <Input label="Name" id="name" value={formState.name} onChange={(e) => onChange("name", e.target.value)} type={"text"} />
                </div>
                <div className="col-6">
                    <div className='mb-3'>
                        <label htmlFor={"level"} className='form-label'>Level</label>
                        <Select options={levelOptions} onChange={(data) => onChange("level", data.value)} />
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-6">
                    <Input label="Registration Date" id="registration_date" value={formState.registration_date} onChange={(e) => onChange("registration_date", e.target.value)} type={"date"} />
                </div>
                <div className="col-6">
                    <Input label="Finalization Date" id="finalization_date" value={formState.finalization_date} onChange={(e) => onChange("finalization_date", e.target.value)} type={"date"} />
                </div>
            </div>
            <div className="row">
                <div className="col-6">
                    <Input label="Quantity Sessions" id="quantity_session" value={formState.quantity_session} onChange={(e) => onChange("quantity_session", e.target.value)} type={"number"} />
                </div>
                <div className="col-6">
                    <div className='mb-3'>
                        <label htmlFor={"exercises"} className='form-label'>Exercises</label>
                        <Select isMulti options={exerciseCollection} onChange={(data) => onChange("exercises", data)} />
                    </div>
                </div>
            </div>
            {formState.exercises.length ? (
                <>
                    {formState.exercises.map((exe) => (
                        <div className='createFormSeriesRepetitionsContainer' key={exe.value}>
                            <div className='p-2 fs-6 mt-2 badge rounded bg-secondary'>{exe.label}</div>
                            <div className='d-flex gap-1'>
                                <Input label="Series" id={`series-${exe.value}`} value={exe.series} onChange={(e) => handleExerciseChange(exe.value, "series", e.target.value)} type={"number"} />
                                <Input label="Repetitions" id={`repetitions-${exe.value}`} value={exe.repetitions} onChange={(e) => handleExerciseChange(exe.value, "repetitions", e.target.value)} type={"number"} />
                            </div>
                        </div>
                    ))}
                </>
            ) : null}
        </FormLayout>
    );
};
