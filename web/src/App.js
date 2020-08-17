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
const ActiveUsers = React.lazy(() => import('./pages/ActiveUsers'));
const MyContract = React.lazy(() => import('./pages/MyContract'));
const ActiveAccounts = React.lazy(() => import('./pages/ActiveAccounts'));

let logoutTimer;

const App = () => {
	const [token, setToken] = useState(false);
	const [userId, setUserId] = useState(false);
	const [userRole, setUserRole] = useState(false);
	const [tokenExpirationDate, setTokenExpirationDate] = useState();

	const login = useCallback((userId, token, userRole, expirationDate) => {
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
				storedData.userRole,
				new Date(storedData.expirationDate),
			);
		}

		//!!!!!!NOTA!!!!!!
		//TIRAR ISSO DAQUI DEPOIS
	}, [login]);

	let routes;

	//token
	if (token) {
		if (userRole === 'admin') {
			routes = (
				<Switch>
					<Route path="/" exact>
						<Home />
					</Route>
					<Route path="/admin" exact>
						<Admin />
					</Route>
					<Route path="/newclient" exact>
						<NewClient />
					</Route>
					<Route path="/emailaccounts" exact>
						<EmailAccounts />
					</Route>
					<Route path="/activeusers" exact>
						<ActiveUsers />
					</Route>
					<Redirect to="/" />
				</Switch>
			);
		} else {
			routes = (
				<Switch>
					<Route path="/my/contract" exact>
						<MyContract />
					</Route>
					<Route path="/active/accounts" exact>
						<ActiveAccounts />
					</Route>
					<Route path="/active/users" exact>
						<Home />
					</Route>
					<Route path="/my/equipments" exact>
						<Home />
					</Route>
					<Route path="/my/assets" exact>
						<Home />
					</Route>
					<Redirect to="/my/contract" />
				</Switch>
			);
		}
	} else {
		routes = (
			<Switch>
				<Route path="/login" exatc>
					<Login />
				</Route>
				<Redirect to="/login" />
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
