const getState = ({ getStore, getActions, setStore }) => {
    return {
        store: {
            message: null,
            token: null, // Token del usuario para autenticar las solicitudes
            user: null, // Información del usuario autenticado (opcional)
            loading: false, // Estado de carga para manejar solicitudes asíncronas
        },
        actions: {
            // Acción para registrar un nuevo usuario
            signUp: async (email, password, navigate) => {
                setStore({ loading: true }); // Indica que se está realizando una operación
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}api/signup`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({ email, password })
                    });

                    if (response.ok) {
                        console.log("User successfully registered.");
                        // navigate("/login"); // Redirige al usuario a la página de inicio de sesión
                    } else {
                        const errorData = await response.json(); // Captura detalles del error
                        console.log("Failed to register user:", errorData);
                        alert(errorData.message || "Registration failed. Please try again.");
                    }
                } catch (error) {
                    console.error("Error in signUp:", error);
                    alert("An error occurred during registration. Please try again later.");
                } finally {
                    setStore({ loading: false }); // Finaliza el estado de carga
                }
            },

            // Acción para iniciar sesión de un usuario
            logIn: async (email, password, navigate) => {
                setStore({ loading: true }); // Indica que se está realizando una operación
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/login`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({ email, password })
                    });

                    if (response.ok) {
                        const data = await response.json();
                        setStore({ token: data.token, user: data.user, loading: false }); // Guarda el token y los datos del usuario
                        console.log("User successfully logged in.");
                        navigate("/private"); // Redirige al área protegida
                    } else {
                        const errorData = await response.json(); // Captura detalles del error
                        console.log("Failed to log in:", errorData);
                        alert(errorData.message || "Invalid credentials. Please try again.");
                        setStore({ loading: false });
                    }
                } catch (error) {
                    console.error("Error in logIn:", error);
                    alert("An error occurred during login. Please try again later.");
                    setStore({ loading: false });
                }
            },

            // Acción para obtener datos privados protegidos
            getPrivateData: async () => {
                const store = getStore();
                if (!store.token) {
                    console.log("No token found. User is not authenticated.");
                    return;
                }

                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/private`, {
                        method: "GET",
                        headers: {
                            "Authorization": `Bearer ${store.token}`
                        }
                    });

                    if (response.ok) {
                        const data = await response.json();
                        console.log("Private data fetched:", data);
                        return data;
                    } else {
                        const errorData = await response.json(); // Captura detalles del error
                        console.log("Failed to fetch private data:", errorData);
                    }
                } catch (error) {
                    console.error("Error in getPrivateData:", error);
                }
            },

            // Acción para cerrar sesión
            logout: () => {
                setStore({ token: null, user: null }); // Limpia el token y los datos del usuario
                console.log("User logged out.");
            },

            // Acción para obtener un mensaje
            getMessage: async () => {
                setStore({ loading: true }); // Indica que se está realizando una operación
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/hello`);
                    const data = await response.json();
                    setStore({ message: data.message });
                } catch (error) {
                    console.error("Error loading message from backend", error);
                    alert("An error occurred while fetching the message.");
                } finally {
                    setStore({ loading: false }); // Finaliza el estado de carga
                }
            },
        }
    };
};

export default getState;
