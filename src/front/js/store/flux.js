const initialState = {
	message: null,
	isLogin: false,
	user: {},
	isAdmin: false,
	errorMessage: null,
	trainingPlansStates: {
		trainingPlans: [],
		isTrainingPlansLoading: false,
		currentTrainingPlan: {},
		filter: "",
		action: ""
	},
	sessionsStates: {
		isSessionsLoading: false,
		sessions: [],
	},
	exercisesStates: {
		trainingPlanExercises: [],
		isExercisesLoading: false,
		exercises: []
	}
}

const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: { ...initialState },
		actions: {
			checkMount: () => {
				console.log("monte mi contexto, esto quiere decir que solo se montara una vez y no volvera a tener lectura en el dashboard")
			},
			resetState: () => {
				return setStore({ ...initialState })
			},
			login: async (formdata, navigate) => {
				setStore({ errorMessage: null, })
				const uri = `${process.env.BACKEND_URL}/api/login`
				const options = {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(formdata),
				};
				const response = await fetch(uri, options);
				const data = await response.json()
				if (!response.ok) {
					setStore({ message: data.message, errorMessage: data.message })
				}

				localStorage.setItem("token", data.access_token);
				localStorage.setItem("user", JSON.stringify(data.results))
				setStore({
					isLogin: true,
					isAdmin: data?.results?.is_admin,
					user: data?.results,
					message: data.message
				})
				navigate('/dashboard')
			},
			logout: () => {
				localStorage.removeItem("token");
				localStorage.removeItem("user");
				setStore({ isLogin: false, isAdmin: false, user: {}, message: null, errorMessage: null, });
			},
			isLogin: () => {
				const authToken = localStorage.getItem("token")
				const user = localStorage.getItem("user")

				//--> todo esto es de prueba
				if (Boolean(authToken) && Boolean(user)) {
					setStore({ ...getStore(), isLogin: true, })
					getActions().getTrainingPlans();
					getActions().getSessions();
					getActions().getExercises();
					getActions().getTrainingPlanExercises();
				}

			},
			register: async (formdata, navigate) => {
				setStore({ errorMessage: null, })
				const uri = `${process.env.BACKEND_URL}/api/register`
				const options = {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(formdata),
				};
				const response = await fetch(uri, options);
				const data = await response.json()
				if (!response.ok) {
					setStore({ errorMessage: data.message, message: data.message, })
					return alert(data.message)
				}
				localStorage.setItem("token", data.access_token);
				localStorage.setItem("user", JSON.stringify(data.results))
				setStore({ isLogin: true, isAdmin: data.results.is_admin, user: data.results, message: data.message })
				navigate('/dashboard')
			},
			// trainingPlans
			getTrainingPlans: async () => {
				const uri = `${process.env.BACKEND_URL}/api/training-plans`
				const authToken = localStorage.getItem("token")
				const options = {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						Authorization: ` Bearer ${authToken}`
					}
				}
				setStore({ ...getStore(), trainingPlansStates: { ...getStore().trainingPlansStates, isTrainingPlansLoading: true } })
				const response = await fetch(uri, options)
				const trainingPlans = await response.json()
				if (!response.ok) {
					setStore({ ...getStore(), trainingPlansStates: { ...getStore().trainingPlansStates, isTrainingPlansLoading: false } })
					return
				}
				setStore({
					...getStore(),
					trainingPlansStates: {
						...getStore().trainingPlansStates,
						trainingPlansCount: trainingPlans.results.length,
						trainingPlans: trainingPlans.results,
						isTrainingPlansLoading: false
					}
				})
			},
			getCurrentTrainingPlan: (plan) => {
				setStore({
					...getStore(),
					trainingPlansStates: {
						...getStore().trainingPlansStates,
						currentTrainingPlan: plan
					}
				})
			},
			setAction: (action) => {
				setStore({
					...getStore(),
					trainingPlansStates: {
						...getStore().trainingPlansStates,
						action
					}
				})
			},
			crudTrainingPlans: async ({ formData, navigate, currentPlanId, action }) => {
				const method = {
					create: "POST",
					edit: "PUT",
					delete: "DELETE"
				}
				const uri = `${process.env.BACKEND_URL}/api/training-plans${action !== "create" ? `/${currentPlanId}` : ""}`
				const authToken = localStorage.getItem("token")
				const options = {
					method: method[action],
					headers: {
						'Content-Type': 'application/json',
						Authorization: ` Bearer ${authToken}`
					},
					body: JSON.stringify(formData),
				}
				const response = await fetch(uri, options)
				const data = await response.json()
				if (!response.ok) {
					setStore({ errorMessage: data.message, message: data.message, })
				}
				
				getActions().getTrainingPlans()
				getActions().getTrainingPlanExercises()

				navigate("/training-plan")
				return response
			},
			setTrainingPlansFilters: (filter) => {
				setStore({ ...getStore(), trainingPlansStates: { ...getStore().trainingPlansStates, filter: filter } })
			},
			//Sessions
			getSessions: async () => {
				const uri = `${process.env.BACKEND_URL}/api/sessions`
				const authToken = localStorage.getItem("token")
				const options = {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						Authorization: ` Bearer ${authToken}`
					}
				}
				setStore({ ...getStore(), sessionsStates: { ...getStore().sessionsStates, isSessionsLoading: true } })
				const response = await fetch(uri, options)
				const sessions = await response.json()
				if (!response.ok) {
					setStore({ ...getStore(), sessionsStates: { ...getStore().sessionsStates, isSessionsLoading: false } })
					return
				}
				setStore({
					...getStore(),
					sessionsStates: {
						...getStore().sessionsStates,
						sessions: sessions.results,
						isSessionsLoading: false
					}
				})

			},
			createSessions: async ({ formData, navigate, }) => {
				const uri = `${process.env.BACKEND_URL}/api/sessions`
				const authToken = localStorage.getItem("token")
				const options = {
					method: "POST",
					headers: {
						'Content-Type': 'application/json',
						Authorization: ` Bearer ${authToken}`
					},
					body: JSON.stringify(formData),
				}
				const response = await fetch(uri, options)
				const data = await response.json()
				if (!response.ok) {
					setStore({ errorMessage: data.message, message: data.message, })
				}


				setStore({
					...getStore(),
					message: data.message,
					sessionsStates: {
						...getStore().sessionsStates,
					}
				})
				navigate("/sessions")
				return response
			},
			setTrainingPlanExercises: async (formData, navigate, update) => {

				const uri = `${process.env.BACKEND_URL}/api/training-exercises`
				const authToken = localStorage.getItem("token")
				const options = {
					method: update ? 'PUT' : 'POST',
					headers: {
						'Content-Type': 'application/json',
						Authorization: ` Bearer ${authToken}`
					},
					body: JSON.stringify(formData),
				}
				const response = await fetch(uri, options)
				const data = await response.json()

				if (!response.ok) {
					return setStore({ errorMessage: data.message, message: data.message, })
				}
				setStore({
					...getStore(),
					message: data.message,
					exercisesStates: {
						...getStore().exercisesStates,
						trainingPlanExercises: [
							...getStore().exercisesStates.trainingPlanExercises,
							data.results
						]
					}
				})
				navigate("/training-plan")
				console.log("data adentro del setTPE", data)
				return response
			},
			//Exercises
			getTrainingPlanExercises: async () => {
				const uri = `${process.env.BACKEND_URL}/api/training-exercises`
				const authToken = localStorage.getItem("token")
				const options = {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						Authorization: ` Bearer ${authToken}`
					}
				}
				// setStore({ ...getStore(), exercisesStates: { ...getStore().exercisesStates, isExercisesLoading: true } })
				const response = await fetch(uri, options)
				const exercises = await response.json()
				if (!response.ok) {
					// setStore({ ...getStore(), exercisesStates: { ...getStore().exercisesStates, isExercisesLoading: false } })
					return
				}


				setStore({
					...getStore(),
					exercisesStates: {
						...getStore().exercisesStates,
						trainingPlanExercises: exercises.results,
						// isExercisesLoading: false
					}
				})

			},
			setLinkedTPE: (tpe) => {
				setStore({
					...getStore(),
					exercisesStates: {
						...getStore().exercisesStates,
						linkedTPE: tpe
					}
				})

			},
			getExercises: async () => {
				const uri = `${process.env.BACKEND_URL}/api/exercises`
				const authToken = localStorage.getItem("token")
				const options = {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						Authorization: ` Bearer ${authToken}`
					}
				}
				setStore({ ...getStore(), exercisesStates: { ...getStore().exercisesStates, isExercisesLoading: true } })
				const response = await fetch(uri, options)
				const exercises = await response.json()
				if (!response.ok) {
					setStore({ ...getStore(), exercisesStates: { ...getStore().exercisesStates, isExercisesLoading: false } })
					return
				}
				setStore({
					...getStore(),
					exercisesStates: {
						...getStore().exercisesStates,
						exercises: exercises.results,
						isExercisesLoading: false
					}
				})

			},
			getInitial: async () => {
				const uri = `${process.env.BACKEND_URL}/api/initial-setup`
				const authToken = localStorage.getItem("token")
				const options = {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						Authorization: ` Bearer ${authToken}`
					}
				}
				setStore({ ...getStore(), exercisesStates: { ...getStore().exercisesStates, isExercisesLoading: true } })
				const response = await fetch(uri, options)
				const test = await response.json()
				console.log("test", test)
				// if (!response.ok) {
				// 	setStore({ ...getStore(), exercisesStates: { ...getStore().exercisesStates, isExercisesLoading: false } })
				// 	return
				// }
				// setStore({
				// 	...getStore(),
				// 	exercisesStates: {
				// 		...getStore().exercisesStates,
				// 		exercises: exercises.results,
				// 		isExercisesLoading: false
				// 	}
				// })

			},
		}
	};
};

export default getState;
