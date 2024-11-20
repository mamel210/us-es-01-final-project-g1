export const useModels = () => {

  const mapViewModels = {
    training_plans: "View Plans",
    sessions: "View Session",
    exercises: "View Exercises",
    muscles: "View Muscles",
    default: "View"
    // training_exercises: "MuscleExercises",
    // session_exercises,
    // muscle_exercises
  }

  const mapModels = {
    training_plans: "Training Plans",
    sessions: "Sessions",
    exercises: "Exercises",
    muscles: "Muscles",
    default: ""
    // training_exercises: "MuscleExercises",
    // session_exercises,
    // muscle_exercises
  }

  const mapRoutesModels = {
    training_plans: "/training-plan",
    sessions: "/sessions",
    exercises: "/exercises",
    muscles: "/muscles",
    default: ""
    // training_exercises: "MuscleExercises",
    // session_exercises,
    // muscle_exercises
  }

  //--> 
  const mapPagesCreateModelsRoutes = {
    training_plans: "/create-plan",
    sessions: "/create-sessions",
    exercises: "/exercises"
  }

  const mapPagesCreateModelsText = {
    training_plans: "Crea tu Primer Plan de Ejercicio",
    sessions: "Crea tu Primera Session",
    exercises: "Crea tus primeros Ejercicios"
  }

  const mapImageModels = {
    training_plans: "https://images.unsplash.com/photo-1591227174835-d3705c881c90?w=294&dpr=1&h=294&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxjb2xsZWN0aW9uLXRodW1ibmFpbHx8ODMyNTE3MHx8ZW58MHx8fHx8",
    sessions: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Z3ltfGVufDB8fDB8fHww",
    exercises: "https://plus.unsplash.com/premium_photo-1663047277029-a2861ec9fb93?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8ZXhlcmNpc2VzfGVufDB8fDB8fHww",
    muscles: "https://images.unsplash.com/photo-1532889659929-9515eb328750?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxjb2xsZWN0aW9uLXBhZ2V8MTN8OTkwNzI1Nnx8ZW58MHx8fHx8",
    default: "https://images.unsplash.com/photo-1517963628607-235ccdd5476c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGd5bXxlbnwwfHwwfHx8MA%3D%3D"
  }

  return { mapViewModels, mapModels, mapRoutesModels, mapPagesCreateModelsRoutes, mapPagesCreateModelsText, mapImageModels }
}
