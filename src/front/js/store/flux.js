const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			message: null,
			isLogin: false,
			user: {},
			isAdmin: false,
			errorMessage: null,
			trainingPlans: {},
			isTrainingPlansLoading: false,
			currentTrainingPlan: {}
		},
		actions: {
			resetState: () => {
				return setStore({
					message: null,
					isLogin: false,
					user: {},
					isAdmin: false,
					errorMessage: null,
					trainingPlans: {},
					isTrainingPlansLoading: false
				})
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
					return alert(data.message)
				}

				localStorage.setItem("token", data.access_token);
				localStorage.setItem("user", JSON.stringify(data.results))
				setStore({ isLogin: true, isAdmin: data?.results?.is_admin, user: data?.results, message: data.message })
				navigate('/dashboard')
			},
			logout: () => {
				localStorage.removeItem("token");
				localStorage.removeItem("user");
				setStore({ isLogin: false, isAdmin: false, user: {}, message: "null", errorMessage: null, });
			},
			isLogin: () => {
				const authToken = localStorage.getItem("token")
				const user = localStorage.getItem("user")

				if (Boolean(authToken) && Boolean(user)) {
					setStore({ isLogin: true, })
					return getActions().getTrainingPlans();
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
			createPlan: async (data, navigate) => {
				const uri = `${process.env.BACKEND_URL}/api/training-plans`
				const authToken = localStorage.getItem("token")
				const options = {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Authorization: ` Bearer ${authToken}`
					},
					body: JSON.stringify(data),
				}
				const response = await fetch(uri, options)

				if (!response.ok) {
					return;
				}
				navigate("/dashboard")
				return response
			},
			getCurrentTrainingPlan: (plan) => {
				setStore({ ...getStore(), currentTrainingPlan: plan, })
			},
			editPlan: async (formData, navigate, currentPlanId) => {
				const uri = `${process.env.BACKEND_URL}/api/training-plans/${currentPlanId}`
				const authToken = localStorage.getItem("token")
				const options = {
					method: 'PUT',
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
					return alert(data.message)
				}
				setStore({ ...getStore(), trainingPlans: data.results })
				navigate("/training-plan")
				// return response
			},
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
				setStore({ ...getStore(), isTrainingPlansLoading: true })
				const response = await fetch(uri, options)
				const trainingPlans = await response.json()
				if (!response.ok) {
					setStore({ isTrainingPlansLoading: false })
					return
				}

				setStore({
					trainingPlans,
					isTrainingPlansLoading: false
				})
			}
		}
	};
};

export default getState;
