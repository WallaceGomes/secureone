import React, { useContext } from 'react';
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
				<Link to="/admin">
					<MenuItem>Administrar Clientes</MenuItem>
				</Link>
				<Link to="/admin/emailaccounts">
					<MenuItem>Administrar Emails</MenuItem>
				</Link>
				<Link to="/admin/activeusers">
					<MenuItem>Admin Usuários Ativos</MenuItem>
				</Link>
				<Link to="/admin/equipments">
					<MenuItem>Admin Equips Watchguard</MenuItem>
				</Link>
				<Link to="/admin/assets">
					<MenuItem>Administrar ativos</MenuItem>
				</Link>
				<Link to="/admin/licenses">
					<MenuItem>Administrar Licenças</MenuItem>
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
				<Link to="/my/equipments">
					<MenuItem>Equipamentos Watchguard</MenuItem>
				</Link>
				<Link to="/my/assets">
					<MenuItem>Ativos da empresa</MenuItem>
				</Link>
				<Link to="/my/licenses">
					<MenuItem>Licenças</MenuItem>
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
