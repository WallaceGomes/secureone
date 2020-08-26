import React, { useEffect, useState, useContext } from 'react';

import { Container, AuxCard, DataTable } from './styles';
import Menu from '../../components/Menu';
import { useHttpClient } from '../../hooks/http-hook';
import LoadingSpinner from '../../components/LoadingSpinner';
import { AuthContext } from '../../util/AuthContext';

const ClientActiveUsers = () => {
	const [activeUsers, setActiveUsers] = useState([]);

	const { sendRequest, isLoading } = useHttpClient();
	const auth = useContext(AuthContext);

	useEffect(() => {
		//https://secureone-backend.herokuapp.com
		//http://localhost:3333
		sendRequest(
			`https://secureone-backend.herokuapp.com/api/active/${auth.userId}`,
			'GET',
			null,
			{
				Authorization: 'Bearer ' + auth.token,
			},
		).then((response) => {
			setActiveUsers(response);
		});
	}, [sendRequest, auth]);

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
