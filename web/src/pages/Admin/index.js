import React, { useEffect, useState } from 'react';
import { AiFillEdit, AiFillDelete } from 'react-icons/ai';

import {
	Container,
	UsersContainer,
	Header,
	ClientsTable,
	Card,
} from './styles';
import Menu from '../../components/Menu';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useHttpClient } from '../../hooks/http-hook';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Select from '../../components/Select';

const Admin = () => {
	const { sendRequest, isLoading } = useHttpClient();
	const [users, setUsers] = useState([]);

	const [editClientName, setEditClientName] = useState('');
	const [editClientEmail, setEditClientEmail] = useState('');
	const [editClientAddress, setEditClientAddress] = useState('');
	const [editClientCNPJ, setEditClientCNPJ] = useState('');
	const [editClientContract, setEditClientContract] = useState('');
	const [editClientActive, setEditClientActive] = useState('');
	const [editClientDueDate, setEditClientDueDate] = useState('');
	const [editClietID, setEditClientID] = useState(Number);

	const [isEditMode, setIsEditMode] = useState(false);

	//falta auth
	useEffect(() => {
		sendRequest('http://localhost:3333/api/users/clients', 'GET', null).then(
			(response) => {
				setUsers(response);
			},
		);
	}, []);

	/**

	const now = new Date(user.due_date);

			const day = ('0' + now.getDate()).slice(-2);
			const month = ('0' + (now.getMonth() + 1)).slice(-2);

			const today = now.getFullYear() + '-' + month + '-' + day;

			console.log(day);
	 */

	const switchEditModeHandler = (user) => {
		if (user) {
			setEditClientAddress(user.address);
			setEditClientCNPJ(user.cnpj);
			setEditClientEmail(user.email);
			setEditClientName(user.name);
			setEditClientID(user._id);
			setEditClientActive(user.status);
			setEditClientContract(user.contract);
			setEditClientDueDate(user.due_date);
		}
		setIsEditMode((prevMode) => !prevMode);
	};

	const editUserSubmitHandler = async (event) => {
		event.preventDefault();
		try {
			//vai precisar disso aqui depois
			/**
			 * {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${storedData.token}`,
				},
			 */
			const response = await sendRequest(
				`http://localhost:3333/api/users/clients/${editClietID}`,
				'PATCH',
				JSON.stringify({
					name: editClientName,
					email: editClientEmail,
					address: editClientAddress,
					cnpj: editClientCNPJ,
					contract: editClientContract,
					status: editClientActive,
					due_date: editClientDueDate,
				}),
				{
					'Content-Type': 'application/json',
				},
			);
			const editedUser = {
				_id: editClietID,
				name: editClientName,
				email: editClientEmail,
				address: editClientAddress,
				cnpj: editClientCNPJ,
				contract: editClientContract,
				due_date: editClientDueDate,
				status: editClientActive,
			};
			const index = users.findIndex((user) => user._id === editClietID);
			if (index !== -1) {
				const auxUsers = [...users];
				auxUsers[index] = editedUser;
				setUsers(auxUsers);
			}
		} catch (err) {
			console.log(err);
		}
		switchEditModeHandler();
	};

	const deleteClientHandler = async (editClietID, event) => {
		event.preventDefault();
		try {
			const response = await sendRequest(
				`http://localhost:3333/api/users/clients/${editClietID}`,
				'DELETE',
				null,
			);
			const index = users.findIndex((user) => user._id === editClietID);
			if (index !== -1) {
				const newUsers = [...users];
				newUsers.splice(index, 1);
				setUsers(newUsers);
			}
			console.log(response);
		} catch (err) {
			console.log(err);
			alert(err.message);
		}
	};

	if (isEditMode) {
		return (
			<Container>
				<Menu />
				<Card>
					<form onSubmit={editUserSubmitHandler}>
						<h1>Editar Cliente</h1>
						<Input
							name="editClientName"
							type="text"
							value={editClientName}
							placeholder="Nome"
							setValue={setEditClientName}
						/>
						<Input
							name="editClientEmail"
							type="email"
							value={editClientEmail}
							placeholder="E-mail"
							setValue={setEditClientEmail}
						/>
						<Input
							name="editClientAddress"
							type="text"
							value={editClientAddress}
							placeholder="Endereço"
							setValue={setEditClientAddress}
						/>
						<Input
							name="editClientCNPJ"
							type="text"
							value={editClientCNPJ}
							placeholder="CNPJ"
							setValue={setEditClientCNPJ}
						/>
						<Select
							name="editClientActive"
							type="select"
							value={editClientActive}
							setValue={setEditClientActive}
						/>
						<Input
							name="editClientContract"
							type="text"
							value={editClientContract}
							placeholder="Contrato"
							setValue={setEditClientContract}
						/>
						<Input
							name="editClientDueDate"
							type="date"
							value={editClientDueDate}
							placeholder="Data de Vencimento do Contrato"
							setValue={setEditClientDueDate}
						/>
						<Button type="submit"> Editar </Button>
					</form>
				</Card>
			</Container>
		);
	}

	return (
		<Container>
			<Menu />
			<UsersContainer>
				<Header>
					<h1>Lista de clientes</h1>
				</Header>
				{isLoading && <LoadingSpinner />}
				<ClientsTable>
					<tbody>
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
					</tbody>
					{users &&
						users.map((user) => {
							const dueDate = new Date(user.due_date);
							const date = dueDate.getDate();
							const month = dueDate.getMonth();
							const year = dueDate.getFullYear();
							const dateString = date + 1 + '/' + (month + 1) + '/' + year;

							//erro causado por falta de um tbody em volta da tabela
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
											onClick={(event) => deleteClientHandler(user._id, event)}
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
