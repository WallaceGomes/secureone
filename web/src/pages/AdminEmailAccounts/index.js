import React, { useEffect, useState } from 'react';
import { AiFillEdit, AiFillDelete } from 'react-icons/ai';
import Modal from 'react-modal';

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

//Modal styles
const customStyles = {
	overlay: {
		position: 'fixed',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: 'rgba(0, 0, 0, 0.75)',
	},
	content: {
		top: '50%',
		left: '50%',
		right: 'auto',
		bottom: 'auto',
		transform: 'translate(-50%, -50%)',
		backgroundColor: '#fff',
		color: '#000',
		fontWeight: 'bold',
	},
};

Modal.setAppElement('#root');

const AdminEmailAccounts = () => {
	const { sendRequest, isLoading } = useHttpClient();
	const [clients, setClients] = useState([]);

	const [accounts, setAccounts] = useState([]);
	const [initialFormValues, setInitialFormValues] = useState();
	const [isEditMode, setIsEditMode] = useState(false);
	const [isNewEmailMode, setIsNewEmailMode] = useState(false);

	const [modalIsOpen, setIsOpen] = useState(false);
	const [modalText, setModalText] = useState('');

	function switchModalState() {
		setIsOpen((prevMode) => !prevMode);
	}

	//falta auth
	useEffect(() => {
		//https://secureone-backend.herokuapp.com
		//http://localhost:3333
		sendRequest(
			'http://localhost:3333/api/client/active/emails',
			'GET',
			null,
		).then((response) => {
			setAccounts(response);
		});

		sendRequest('http://localhost:3333/api/users/clients', 'GET', null).then(
			(response) => {
				setClients(response);
			},
		);
	}, [sendRequest]);

	const switchNewEmailMode = () => {
		setIsNewEmailMode((prevMode) => !prevMode);
	};

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

	if (isNewEmailMode) {
		return (
			<Container>
				<Menu />
				{isLoading && <LoadingSpinner asOverlay />}
				<Card>
					<Formik
						initialValues={{
							name: '',
							email: '',
							license: '',
							clientId: '',
						}}
						validationSchema={Yup.object({
							clientId: Yup.string().required('Selecione o cliente'),
							name: Yup.string().required('Campo obrigatório'),
							email: Yup.string()
								.email('Formato de email inválido')
								.required('Campo obrigatório'),
							license: Yup.string().required('Campo obrigatório'),
						})}
						onSubmit={async (values, { setSubmitting }) => {
							console.log(values);
							//https://secureone-backend.herokuapp.com
							//http://localhost:3333
							try {
								const response = await sendRequest(
									'http://localhost:3333/api/client/users/emails/create',
									'POST',
									JSON.stringify({
										name: values.name,
										email: values.email,
										license: values.license,
										clientId: values.clientId,
									}),
									{
										'Content-Type': 'application/json',
									},
								);
								const newAccount = {
									_id: response._id,
									name: response.name,
									email: response.email,
									license: response.license,
								};

								const auxAccounts = [...accounts];
								auxAccounts.push(newAccount);
								setAccounts(auxAccounts);

								setSubmitting(false);
								setModalText('Nova conta de email criada!');
								switchModalState();
								switchNewEmailMode();
							} catch (err) {
								console.error(err);
							}
						}}
					>
						<Form>
							<div>
								<h1>Nova conta de email</h1>

								<Label htmlFor="clientId">Nome do cliente</Label>
								<Field
									name="clientId"
									as="select"
									placeholder="Selecione o cliente"
								>
									<option defaultChecked>Selecione o cliente</option>
									{clients.map((client) => {
										return (
											<option key={client._id} value={client._id}>
												{client.name}
											</option>
										);
									})}
								</Field>
								<Error>
									<ErrorMessage name="clientId" />
								</Error>

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

								<Label htmlFor="license">Licença</Label>
								<Field name="license" as="select">
									<option defaultChecked>Selecione o tipo</option>
									<option value="Office 365">Office 365</option>
									<option value="Google GSuite">Google GSuite</option>
									<option value="Outros">Outros</option>
								</Field>
								<Error>
									<ErrorMessage name="license" />
								</Error>
							</div>
							<Button type="submit">Cadastrar</Button>
							<Button onClick={switchNewEmailMode}> Voltar </Button>
						</Form>
					</Formik>
				</Card>
			</Container>
		);
	}

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
					<Button onClick={switchNewEmailMode}>Adicionar Novo Email</Button>
				</Header>
				{isLoading && <LoadingSpinner />}
				<Modal
					isOpen={modalIsOpen}
					onRequestClose={switchModalState}
					style={customStyles}
					contentLabel="Alert Modal"
				>
					<div>{modalText}</div>
					<br />
					<br />
					<Button onClick={switchModalState}>OK</Button>
				</Modal>
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
