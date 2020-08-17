import React, { useEffect, useState } from 'react';

import { Container, AuxCard, StyledCard } from './styles';
import Menu from '../../components/Menu';
import { useHttpClient } from '../../hooks/http-hook';
import LoadingSpinner from '../../components/LoadingSpinner';
import Wraper from '../../components/Wraper';

const ClientActiveUsers = () => {
	const [activeUsers, setActiveUsers] = useState([]);

	const { sendRequest, isLoading } = useHttpClient();

	useEffect(() => {
		const storedData = JSON.parse(localStorage.getItem('userData'));

		sendRequest(
			`http://localhost:3333/api/active/${storedData.userId}`,
			'GET',
			null,
		).then((response) => {
			setActiveUsers(response);
			console.log(response);
		});
	}, [sendRequest]);

	return (
		<Container>
			<Menu />
			{isLoading && <LoadingSpinner />}
			<AuxCard>
				<h1>Usuários Ativos</h1>
				<Wraper>
					{activeUsers.map((user) => {
						return (
							<StyledCard key={user._id}>
								<strong>Nome: {user.name}</strong>
								<span>E-mail: {user.email}</span>
								<span>Team Viewer: {user.teamviewer}</span>
								<span>Senha Team Viewer: {user.tvpassword}</span>
								<span>Telefone: {user.phone}</span>
								<span>Login: {user.login}</span>
							</StyledCard>
						);
					})}
				</Wraper>
			</AuxCard>
		</Container>
	);
};

export default ClientActiveUsers;
