const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			message: null,
			isLogin: false,
			user: {},
			isAdmin: false,
		},
		actions: {
			exampleFunction: () => { getActions().changeColor(0, "green"); },
			getMessage: async () => {
				const uri = `${process.env.BACKEND_URL}/api/hello`
				const options = {
					method: 'GET'
				}
				const response = await fetch(uri, options)
				if (!response.ok) {
					console.log("Error loading message from backend", response.status)
					return
				}
				const data = await response.json()
				setStore({ message: data.message })
				return data;
			},
			changeColor: (index, color) => {
				const store = getStore();  // Get the store
				const demo = store.demo.map((element, i) => {
					if (i === index) element.background = color;
					return element;
				});
				setStore({ demo: demo });  // Reset the global store
			},
			login: async (formdata) => {
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
					return
				}
				const data = await response.json()
				localStorage.setItem("token", data.access_token);
				localStorage.setItem("user", JSON.stringify(data.results))
				setStore({ isLogin: true, isAdmin: data.results.is_admin, user: data.results })
			},
			logout: () => {
				localStorage.removeItem("token");
				localStorage.removeItem("user");
				setStore({ isLogin: false, isAdmin: false, user: {} });
			},
			register: async (formdata) => {
				const uri = `${process.env.BACKEND_URL}/api/register`
				const options = {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(formdata),
				};
				const response = await fetch(uri, options);
				console.log(response);
				if (!response.ok) {
					return
				}
				const data = await response.json()
				localStorage.setItem("token", data.access_token);
				localStorage.setItem("user", JSON.stringify(data.results))
				setStore({ isLogin: true, isAdmin: data.results.is_admin, user: data.results })
			},
		}
	};
};

export default getState;
