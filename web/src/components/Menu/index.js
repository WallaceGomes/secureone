import React, { useContext } from 'react';
import { Wraper, MenuUl, MenuItem } from './styles';
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
					<MenuItem>Contas Email Ativas</MenuItem>
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
					<MenuItem>Contas ativas</MenuItem>
				</Link>
				<Link to="/">
					<MenuItem>Usuários ativos</MenuItem>
				</Link>
				<Link to="/">
					<MenuItem>Equipamentos Watchguard</MenuItem>
				</Link>
				<Link to="/">
					<MenuItem>Ativos da empresa</MenuItem>
				</Link>
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
