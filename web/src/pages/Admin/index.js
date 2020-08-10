import React, { useEffect, useState } from 'react';
import { AiFillEdit, AiFillDelete } from 'react-icons/ai';

import { Container, UsersContainer, Header, ClientsTable } from './styles';
import Menu from '../../components/Menu';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useHttpClient } from '../../hooks/http-hook';

const Admin = () => {
	const { sendRequest, isLoading } = useHttpClient();
	const [users, setUsers] = useState([]);

	//falta auth
	useEffect(() => {
		sendRequest('http://localhost:3333/api/users/clients', 'GET', null).then(
			(response) => {
				setUsers(response);
			},
		);
	}, []);

	const switchEditModeHandler = (user) => {
		console.log('ok');
	};

	const deleteUserHandler = async (userId) => {
		console.log(userId);
	};

	return (
		<Container>
			<Menu />
			<UsersContainer>
				<Header>
					<h1>Lista de clientes</h1>
				</Header>
				{isLoading && <LoadingSpinner />}
				<ClientsTable>
					<tr>
						<th>Nome</th>
						<th>Email</th>
						<th>CNPJ</th>
						<th>Status</th>
						<th>Contrato</th>
						<th>Vencimento</th>
						<th>Editar</th>
						<th>Deletar</th>
					</tr>
					{users &&
						users.map((user) => {
							const dueDate = new Date(user.due_date);
							const date = dueDate.getDate();
							const month = dueDate.getMonth();
							const year = dueDate.getFullYear();
							const dateString = date + '/' + (month + 1) + '/' + year;

							return (
								<tr key={user._id}>
									<td>{user.name}</td>
									<td>{user.email}</td>
									<td>{user.cnpj}</td>
									<td>{user.status}</td>
									<td>{user.contract}</td>
									<td>{dateString}</td>
									<td>
										<AiFillEdit
											onClick={() => switchEditModeHandler(user)}
											style={{ fill: 'blue' }}
											size={20}
										/>
									</td>
									<td>
										<AiFillDelete
											onClick={(event) => deleteUserHandler(user._id, event)}
											style={{ fill: 'red' }}
											size={20}
										/>
									</td>
								</tr>
							);
						})}
				</ClientsTable>
			</UsersContainer>
		</Container>
	);
};

export default Admin;
