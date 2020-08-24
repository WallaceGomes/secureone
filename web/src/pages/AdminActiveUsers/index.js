import React, { useEffect, useState } from 'react';
import { AiFillEdit, AiFillDelete } from 'react-icons/ai';

import {
	Container,
	UsersContainer,
	Header,
	ClientsTable,
	Card,
	Error,
	Label,
} from './styles';
import Menu from '../../components/Menu';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useHttpClient } from '../../hooks/http-hook';

import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Button from '../../components/Button';

const AdminActiveUsers = () => {
	const { sendRequest, isLoading } = useHttpClient();

	const [users, setUsers] = useState([]);
	// const [clients, setClients] = useState([]);
	const [initialFormValues, setInitialFormValues] = useState();
	const [isEditMode, setIsEditMode] = useState(false);

	//falta auth
	useEffect(() => {
		// sendRequest('https://secureone-backend.herokuapp.com/api/users/clients', 'GET', null).then(
		// 	(response) => {
		// 		setClients(response);
		// 	},
		// );

		//https://secureone-backend.herokuapp.com
		//http://localhost:3333

		sendRequest('http://localhost:3333/api/active', 'GET', null).then(
			(response) => {
				setUsers(response);
			},
		);
	}, [sendRequest]);

	const switchEditModeHandler = (user) => {
		if (user) {
			const initialvalues = {
				name: user.name,
				email: user.email,
				teamviewer: user.teamviewer,
				tvpassword: user.tvpassword,
				phone: user.phone,
				login: user.login,
				userId: user._id,
			};
			setInitialFormValues(initialvalues);
		}
		setIsEditMode((prevMode) => !prevMode);
	};

	const deleteClientHandler = async (userId, event) => {
		event.preventDefault();
		//https://secureone-backend.herokuapp.com
		//http://localhost:3333
		try {
			const response = await sendRequest(
				`http://localhost:3333/api/active/${userId}`,
				'DELETE',
				null,
			);
			const index = users.findIndex((user) => user._id === userId);
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
					<Formik
						initialValues={{
							name: initialFormValues.name,
							email: initialFormValues.email,
							teamviewer: initialFormValues.teamviewer,
							tvpassword: initialFormValues.tvpassword,
							phone: initialFormValues.phone,
							login: initialFormValues.login,
							userId: initialFormValues.userId,
						}}
						validationSchema={Yup.object({
							name: Yup.string().required('Campo obrigatório'),
							email: Yup.string()
								.email('Formato de email inválido')
								.required('Campo obrigatório'),
							teamviewer: Yup.string().required('Campo obrigatório'),
							tvpassword: Yup.string().required('Campo obrigatório'),
							phone: Yup.string()
								.min(10, 'Número incompleto')
								.max(11, 'Máximo de 11 números')
								.required('Campo obrigatório'),
							login: Yup.string().required('Campo obrigatório'),
						})}
						onSubmit={async (values, { setSubmitting }) => {
							try {
								//vai precisar disso aqui depois
								/**
								 * {
										'Content-Type': 'application/json',
										Authorization: `Bearer ${storedData.token}`,
									},
								 */
								//https://secureone-backend.herokuapp.com
								//http://localhost:3333
								await sendRequest(
									`http://localhost:3333/api/active/${values.userId}`,
									'PATCH',
									JSON.stringify({
										name: values.name,
										email: values.email,
										password: values.password,
										teamviewer: values.teamviewer,
										tvpassword: values.tvpassword,
										phone: values.phone,
										login: values.login,
									}),
									{
										'Content-Type': 'application/json',
									},
								);
								const editedUser = {
									_id: values.userId,
									name: values.name,
									email: values.email,
									password: values.password,
									teamviewer: values.teamviewer,
									tvpassword: values.tvpassword,
									phone: values.phone,
									login: values.login,
								};
								const index = users.findIndex(
									(user) => user._id === values.userId,
								);
								if (index !== -1) {
									const auxUser = [...users];
									auxUser[index] = editedUser;
									setUsers(auxUser);
								}
								setSubmitting(false);
							} catch (err) {
								console.log(err);
							}
							switchEditModeHandler();
						}}
					>
						<Form>
							<div>
								<h1>Editar usuário ativo</h1>

								<Label htmlFor="name">Nome do usuário</Label>
								<Field name="name" type="text" />
								<Error>
									<ErrorMessage name="name" />
								</Error>

								<Label htmlFor="email">Email</Label>
								<Field name="email" type="email" />
								<Error>
									<ErrorMessage name="email" />
								</Error>

								<Label htmlFor="teamviewer">Team Viewer</Label>
								<Field name="teamviewer" type="text" />
								<Error>
									<ErrorMessage name="teamviewer" />
								</Error>

								<Label htmlFor="tvpassword">Senha Team Viewer</Label>
								<Field name="tvpassword" type="text" />
								<Error>
									<ErrorMessage name="tvpassword" />
								</Error>

								<Label htmlFor="phone">Telefone</Label>
								<Field name="phone" type="number" />
								<Error>
									<ErrorMessage name="phone" />
								</Error>

								<Label htmlFor="login">Login</Label>
								<Field name="login" type="text" />
								<Error>
									<ErrorMessage name="login" />
								</Error>
							</div>
							<Button type="submit">Editar</Button>
							<Button onClick={switchEditModeHandler}> Voltar </Button>
						</Form>
					</Formik>
				</Card>
			</Container>
		);
	}

	return (
		<Container>
			<Menu />
			<UsersContainer>
				<Header>
					<h1>Usuários ativos por cliente</h1>
				</Header>
				{isLoading && <LoadingSpinner />}
				<ClientsTable>
					<tbody>
						<tr>
							<th>Nome</th>
							<th>E-mail</th>
							<th>Team Viewer</th>
							<th>Senha Team Viewer</th>
							<th>Telefone</th>
							<th>Login</th>
							<th>Editar</th>
							<th>Deletar</th>
						</tr>
					</tbody>
					{users &&
						users.map((user) => {
							//erro causado por falta de um tbody em volta da tabela
							return (
								<tr key={user._id}>
									<td>{user.name}</td>
									<td>{user.email}</td>
									<td>{user.teamviewer}</td>
									<td>{user.tvpassword}</td>
									<td>{user.phone}</td>
									<td>{user.login}</td>
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

export default AdminActiveUsers;
