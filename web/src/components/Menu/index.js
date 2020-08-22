import React, { useContext } from 'react';
import { FiLogOut } from 'react-icons/fi';
import { Wraper, MenuUl, MenuItem, LogoutButtom } from './styles';
//import Logo from '../Logo';
import logo from '../../assets/logo.png';
import { Link } from 'react-router-dom';

import { AuthContext } from '../../util/AuthContext';

const Menu = () => {
	const auth = useContext(AuthContext);

	let menu;

	if (auth.userRole === 'admin') {
		menu = (
			<MenuUl>
				<Link to="/newclient">
					<MenuItem>Novo Cliente</MenuItem>
				</Link>
				<Link to="/admin">
					<MenuItem>Administrar Clientes</MenuItem>
				</Link>
				<Link to="/emailaccounts">
					<MenuItem>Contas Email</MenuItem>
				</Link>
				<Link to="/activeusers">
					<MenuItem>Usuários Ativos</MenuItem>
				</Link>
				<Link to="/">
					<MenuItem>Equipamentos Watchguard</MenuItem>
				</Link>
				<Link to="/">
					<MenuItem>Ativos da empresa</MenuItem>
				</Link>
				<div>
					<LogoutButtom onClick={auth.logout}>Logout</LogoutButtom>
				</div>
			</MenuUl>
		);
	}

	if (auth.userRole === 'client') {
		menu = (
			<MenuUl>
				<Link to="/my/contract">
					<MenuItem>Meu contrato</MenuItem>
				</Link>
				<Link to="/active/accounts">
					<MenuItem>E-mails</MenuItem>
				</Link>
				<Link to="/active/users">
					<MenuItem>Usuários ativos</MenuItem>
				</Link>
				<Link to="/">
					<MenuItem>Equipamentos Watchguard</MenuItem>
				</Link>
				<Link to="/">
					<MenuItem>Ativos da empresa</MenuItem>
				</Link>
				<div>
					<LogoutButtom onClick={auth.logout}>Logout</LogoutButtom>
				</div>
			</MenuUl>
		);
	}

	return (
		<Wraper>
			<Link to="/">
				<img src={logo} alt="Logo" />
			</Link>
			{menu}
		</Wraper>
	);
};

export default Menu;
