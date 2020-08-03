import React from 'react';
import { useHistory } from 'react-router-dom';

import { MainLogo } from './styles';
import logo from '../../assets/logo.png';
import { Link } from 'react-router-dom';

//aqui dá pra fazer a logo dinâmica
//trocar a por link depois

const Logo = () => {
	const history = useHistory();

	const redirectHandler = () => {
		history.push('/');
	};

	return (
		<MainLogo onClick={() => redirectHandler()}>
			<img src={logo} alt="Logo" />
			<Link to="/"></Link>
		</MainLogo>
	);
};

export default Logo;
