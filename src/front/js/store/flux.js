const initialState = {
	message: null,
	isLogin: false,
	user: {},
	errorMessage: null,
	isLoginLoading: false,
	hasFetchedData: false,
	isSessionExpired: false,
	hasCheckedSession: false,
	isAppLoading: true,
	muscles: [],
	trainingPlansStates: {
		trainingPlans: [],
		isTrainingPlansLoading: false,
		currentTrainingPlan: {},
		trainingPlansCount: 0,
		action: ""
	},
	sessionsStates: {
		isSessionsLoading: false,
		sessions: [],
		sessionsCount: 0,
	},
	exercisesStates: {
		exercises: [],
		sessionExercises: [],
		trainingPlanExercises: [],
	},
}

const getState = ({ getStore, getActions, setStore }) => {

	const fetchData = async ({ endpoint, method = "GET", authToken = true, body = null }) => {
		const headers = {
			"Content-Type": "application/json",
		};

		if (authToken) {
			const token = localStorage.getItem("token");
			if (token) headers["Authorization"] = `Bearer ${token}`;
		}

		const url = `${process.env.BACKEND_URL}/api/${endpoint}`;

		try {
			const response = await fetch(url, { method, headers, body: body ? JSON.stringify(body) : null });
			const data = await response.json();


			if (response.status === 401) {
				getActions().logout(); // Limpiar estado y localStorage
				getActions().setSessionExpired(); // Actualizar el estado para el modal
				return { error: "Sesión expirada. Por favor, vuelve a iniciar sesión.", data: null };
			}

			if (!response.ok) {
				return { error: data.message || "Ocurrió un error.", data: null };
			}

			return { error: null, data };
		} catch (error) {
			return { error: "Error de red.", data: null };
		}
	};
	return {
		store: { ...initialState },
		actions: {
			checkMount: () => {
				console.log("monte mi contexto, esto quiere decir que solo se montara una vez y no volvera a tener lectura en el dashboard")
			},
			resetState: () => {
				return setStore({ ...initialState })
			},
			setSessionExpired: () => {
				console.log("entren en el vencimiento de la sesion")
				setStore({ isSessionExpired: true });
			},
			loadInitialData: async () => {
				try {
					setStore({ isAppLoading: true });
					await Promise.all([
						getActions().getTrainingPlanExercises(),
						getActions().getTrainingPlans(),
						getActions().getMuscles(),
						getActions().getSessions(),
						getActions().getExercises(),
						getActions().getSessionExercises(),
					])
					setStore({
						...getStore(),
						hasFetchedData: true,
						isAppLoading: false
					});

				} catch (error) {
					console.warn("Error cargando los datos iniciales", error)
					setStore({
						...getStore(),
						hasFetchedData: false,
						isAppLoading: false
					});
				}

			},
			login: async (formData, navigate) => {
				setStore({ errorMessage: null, isLoginLoading: true });
				const { error, data } = await fetchData({ endpoint: "login", method: "POST", authToken: false, body: formData, });
				if (error) {
					setStore({ message: error, errorMessage: error, isLoginLoading: false });
					return;
				}
				localStorage.setItem("token", data.access_token);
				localStorage.setItem("user", JSON.stringify(data.results));
				setStore({
					isLogin: true,
					user: data?.results,
					message: data?.message,
					isLoginLoading: false,
					hasFetchedData: false,
				});
				getActions().loadInitialData()
				navigate("/dashboard");
			},
			logout: () => {
				console.log("entre en el logout")
				localStorage.removeItem("token");
				localStorage.removeItem("user");
				setStore({
					isLogin: false,
					user: {},
					message: null,
					errorMessage: null,
					hasCheckedSession: false,
					hasFetchedData: false,
					isSessionExpired: false,
				});
			},
			isLogin: async () => {
				const token = localStorage.getItem("token");
				const user = localStorage.getItem("user")

				if (!token) {
					setStore({ isLogin: false, hasCheckedSession: true });
					return;
				}

				if (token && user) {
					const { error, data: validToken } = await fetchData({ endpoint: "validate-token", authToken: true });
					if (validToken) {
						setStore({
							...getStore(),
							isLogin: true,
							user: JSON.parse(user),
							hasFetchedData: false,
							hasCheckedSession: true
						});

						getActions().loadInitialData();
					} else {
						console.warn("Token no válido. Por favor, vuelve a iniciar sesión.");
						setStore({ isLogin: false, user: {}, message: "Tu sesión ha caducado.", isSessionExpired: true });
					}

				} else {
					setStore({ isLogin: false, user: {}, hasCheckedSession: true });
				}

			},
			register: async (formData, navigate) => {
				// setStore({ isAppLoading: true });
				const { error, data } = await fetchData({ endpoint: "register", method: "POST", authToken: false, body: formData, });
				if (error) {
					setStore({ errorMessage: error, message: error, isLoginLoading: false });
					return;
				}
				localStorage.setItem("token", data.access_token);
				localStorage.setItem("user", JSON.stringify(data.results));
				setStore({
					isLogin: true,
					user: data.results,
					message: data.message,
					isAppLoading: false,
				});
				getActions().loadInitialData()
				navigate("/dashboard");
			},
			getTrainingPlans: async () => {
				const { isSessionExpired } = getStore();
				if (isSessionExpired) return;
				const { error, data } = await fetchData({ endpoint: "training-plans", method: "GET" });
				if (error) return
				setStore({
					...getStore(),
					trainingPlansStates: {
						...getStore().trainingPlansStates,
						trainingPlansCount: data.results.length,
						trainingPlans: data.results,
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
				setStore({ ...getStore(), trainingPlansStates: { ...getStore().trainingPlansStates, isTrainingPlansLoading: true } })
				const response = await fetch(uri, options)
				const data = await response.json()
				if (!response.ok) {
					setStore({ errorMessage: data.message, message: data.message, trainingPlansStates: { ...getStore().trainingPlansStates, isTrainingPlansLoading: false } })
				}

				getActions().getTrainingPlanExercises()
				getActions().getSessionExercises()
				getActions().getTrainingPlans()
				setStore({ ...getStore(), trainingPlansStates: { ...getStore().trainingPlansStates, isTrainingPlansLoading: false } })
				navigate("/training-plan")
				return response
			},
			getSessions: async () => {
				const { error, data } = await fetchData({ endpoint: "sessions", method: "GET" });

				if (error) return

				setStore({
					...getStore(),
					sessionsStates: {
						...getStore().sessionsStates,
						sessions: data.results,
						sessionsCount: data.results.length
					}
				});
			},
			createSessions: async ({ formData, navigate, }) => {
				setStore({ ...getStore(), sessionsStates: { ...getStore().sessionsStates, isSessionsLoading: true } });
				const { error, data } = await fetchData({ endpoint: "sessions", method: "POST", body: formData });
				if (error) {
					setStore({
						...getStore(),
						errorMessage: error,
						message: error,
						sessionsStates: {
							isSessionsLoading: false
						}
					});
					return;
				}
				setStore({ ...getStore(), message: data.message, });

				await getActions().getTrainingPlans();
				await getActions().getSessionExercises();
				await getActions().getSessions();
				await navigate("/sessions");

			},
			getTrainingPlanExercises: async () => {
				const { error, data } = await fetchData({ endpoint: "training-exercises", method: "GET" });

				if (error) {
					return;
				}
				setStore({
					...getStore(),
					exercisesStates: {
						...getStore().exercisesStates,
						trainingPlanExercises: data.results,
					}
				});
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
				const { error, data } = await fetchData({ endpoint: "exercises", method: "GET" });

				if (error) return

				setStore({
					...getStore(),
					exercisesStates: {
						...getStore().exercisesStates,
						exercises: data.results,
					}
				});

			},
			getMuscles: async () => {
				const { error, data } = await fetchData({ endpoint: "muscles", method: "GET" });

				if (error) return

				setStore({
					...getStore(),
					muscles: data.results,

				});

			},
			getSessionExercises: async () => {
				const { error, data } = await fetchData({ endpoint: "session-exercises", });

				if (error) {
					return setStore({
						...getStore(),
						errorMessage: error,
						exercisesStates: {
							...getStore().exercisesStates,
						}
					});
				}

				setStore({
					...getStore(),
					exercisesStates: {
						...getStore().exercisesStates,
						sessionExercises: data.results,
					}
				});

			},
			updateSessionExercises: async (exercisesToUpdate) => {

				const { error, data } = await fetchData({
					endpoint: "session-exercises",
					method: "PUT",
					body: { exercises: exercisesToUpdate }  // Pasar todos los ejercicios en un solo request
				});

				if (error) {
					setStore({
						...getStore(),
						errorMessage: error,
						message: error,
					});
					return;
				}

				const updatedExercises = data.results.updated || [];
				setStore({
					...getStore(),
					message: data.message,
					exercisesStates: {
						...getStore().exercisesStates,
						sessionExercises: getStore().exercisesStates.sessionExercises.map(exercise => {
							const updatedExercise = updatedExercises.find(e => e.id === exercise.id);
							return updatedExercise ? { ...exercise, ...updatedExercise } : exercise;
						}),
					}
				});


				getActions().getSessionExercises();
				getActions().getSessions();
				getActions().getTrainingPlans();
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
				const response = await fetch(uri, options)
				const test = await response.json()


			},
		}
	};
};

export default getState;
