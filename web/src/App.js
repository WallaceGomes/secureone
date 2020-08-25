import React, { Suspense, useCallback, useState, useEffect } from 'react';

//change to HashRouter if you get a blanc page in statig hosting
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
const ClientActiveUsers = React.lazy(() => import('./pages/ClientActiveUsers'));
const EnterpriseAssets = React.lazy(() => import('./pages/EnterpriseAssets'));
const ClientEnterpriseAssets = React.lazy(() =>
	import('./pages/ClientEnterpriseAssets'),
);
const AdminEmailAccounts = React.lazy(() =>
	import('./pages/AdminEmailAccounts'),
);
const AdminActiveUsers = React.lazy(() => import('./pages/AdminActiveUsers'));
const AdminEnterpriseAssets = React.lazy(() =>
	import('./pages/AdminEnterpriseAssets'),
);
const NewEquipments = React.lazy(() => import('./pages/NewEquipment'));
const AdminEquipments = React.lazy(() => import('./pages/AdminEquipments'));
const ClientEquipments = React.lazy(() => import('./pages/ClientEquipments'));

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
					<Route path="/new/emailaccounts" exact>
						<EmailAccounts />
					</Route>
					<Route path="/admin/emailaccounts" exact>
						<AdminEmailAccounts />
					</Route>
					<Route path="/activeusers" exact>
						<ActiveUsers />
					</Route>
					<Route path="/admin/activeusers" exact>
						<AdminActiveUsers />
					</Route>
					<Route path="/newasset" exact>
						<EnterpriseAssets />
					</Route>
					<Route path="/admin/assets" exact>
						<AdminEnterpriseAssets />
					</Route>
					<Route path="/new/equipment" exact>
						<NewEquipments />
					</Route>
					<Route path="/admin/equipments" exact>
						<AdminEquipments />
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
						<ClientActiveUsers />
					</Route>
					<Route path="/my/equipments" exact>
						<ClientEquipments />
					</Route>
					<Route path="/my/assets" exact>
						<ClientEnterpriseAssets />
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
