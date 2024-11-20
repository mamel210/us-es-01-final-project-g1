import React, { useContext, useState } from 'react';
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';
import { FormLayout } from '../../component/FormLayout.jsx';
import { Input } from '../../component/Input.jsx';
import { Context } from '../../store/appContext.js';
import { useLevelOptions } from '../../hooks/useLevelOptions.js';
import { Badge, Col, Row } from 'react-bootstrap';

const NUMBER_OF_SESSIONS = 5;

export const CreatePlanForm = () => {
    const navigate = useNavigate("");
    const { levelOptions } = useLevelOptions();
    const { actions, store } = useContext(Context);

    const [formState, setFormState] = useState({
        name: "",
        registration_date: "",
        finalization_date: "",
        quantity_session: "",
        level: null,
        exercises: [],
    });
    const [errors, setErrors] = useState({});

    const exerciseCollection = store.exercisesStates.exercises.map((exe) => ({
        label: exe.name,
        value: exe.id,
    }));

    const validateForm = () => {
        const newErrors = {};

        if (!formState.name) newErrors.name = "Please enter a name.";
        if (!formState.registration_date) newErrors.registration_date = "Please select a registration date.";
        if (!formState.finalization_date) newErrors.finalization_date = "Please select a finalization date.";
        if (formState.finalization_date < formState.registration_date)
            newErrors.finalization_date = "The finalization date must be greater than or equal to the registration date.";
        if (!formState.quantity_session) newErrors.quantity_session = "Please enter the quantity of sessions.";
        if (formState.quantity_session > NUMBER_OF_SESSIONS) newErrors.quantity_session = `The number of sessions cannot exceed ${NUMBER_OF_SESSIONS}.`;
        if (!formState.level) newErrors.level = "Please select a level.";
        if (!formState.exercises.length) newErrors.exercises = "Please select at least one exercise.";
        console.log("🚀 ~ validateForm ~ formState:", formState)

        console.log("🚀 ~ validateForm ~ newErrors:", newErrors)

        formState.exercises.forEach((exe, index) => {
            if (!exe.series) {
                newErrors[`series-${exe.value}`] = "Series are required.";
            }
            if (!exe.repetitions) {
                newErrors[`repetitions-${exe.value}`] = "Repetitions are required.";
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const createPlan = (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        const formData = {
            name: formState.name,
            registration_date: formState.registration_date,
            finalization_date: formState.finalization_date,
            quantity_session: formState.quantity_session,
            level: formState.level?.value,
            exercises: formState.exercises.map((exe) => ({
                exercise_id: exe.value,
                repetitions: exe.repetitions,
                series: exe.series
            }))
        };
        actions.crudTrainingPlans({ formData, navigate, action: "create" });
    };

    const onChange = (key, value) => {
        if (key === "quantity_session") {
            if (value > NUMBER_OF_SESSIONS) {
                setErrors(prevErrors => ({
                    ...prevErrors,
                    quantity_session: `The number of sessions cannot exceed ${NUMBER_OF_SESSIONS}.`
                }));
            } else {
                setErrors(prevErrors => ({
                    ...prevErrors,
                    quantity_session: ""
                }));
                setFormState(prevState => ({ ...prevState, [key]: value }));
            }
        } else if (key === "exercises") {
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
        <FormLayout
            isLoading={store.trainingPlansStates.isTrainingPlansLoading}
            title={"Create your Exercise Plan"}
            onSubmit={createPlan}
            actionText={"Create Plan"}
            customWidth={"700px"}
            goBackOnClick={() => navigate("/training-plan")}
        >
            <div className="row">
                <div className="col-6">
                    <Input
                        label="Name"
                        id="name"
                        value={formState.name}
                        onChange={(e) => onChange("name", e.target.value)}
                        type={"text"}
                        isInvalid={!!errors.name}
                        errorMessage={errors.name}
                    />
                </div>
                <div className="col-6">
                    <div className='mb-3'>
                        <label htmlFor={"level"} className='form-label'>Level</label>
                        <Select
                            options={levelOptions}
                            onChange={(data) => onChange("level", data)}
                            className={errors.level ? 'is-invalid' : ''}
                            value={formState.level}
                            styles={{
                                control: (styles,) => ({
                                    ...styles,
                                    border: `${errors.level && "1px solid red"} `
                                })
                            }}
                        />
                        {errors.level && <div className="invalid-feedback">{errors.level}</div>}
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-6">
                    <Input
                        label="Registration Date"
                        id="registration_date"
                        value={formState.registration_date}
                        onChange={(e) => onChange("registration_date", e.target.value)}
                        type={"date"}
                        isInvalid={!!errors.registration_date}
                        errorMessage={errors.registration_date}
                    />
                </div>
                <div className="col-6">
                    <Input
                        label="Finalization Date"
                        id="finalization_date"
                        value={formState.finalization_date}
                        onChange={(e) => onChange("finalization_date", e.target.value)}
                        type={"date"}
                        isInvalid={!!errors.finalization_date}
                        errorMessage={errors.finalization_date}
                    />
                </div>
            </div>
            <div className="row">
                <div className="col-6">
                    <Input
                        label="Quantity Sessions"
                        id="quantity_session"
                        value={formState.quantity_session}
                        onChange={(e) => onChange("quantity_session", e.target.value)}
                        type={"number"}
                        isInvalid={!!errors.quantity_session}
                        errorMessage={errors.quantity_session}
                    />
                </div>
                <div className="col-6">
                    <div className='mb-3'>
                        <label htmlFor={"exercises"} className='form-label'>Exercises</label>
                        <Select
                            isMulti
                            options={exerciseCollection}
                            onChange={(data) => onChange("exercises", data)}
                            value={formState.exercises}
                            className={errors.exercises ? 'is-invalid' : ''}
                            styles={{
                                control: (styles,) => ({
                                    ...styles,
                                    border: `${errors.exercises && "1px solid red"} `
                                })
                            }}
                        />
                        {errors.exercises && <div className="invalid-feedback">{errors.exercises} </div>}
                    </div>
                </div>
            </div>
            {formState.exercises.length ? (
                <>
                    {formState.exercises.map((exe) => (
                        <Row className='align-items-center h-100' key={exe.value}>
                            <Col sm={4}>
                                <Badge className='exercise-labelName'>{exe.label}</Badge>
                            </Col>
                            <Col sm={8} className='d-flex gap-1'>
                                <Input
                                    label="Series"
                                    id={`series-${exe.value}`}
                                    value={exe.series}
                                    onChange={(e) => handleExerciseChange(exe.value, "series", e.target.value)}
                                    type={"number"}
                                    isInvalid={!!errors[`series-${exe.value}`]}
                                    errorMessage={errors[`series-${exe.value}`]}
                                />
                                <Input
                                    label="Repetitions"
                                    id={`repetitions-${exe.value}`}
                                    value={exe.repetitions} onChange={(e) => handleExerciseChange(exe.value, "repetitions", e.target.value)}
                                    type={"number"}
                                    isInvalid={!!errors[`repetitions-${exe.value}`]}
                                    errorMessage={errors[`repetitions-${exe.value}`]}
                                />
                            </Col>
                        </Row>
                    ))}
                </>
            ) : null}
        </FormLayout>
    );
};
