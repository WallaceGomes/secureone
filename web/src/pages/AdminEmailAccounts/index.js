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

const AdminEmailAccounts = () => {
	const { sendRequest, isLoading } = useHttpClient();

	const [accounts, setAccounts] = useState([]);
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
		sendRequest(
			'http://localhost:3333/api/client/active/emails',
			'GET',
			null,
		).then((response) => {
			setAccounts(response);
		});
	}, [sendRequest]);

	const switchEditModeHandler = (account) => {
		if (account) {
			const initialvalues = {
				name: account.name,
				email: account.email,
				license: account.license,
				accountId: account._id,
			};
			setInitialFormValues(initialvalues);
		}
		setIsEditMode((prevMode) => !prevMode);
	};

	const deleteClientHandler = async (accountId, event) => {
		event.preventDefault();
		//https://secureone-backend.herokuapp.com
		//http://localhost:3333
		try {
			const response = await sendRequest(
				`http://localhost:3333/api/client/active/email/${accountId}`,
				'DELETE',
				null,
			);
			const index = accounts.findIndex((account) => account._id === accountId);
			if (index !== -1) {
				const newAccounts = [...accounts];
				newAccounts.splice(index, 1);
				setAccounts(newAccounts);
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
							license: initialFormValues.license,
							accountId: initialFormValues.accountId,
						}}
						validationSchema={Yup.object({
							name: Yup.string().required('Campo obrigatório'),
							email: Yup.string()
								.email('Formato de email inválido')
								.required('Campo obrigatório'),
							license: Yup.string().required('Campo obrigatório'),
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
									`http://localhost:3333/api/client/active/email/${values.accountId}`,
									'PATCH',
									JSON.stringify({
										name: values.name,
										email: values.email,
										license: values.license,
									}),
									{
										'Content-Type': 'application/json',
									},
								);
								const editedAccount = {
									_id: values.accountId,
									name: values.name,
									email: values.email,
									license: values.license,
								};
								const index = accounts.findIndex(
									(account) => account._id === values.accountId,
								);
								if (index !== -1) {
									const auxAccounts = [...accounts];
									auxAccounts[index] = editedAccount;
									setAccounts(auxAccounts);
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
								<h1>Editar conta de email</h1>

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

								<Label htmlFor="license">Licença</Label>
								<Field name="license" as="select">
									<option value="Office 365">Office 365</option>
									<option value="Google GSuite">Google GSuite</option>
									<option value="Outros">Outros</option>
								</Field>
								<Error>
									<ErrorMessage name="license" />
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
					<h1>Lista de emails cadastrados por cliente</h1>
				</Header>
				{isLoading && <LoadingSpinner />}
				<ClientsTable>
					<tbody>
						<tr>
							<th>Nome</th>
							<th>Email</th>
							<th>Licença</th>
							<th>Editar</th>
							<th>Deletar</th>
						</tr>
					</tbody>
					{accounts &&
						accounts.map((account) => {
							//erro causado por falta de um tbody em volta da tabela
							return (
								<tr key={account._id}>
									<td>{account.name}</td>
									<td>{account.email}</td>
									<td>{account.license}</td>
									<td>
										<AiFillEdit
											onClick={() => switchEditModeHandler(account)}
											style={{ fill: 'blue' }}
											size={20}
										/>
									</td>
									<td>
										<AiFillDelete
											onClick={(event) =>
												deleteClientHandler(account._id, event)
											}
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

export default AdminEmailAccounts;
