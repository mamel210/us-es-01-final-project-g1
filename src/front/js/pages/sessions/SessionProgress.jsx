import React, { useState, useEffect, useContext } from 'react';
import { Context } from '../../store/appContext.js';
import { Input } from '../../component/Input.jsx';
import { FormLayout } from '../../component/FormLayout.jsx';

export const SessionProgress = ({ sessionId }) => {
    const { actions, store } = useContext(Context);
    const [sessionExercises, setSessionExercises] = useState([]);
    const [progress, setProgress] = useState({});

    useEffect(() => {
        // Cargar ejercicios de la sesión
        const exercises = store.exercisesStates.trainingPlanExercises.filter(exercise => exercise.session_id === sessionId);
        setSessionExercises(exercises);

        // Inicializar el progreso
        const initialProgress = exercises.reduce((acc, exercise) => {
            acc[exercise.id] = {
                completedSeries: 0,
                completedRepetitions: 0
            };
            return acc;
        }, {});
        setProgress(initialProgress);
    }, [sessionId, store.exercisesStates.trainingPlanExercises]);

    const handleProgressChange = (exerciseId, key, value) => {
        setProgress(prevProgress => ({
            ...prevProgress,
            [exerciseId]: {
                ...prevProgress[exerciseId],
                [key]: parseInt(value, 10) || 0
            }
        }));
    };

    const calculateCompletionPercentage = (exercise) => {
        const totalReps = exercise.repetitions * exercise.series;
        const completedReps = (progress[exercise.id]?.completedRepetitions || 0) * (progress[exercise.id]?.completedSeries || 0);
        return Math.min((completedReps / totalReps) * 100, 100).toFixed(2);
    };

    const handleSubmitProgress = () => {
        // Enviar el progreso de cada ejercicio a la API
        sessionExercises.forEach(exercise => {
            const completedSeries = progress[exercise.id]?.completedSeries || 0;
            const completedRepetitions = progress[exercise.id]?.completedRepetitions || 0;
            actions.updateSessionExercise({
                sessionExerciseId: exercise.id,
                completedSeries,
                completedRepetitions,
                is_done: completedSeries >= exercise.series && completedRepetitions >= exercise.repetitions
            });
        });
    };

    return (
        <FormLayout title={"Progreso de la Sesión"} onSubmit={handleSubmitProgress} actionText={"Actualizar Progreso"}>
            <div className="session-progress-container">
                {sessionExercises.map(exercise => (
                    <div key={exercise.id} className="exercise-progress">
                        <h5>{exercise.exercise_name} (Series: {exercise.series}, Repeticiones: {exercise.repetitions})</h5>
                        <Input
                            label="Series Completadas"
                            type="number"
                            value={progress[exercise.id]?.completedSeries || ""}
                            onChange={(e) => handleProgressChange(exercise.id, 'completedSeries', e.target.value)}
                        />
                        <Input
                            label="Repeticiones Completadas"
                            type="number"
                            value={progress[exercise.id]?.completedRepetitions || ""}
                            onChange={(e) => handleProgressChange(exercise.id, 'completedRepetitions', e.target.value)}
                        />
                        <div>Progreso: {calculateCompletionPercentage(exercise)}%</div>
                    </div>
                ))}
            </div>
        </FormLayout>
    );
};
