import React from "react";

const PrivatePage = () => {
    const handleLogout = () => {
        // Aquí puedes agregar la lógica de logout, como redirigir al login o limpiar tokens.
        alert("You have been logged out.");
        // Redirigir al login (si usas React Router, usa navigate)
        window.location.href = "/login"; // Cambia esto según tu routing
    };

    return (
        <div className="container">
            <div className="row justify-content-center mt-5">
                <div className="col-md-6">
                    <div className="card shadow">
                        <div className="card-header text-center bg-danger text-white">
                            <h3>Protected Page</h3>
                        </div>
                        <div className="card-body text-center">
                            <p className="mb-4">
                                🚫 This page is protected. Only authorized users can access it.
                            </p>
                            <button 
                                className="btn btn-danger w-100" 
                                onClick={handleLogout}>
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrivatePage;
