import React, { useEffect, useState, useContext } from 'react';
import { AiFillEdit, AiFillDelete, AiOutlineRollback } from 'react-icons/ai';
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
import { AuthContext } from '../../util/AuthContext';

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

const Admin = () => {
	const { sendRequest, isLoading } = useHttpClient();

	const [users, setUsers] = useState([]);
	const [initialFormValues, setInitialFormValues] = useState();
	const [isEditMode, setIsEditMode] = useState(false);
	const [isNewClientMode, setIsNewClientMode] = useState(false);

	const [modalIsOpen, setIsOpen] = useState(false);
	const [modalText, setModalText] = useState('');

	const auth = useContext(AuthContext);

	function switchModalState() {
		setIsOpen((prevMode) => !prevMode);
	}

	//falta auth
	useEffect(() => {
		//https://secureone-backend.herokuapp.com
		//http://localhost:3333
		sendRequest(
			'https://secureone-backend.herokuapp.com/api/users/clients',
			'GET',
			null,
			{
				Authorization: 'Bearer ' + auth.token,
			},
		).then((response) => {
			setUsers(response);
		});
	}, [sendRequest, auth]);

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

	const switchNewClientMode = () => {
		setIsNewClientMode((prevMode) => !prevMode);
	};

	const resetPassHandler = async (user, event) => {
		event.preventDefault();

		try {
			const response = await sendRequest(
				`https://secureone-backend.herokuapp.com/api/users/clients/resetpass/${user._id}`,
				null,
				'PATCH',
				{
					Authorization: 'Bearer ' + auth.token,
				},
			);

			if (response.message === 'Password reset success') {
				setModalText('Senha resetada com sucesso!');
				switchModalState();
			}
		} catch (err) {
			console.error(err);
		}
	};

	const deleteClientHandler = async (clientId, event) => {
		event.preventDefault();
		//https://secureone-backend.herokuapp.com
		//http://localhost:3333
		try {
			const response = await sendRequest(
				`https://secureone-backend.herokuapp.com/api/users/clients/${clientId}`,
				'DELETE',
				null,
				{
					Authorization: 'Bearer ' + auth.token,
				},
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

	if (isNewClientMode) {
		return (
			<Container>
				<Menu />
				{isLoading && <LoadingSpinner asOverlay />}
				<Card>
					<Formik
						initialValues={{
							clientName: '',
							clientEmail: '',
							clientAddress: '',
							clientCNPJ: '',
							clientContract: '',
							clientActive: '',
							clientDueDate: '',
						}}
						validationSchema={Yup.object({
							clientName: Yup.string().required('Campo obrigatório'),
							clientEmail: Yup.string()
								.email('Formato de email inválido')
								.required('Campo obrigatório'),
							clientAddress: Yup.string().required('Campo obrigatório'),
							clientCNPJ: Yup.string().required('Campo obrigatório'),
							clientContract: Yup.string().required('Campo obrigatório'),
							clientActive: Yup.string().required('Campo obrigatório'),
							clientDueDate: Yup.string().required('Campo obrigatório'),
						})}
						onSubmit={async (values, { setSubmitting }) => {
							console.log(values);
							//https://secureone-backend.herokuapp.com
							//http://localhost:3333
							try {
								const response = await sendRequest(
									'https://secureone-backend.herokuapp.com/api/users/create',
									'POST',
									JSON.stringify({
										name: values.clientName,
										email: values.clientEmail,
										address: values.clientAddress,
										cnpj: values.clientCNPJ,
										contract: values.clientContract,
										status: values.clientActive,
										due_date: values.clientDueDate,
									}),
									{
										'Content-Type': 'application/json',
										Authorization: 'Bearer ' + auth.token,
									},
								);
								setSubmitting(false);
								// history.push('/admin');
								const newUser = {
									_id: response._id,
									name: response.name,
									email: response.email,
									address: response.address,
									cnpj: response.cnpj,
									contract: response.contract,
									due_date: response.due_date,
									status: response.status,
								};

								const auxUsers = [...users];
								auxUsers.push(newUser);
								setUsers(auxUsers);
								setModalText('Cliente adicionado com sucesso!');
								switchModalState();
								switchNewClientMode();
							} catch (err) {
								console.error(err);
							}
						}}
					>
						<Form>
							<div>
								<h1>Novo Cliente</h1>

								<Label htmlFor="clientName">Nome</Label>
								<Field name="clientName" type="text" />
								<Error>
									<ErrorMessage name="clientName" />
								</Error>

								<Label htmlFor="clientEmail">Email</Label>
								<Field name="clientEmail" type="email" />
								<Error>
									<ErrorMessage name="clientEmail" />
								</Error>

								<Label htmlFor="clientAddress">Endereço</Label>
								<Field name="clientAddress" type="text" />
								<Error>
									<ErrorMessage name="clientAddress" />
								</Error>

								<Label htmlFor="clientCNPJ">CNPJ</Label>
								<Field name="clientCNPJ" type="text" />
								<Error>
									<ErrorMessage name="clientCNPJ" />
								</Error>

								<Label htmlFor="clientContract">Contrato</Label>
								<Field name="clientContract" type="text" />
								<Error>
									<ErrorMessage name="clientContract" />
								</Error>

								<Label htmlFor="clientActive">Status</Label>
								<Field name="clientActive" as="select">
									<option defaultChecked>Selecione</option>
									<option value="Ativo">Ativo</option>
									<option value="Inativo">Inativo</option>
								</Field>
								<Error>
									<ErrorMessage name="clientActive" />
								</Error>

								<Label htmlFor="clientDueDate">Vencimento do contrato</Label>
								<Field name="clientDueDate" type="date" />
								<Error>
									<ErrorMessage name="clientDueDate" />
								</Error>
							</div>
							<Button type="submit">Cadastrar</Button>
							<Button onClick={switchNewClientMode}> Voltar </Button>
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
								//https://secureone-backend.herokuapp.com
								//http://localhost:3333
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
										Authorization: 'Bearer ' + auth.token,
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
								setModalText('Cliente editado com sucesso!');
								switchModalState();
								switchEditModeHandler();
							} catch (err) {
								console.log(err);
							}
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
					<Button onClick={switchNewClientMode}>Adicionar Novo Cliente</Button>
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
							<th>CNPJ</th>
							<th>Status</th>
							<th>Contrato</th>
							<th>Vencimento</th>
							<th>Editar</th>
							<th>Deletar</th>
							<th>Reset</th>
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
									<td>
										<AiOutlineRollback
											onClick={() => resetPassHandler(user)}
											style={{ fill: 'gray' }}
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
