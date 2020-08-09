import React from 'react';

import Menu from '../../components/Menu';
import { Container, InformationContainer } from './styles';

const Home = () => {
	return (
		<>
			<Container>
				<Menu />
				<InformationContainer>
					<div>hello</div>
				</InformationContainer>
			</Container>
		</>
	);
};

export default Home;
