import React, { useEffect, useState } from 'react';

import { Container, AuxCard, DataTable } from './styles';
import Menu from '../../components/Menu';
import { useHttpClient } from '../../hooks/http-hook';
import LoadingSpinner from '../../components/LoadingSpinner';

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
				<DataTable>
					<tbody>
						<tr>
							<th>Nome</th>
							<th>E-mail</th>
							<th>Team Viewer</th>
							<th>Senha Team Viewer</th>
							<th>Telefone</th>
							<th>Login</th>
						</tr>
					</tbody>
					{activeUsers &&
						activeUsers.map((user) => {
							return (
								<tr key={user._id}>
									<td>{user.name}</td>
									<td>{user.email}</td>
									<td>{user.teamviewer}</td>
									<td>{user.tvpassword}</td>
									<td>{user.phone}</td>
									<td>{user.login}</td>
								</tr>
							);
						})}
				</DataTable>
			</AuxCard>
		</Container>
	);
};

export default ClientActiveUsers;
