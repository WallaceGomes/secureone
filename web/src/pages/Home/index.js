import React from 'react';

import Menu from '../../components/Menu';
import { Container } from './styles';

const Home = () => {
	return (
		<>
			<Container>
				<Menu />
				<div>Hello World</div>
			</Container>
		</>
	);
};

export default Home;
