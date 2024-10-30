const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			message: null,
			isLogin: false,
			user: {},
			isAdmin: false,
			accountExist: "void",  //void, exist, notExist,
			errorMessage: null,
			trainingPlans: {}
		},
		actions: {
			exampleFunction: () => { getActions().changeColor(0, "green"); },
			changeColor: (index, color) => {
				const store = getStore();  // Get the store
				const demo = store.demo.map((element, i) => {
					if (i === index) element.background = color;
					return element;
				});
				setStore({ demo: demo });  // Reset the global store
			},
			login: async (formdata, navigate) => {
				const uri = `${process.env.BACKEND_URL}/api/login`
				const options = {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(formdata),
				};
				const response = await fetch(uri, options);
				if (!response.ok) {
					setStore({ accountExist: "notExist" })
				}
				const data = await response.json()
				localStorage.setItem("token", data.access_token);
				localStorage.setItem("user", JSON.stringify(data.results))
				setStore({ isLogin: true, isAdmin: data.results.is_admin, user: data.results, accountExist: "exist" })
				navigate('/dashboard')
			},
			logout: () => {
				localStorage.removeItem("token");
				localStorage.removeItem("user");
				setStore({ accountExist: "void", isLogin: false, isAdmin: false, user: {} });
			},
			register: async (formdata, navigate) => {
				const uri = `${process.env.BACKEND_URL}/api/register`
				const options = {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(formdata),
				};
				const response = await fetch(uri, options);
				if (!response.ok) {
					const errorMessage = await response.json()
					setStore({ errorMessage: errorMessage.message })
					return
				}
				const data = await response.json()
				localStorage.setItem("token", data.access_token);
				localStorage.setItem("user", JSON.stringify(data.results))
				setStore({ accountExist: "exist", isLogin: true, isAdmin: data.results.is_admin, user: data.results })
				navigate('/dashboard')
			},
			createPlan: async (data, navigate) => {
				console.log(data)
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
					return
				}
				const newTrainingPlan = await response.json()
				console.log("results", newTrainingPlan)
				const prevData = getStore()
				console.log("prevData", prevData)
				setStore({ ...prevData, trainingPlans: [...prevData.trainingPlans.results, newTrainingPlan.results] })
				navigate("/dashboard")

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
				const response = await fetch(uri, options)
				const trainingPlans = await response.json()
				setStore({ trainingPlans })


			}
		}
	};
};

export default getState;
