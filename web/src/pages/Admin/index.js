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

const Admin = () => {
	const { sendRequest, isLoading } = useHttpClient();

	const [users, setUsers] = useState([]);
	const [initialFormValues, setInitialFormValues] = useState();
	const [isEditMode, setIsEditMode] = useState(false);

	//falta auth
	useEffect(() => {
		sendRequest(
			'https://secureone-backend.herokuapp.com/api/users/clients',
			'GET',
			null,
		).then((response) => {
			setUsers(response);
		});
	}, [sendRequest]);

	const switchEditModeHandler = (user) => {
		if (user) {
			const initialvalues = {
				name: user.name,
				email: user.email,
				address: user.address,
				cnpj: user.cnpj,
				contract: user.contract,
				status: user.status,
				due_date: user.due_date,
				clientId: user._id,
			};
			setInitialFormValues(initialvalues);
		}
		setIsEditMode((prevMode) => !prevMode);
	};

	const deleteClientHandler = async (clientId, event) => {
		event.preventDefault();
		try {
			const response = await sendRequest(
				`https://secureone-backend.herokuapp.com/api/users/clients/${clientId}`,
				'DELETE',
				null,
			);
			const index = users.findIndex((user) => user._id === clientId);
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
							address: initialFormValues.address,
							cnpj: initialFormValues.cnpj,
							contract: initialFormValues.cnpj,
							due_date: initialFormValues.due_date,
							status: initialFormValues.status,
							clientId: initialFormValues.clientId,
						}}
						validationSchema={Yup.object({
							name: Yup.string().required('Campo obrigatório'),
							email: Yup.string()
								.email('Formato de email inválido')
								.required('Campo obrigatório'),
							address: Yup.string().required('Campo obrigatório'),
							cnpj: Yup.string().required('Campo obrigatório'),
							contract: Yup.string().required('Campo obrigatório'),
							due_date: Yup.string().required('Campo obrigatório'),
							status: Yup.string().required('Campo obrigatório'),
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
								await sendRequest(
									`https://secureone-backend.herokuapp.com/api/users/clients/${values.clientId}`,
									'PATCH',
									JSON.stringify({
										name: values.name,
										email: values.email,
										address: values.address,
										cnpj: values.cnpj,
										contract: values.contract,
										due_date: values.due_date,
										status: values.status,
									}),
									{
										'Content-Type': 'application/json',
									},
								);
								const editedUser = {
									_id: values.clientId,
									name: values.name,
									email: values.email,
									address: values.address,
									cnpj: values.cnpj,
									contract: values.contract,
									due_date: values.due_date,
									status: values.status,
								};
								const index = users.findIndex(
									(user) => user._id === values.clientId,
								);
								if (index !== -1) {
									const auxUsers = [...users];
									auxUsers[index] = editedUser;
									setUsers(auxUsers);
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
								<h1>Editar cliente</h1>

								<Label htmlFor="name">Nome </Label>
								<Field name="name" type="text" />
								<Error>
									<ErrorMessage name="name" />
								</Error>

								<Label htmlFor="email">Email</Label>
								<Field name="email" type="email" />
								<Error>
									<ErrorMessage name="email" />
								</Error>

								<Label htmlFor="address">Endereço</Label>
								<Field name="address" type="text" />
								<Error>
									<ErrorMessage name="address" />
								</Error>

								<Label htmlFor="cnpj">CNPJ</Label>
								<Field name="cnpj" type="text" />
								<Error>
									<ErrorMessage name="cnpj" />
								</Error>

								<Label htmlFor="status">Status</Label>
								<Field name="status" as="select">
									<option value="Ativo">Ativo</option>
									<option value="Inativo">Inativo</option>
								</Field>
								<Error>
									<ErrorMessage name="status" />
								</Error>

								<Label htmlFor="contract">Contrato</Label>
								<Field name="contract" type="text" />
								<Error>
									<ErrorMessage name="contract" />
								</Error>

								<Label htmlFor="due_date">Vencimento do contrato</Label>
								<Field name="due_date" type="date" />
								<Error>
									<ErrorMessage name="due_date" />
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
