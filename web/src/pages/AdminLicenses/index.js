import React, { useEffect, useState, useContext } from 'react';
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

const AdminLicenses = () => {
	const { sendRequest, isLoading } = useHttpClient();
	const [clients, setClients] = useState([]);

	const [licenses, setLicenses] = useState([]);
	const [initialFormValues, setInitialFormValues] = useState();
	const [isEditMode, setIsEditMode] = useState(false);
	const [isNewLicenseMode, setIsNewLicenseMode] = useState(false);

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
		sendRequest('http://localhost:3333/api/client/licenses', 'GET', null, {
			Authorization: 'Bearer ' + auth.token,
		}).then((response) => {
			setLicenses(response);
		});

		sendRequest('http://localhost:3333/api/users/clients', 'GET', null, {
			Authorization: 'Bearer ' + auth.token,
		}).then((response) => {
			setClients(response);
		});
	}, [sendRequest, auth]);

	const switchNewLicenseMode = () => {
		setIsNewLicenseMode((prevMode) => !prevMode);
	};

	const switchEditModeHandler = (license) => {
		if (license) {
			const initialvalues = {
				brand: license.brand,
				available_licenses: license.available_licenses,
				used_licenses: license.used_licenses,
				used_equipments: license.used_equipments,
				due_date: license.due_date,
				provider: license.provider,
				licenseId: license._id,
				management: license.management,
			};
			setInitialFormValues(initialvalues);
		}
		setIsEditMode((prevMode) => !prevMode);
	};

	const deleteClientHandler = async (licenseId, event) => {
		event.preventDefault();
		//https://secureone-backend.herokuapp.com
		//http://localhost:3333
		try {
			const response = await sendRequest(
				`http://localhost:3333/api/client/license/${licenseId}`,
				null,
				'DELETE',
				{
					Authorization: 'Bearer ' + auth.token,
				},
			);
			const index = licenses.findIndex((license) => license._id === licenseId);
			if (index !== -1) {
				const auxLicenses = [...licenses];
				auxLicenses.splice(index, 1);
				setLicenses(auxLicenses);
			}
			console.log(response);
		} catch (err) {
			console.log(err);
			alert(err.message);
		}
	};

	if (isNewLicenseMode) {
		return (
			<Container>
				<Menu />
				{isLoading && <LoadingSpinner asOverlay />}
				<Card>
					<Formik
						initialValues={{
							brand: '',
							available_licenses: '',
							used_licenses: '',
							used_equipments: '',
							due_date: '',
							provider: '',
							clientId: '',
							management: '',
						}}
						validationSchema={Yup.object({
							clientId: Yup.string().required('Selecione o cliente'),
							brand: Yup.string().required('Campo obrigatório'),
							available_licenses: Yup.number().required('Campo obrigatório'),
							used_equipments: Yup.number().required('Campo obrigatório'),
							due_date: Yup.string().required('Campo obrigatório'),
							provider: Yup.string().required('Campo obrigatório'),
							used_licenses: Yup.number().required('Campo obrigatório'),
							management: Yup.string().required('Campo obrigatório'),
						})}
						onSubmit={async (values, { setSubmitting }) => {
							console.log(values);
							//https://secureone-backend.herokuapp.com
							//http://localhost:3333
							try {
								const response = await sendRequest(
									'http://localhost:3333/api/client/licenses',
									'POST',
									JSON.stringify({
										brand: values.brand,
										available_licenses: values.available_licenses,
										used_licenses: values.used_licenses,
										used_equipments: values.used_equipments,
										due_date: values.due_date,
										provider: values.provider,
										management: values.management,
										clientId: values.clientId,
									}),
									{
										'Content-Type': 'application/json',
										Authorization: 'Bearer ' + auth.token,
									},
								);
								const newLicense = {
									_id: response._id,
									brand: response.brand,
									available_licenses: response.available_licenses,
									used_licenses: response.used_licenses,
									used_equipments: response.used_equipments,
									due_date: response.due_date,
									provider: response.provider,
									management: response.management,
								};

								const auxLicenses = [...licenses];
								auxLicenses.push(newLicense);
								setLicenses(auxLicenses);

								setSubmitting(false);
								setModalText('Nova registro de licença criado!');
								switchModalState();
								switchNewLicenseMode();
							} catch (err) {
								console.error(err);
							}
						}}
					>
						<Form>
							<div>
								<h1>Novo registro de licenças</h1>

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

								<Label htmlFor="brand">Fornecedor</Label>
								<Field name="brand" type="text" />
								<Error>
									<ErrorMessage name="brand" />
								</Error>

								<Label htmlFor="available_licenses">
									Número de licenças disponíveis
								</Label>
								<Field name="available_licenses" type="number" />
								<Error>
									<ErrorMessage name="available_licenses" />
								</Error>

								<Label htmlFor="used_licenses">Licenças utilizadas</Label>
								<Field name="used_licenses" type="number" />
								<Error>
									<ErrorMessage name="used_licenses" />
								</Error>

								<Label htmlFor="used_equipments">Equipamentos instalados</Label>
								<Field name="used_equipments" type="number" />
								<Error>
									<ErrorMessage name="used_equipments" />
								</Error>

								<Label htmlFor="due_date">Vencimento</Label>
								<Field name="due_date" type="date" />
								<Error>
									<ErrorMessage name="due_date" />
								</Error>

								<Label htmlFor="provider">Fornecedor</Label>
								<Field name="provider" type="text" />
								<Error>
									<ErrorMessage name="provider" />
								</Error>

								<Label htmlFor="management">Gerenciamento</Label>
								<Field name="management" type="text" />
								<Error>
									<ErrorMessage name="management" />
								</Error>
							</div>
							<Button type="submit">Cadastrar</Button>
							<Button onClick={switchNewLicenseMode}> Voltar </Button>
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
							brand: initialFormValues.brand,
							available_licenses: initialFormValues.available_licenses,
							used_licenses: initialFormValues.used_licenses,
							used_equipments: initialFormValues.used_equipments,
							due_date: initialFormValues.due_date,
							provider: initialFormValues.provider,
							licenseId: initialFormValues._id,
							management: initialFormValues.management,
						}}
						validationSchema={Yup.object({
							brand: Yup.string().required('Campo obrigatório'),
							available_licenses: Yup.number().required('Campo obrigatório'),
							used_equipments: Yup.number().required('Campo obrigatório'),
							due_date: Yup.string().required('Campo obrigatório'),
							provider: Yup.string().required('Campo obrigatório'),
							used_licenses: Yup.number().required('Campo obrigatório'),
							management: Yup.string().required('Campo obrigatório'),
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
									`http://localhost:3333/api/client/license/${values.licenseId}`,
									'PATCH',
									JSON.stringify({
										brand: values.brand,
										available_licenses: values.available_licenses,
										used_licenses: values.used_licenses,
										used_equipments: values.used_equipments,
										due_date: values.due_date,
										provider: values.provider,
										management: values.management,
									}),
									{
										'Content-Type': 'application/json',
										Authorization: 'Bearer ' + auth.token,
									},
								);
								const editedLicense = {
									_id: values.licenseId,
									brand: values.brand,
									available_licenses: values.available_licenses,
									used_licenses: values.used_licenses,
									used_equipments: values.used_equipments,
									due_date: values.due_date,
									provider: values.provider,
									management: values.management,
								};
								const index = licenses.findIndex(
									(license) => license._id === values.licenseId,
								);
								if (index !== -1) {
									const auxLicenses = [...licenses];
									auxLicenses[index] = editedLicense;
									setLicenses(auxLicenses);
								}
								setSubmitting(false);
								setModalText('Registro de Licença editado!');
								switchModalState();
								switchEditModeHandler();
							} catch (err) {
								console.log(err);
							}
						}}
					>
						<Form>
							<div>
								<h1>Editar registro de licenças</h1>

								<Label htmlFor="brand">Fornecedor</Label>
								<Field name="brand" type="text" />
								<Error>
									<ErrorMessage name="brand" />
								</Error>

								<Label htmlFor="available_licenses">
									Número de licenças disponíveis
								</Label>
								<Field name="available_licenses" type="number" />
								<Error>
									<ErrorMessage name="available_licenses" />
								</Error>

								<Label htmlFor="used_licenses">Licenças utilizadas</Label>
								<Field name="used_licenses" type="number" />
								<Error>
									<ErrorMessage name="used_licenses" />
								</Error>

								<Label htmlFor="used_equipments">Equipamentos instalados</Label>
								<Field name="used_equipments" type="number" />
								<Error>
									<ErrorMessage name="used_equipments" />
								</Error>

								<Label htmlFor="due_date">Vencimento</Label>
								<Field name="due_date" type="date" />
								<Error>
									<ErrorMessage name="due_date" />
								</Error>

								<Label htmlFor="provider">Fornecedor</Label>
								<Field name="provider" type="text" />
								<Error>
									<ErrorMessage name="provider" />
								</Error>

								<Label htmlFor="management">Gerenciamento</Label>
								<Field name="management" type="text" />
								<Error>
									<ErrorMessage name="management" />
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
					<h1>Lista de licenças registradas por cliente</h1>
					<Button onClick={switchNewLicenseMode}>
						Adicionar Novo registro
					</Button>
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
							<th>Fornecedor</th>
							<th>Licenças disponíveis</th>
							<th>Licenças utilizadas</th>
							<th>Equipamentos instalados</th>
							<th>Vencimento</th>
							<th>Fornecedor</th>
							<th>Gerenciamento</th>
							<th>Editar</th>
							<th>Deletar</th>
						</tr>
					</tbody>
					{licenses &&
						licenses.map((license) => {
							//erro causado por falta de um tbody em volta da tabela
							return (
								<tr key={license._id}>
									<td>{license.brand}</td>
									<td>{license.available_licenses}</td>
									<td>{license.used_licenses}</td>
									<td>{license.used_equipments}</td>
									<td>{license.due_date}</td>
									<td>{license.provider}</td>
									<td>{license.management}</td>
									<td>
										<AiFillEdit
											onClick={() => switchEditModeHandler(license)}
											style={{ fill: 'blue' }}
											size={20}
										/>
									</td>
									<td>
										<AiFillDelete
											onClick={(event) =>
												deleteClientHandler(license._id, event)
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

export default AdminLicenses;
