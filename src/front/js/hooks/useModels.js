export const useModels = () => {

  const mapViewModels = {
    training_plans: "Ver planes",
    default: "Ver"
    // training_exercises: "MuscleExercises",
    // sessions,
    // session_exercises,
    // muscle_exercises
  }
  
  const mapModels = {
    training_plans: "Training Plans",
    default: ""
    // training_exercises: "MuscleExercises",
    // sessions,
    // session_exercises,
    // muscle_exercises
  }
  const mapRoutesModels = {
    training_plans: "/training-plan",
    default: ""
    // training_exercises: "MuscleExercises",
    // sessions,
    // session_exercises,
    // muscle_exercises
  }
  
  return {mapViewModels, mapModels, mapRoutesModels}
}
