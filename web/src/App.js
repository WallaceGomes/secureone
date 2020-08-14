import React, { Suspense, useCallback, useState, useEffect } from 'react';

import {
	BrowserRouter as Router,
	Route,
	Redirect,
	Switch,
} from 'react-router-dom';

import LoadingSpinner from './components/LoadingSpinner';
import { AuthContext } from './util/AuthContext';

import './App.css';

const Home = React.lazy(() => import('./pages/Home'));
const Login = React.lazy(() => import('./pages/Login'));
const Admin = React.lazy(() => import('./pages/Admin'));
const NewClient = React.lazy(() => import('./pages/NewClient'));
const EmailAccounts = React.lazy(() => import('./pages/EmailAccounts'));

let logoutTimer;

const App = () => {
	const [token, setToken] = useState(false);
	const [userId, setUserId] = useState(false);
	const [userRole, setUserRole] = useState(false);
	const [tokenExpirationDate, setTokenExpirationDate] = useState();

	const login = useCallback((userId, token, expirationDate, userRole) => {
		setToken(token);
		setUserId(userId);
		setUserRole(userRole);

		const tokenExpirationDateNew =
			expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60 * 12);
		setTokenExpirationDate(tokenExpirationDateNew);

		localStorage.setItem(
			'userData',
			JSON.stringify({
				userId: userId,
				token: token,
				userRole: userRole,
				expirationDate: tokenExpirationDateNew.toISOString(),
			}),
		);
	}, []);

	const logout = useCallback(() => {
		setToken(null);
		setUserId(null);
		setTokenExpirationDate(null);
		setUserRole(null);

		localStorage.removeItem('userData');
	}, []);

	useEffect(() => {
		if (token && tokenExpirationDate) {
			const remainingTime =
				tokenExpirationDate.getTime() - new Date().getTime();
			logoutTimer = setTimeout(logout, remainingTime);
		} else {
			clearTimeout(logoutTimer);
		}
	}, [token, logout, tokenExpirationDate]);

	useEffect(() => {
		const storedData = JSON.parse(localStorage.getItem('userData'));

		if (
			storedData &&
			storedData.token &&
			new Date(storedData.expirationDate) > new Date()
		) {
			login(
				storedData.userId,
				storedData.token,
				new Date(storedData.expirationDate),
				storedData.userRole,
			);
		}

		//!!!!!!NOTA!!!!!!
		//TIRAR ISSO DAQUI DEPOIS
		setUserRole('admin');
	}, [login]);

	let routes;

	//token
	if (true) {
		routes = (
			<Switch>
				<Route path="/" exact>
					<Home />
				</Route>
				<Route path="/login" exact>
					<Login />
				</Route>
				<Route path="/admin" exact>
					<Admin />
				</Route>
				<Route path="/newclient">
					<NewClient />
				</Route>
				<Route path="/emailaccounts">
					<EmailAccounts />
				</Route>
				<Redirect to="/" />
			</Switch>
		);
	} else {
		routes = (
			<Switch>
				<Route path="/" exatc>
					<Login />
				</Route>
				<Redirect to="/" />
			</Switch>
		);
	}

	return (
		<AuthContext.Provider
			value={{
				isLoggedIn: !!token,
				token: token,
				userId: userId,
				userRole: userRole,
				login: login,
				logout: logout,
			}}
		>
			<Router>
				<main>
					<Suspense
						fallback={
							<div className="center">
								<LoadingSpinner />
							</div>
						}
					>
						{routes}
					</Suspense>
				</main>
			</Router>
		</AuthContext.Provider>
	);
};

export default App;
