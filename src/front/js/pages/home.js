import React, { useContext } from "react";
import { Context } from "../store/appContext";
import rigoImageUrl from "../../img/rigo-baby.jpg";
import "../../styles/home.css";
import Signup from "../component/signUp";
import Login from "../component/login";
import Privatepage from "../component/private";

export const Home = () => {
	const { store, actions } = useContext(Context);

	return (
		<div className="text-center mt-5">
			<Signup/>
			<Login/>
			<Privatepage/>
			
		</div>
	);
};
