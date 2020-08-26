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
	DuoColumns,
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

const AdminEnterpriseAssets = () => {
	const { sendRequest, isLoading } = useHttpClient();

	const [assets, setAssets] = useState([]);
	const [clients, setClients] = useState([]);
	const [initialFormValues, setInitialFormValues] = useState();
	const [isEditMode, setIsEditMode] = useState(false);
	const [isNewAssetMode, setIsNewAssetMode] = useState(false);

	const [modalIsOpen, setIsOpen] = useState(false);
	const [modalText, setModalText] = useState('');

	function switchModalState() {
		setIsOpen((prevMode) => !prevMode);
	}

	//falta auth
	useEffect(() => {
		//https://secureone-backend.herokuapp.com
		//http://localhost:3333
		sendRequest('http://localhost:3333/api/users/clients', 'GET', null).then(
			(response) => {
				setClients(response);
			},
		);

		//https://secureone-backend.herokuapp.com
		//http://localhost:3333
		sendRequest('http://localhost:3333/api/client/assets', 'GET', null).then(
			(response) => {
				setAssets(response);
			},
		);
	}, [sendRequest]);

	const switchNewAssetMode = () => {
		setIsNewAssetMode((prevMode) => !prevMode);
	};

	const switchEditModeHandler = (asset) => {
		if (asset) {
			const initialvalues = {
				equipment: asset.equipment,
				modelo: asset.modelo,
				hostname: asset.hostname,
				user: asset.user,
				memory: asset.memory,
				cpu: asset.cpu,
				hd: asset.hd,
				so: asset.so,
				licensed: asset.licensed,
				antivirus: asset.antivirus,
				tdr: asset.tdr,
				inuse: asset.inuse,
				assetId: asset._id,
			};
			setInitialFormValues(initialvalues);
		}
		setIsEditMode((prevMode) => !prevMode);
	};

	const deleteClientHandler = async (assetId, event) => {
		event.preventDefault();
		//https://secureone-backend.herokuapp.com
		//http://localhost:3333
		try {
			const response = await sendRequest(
				`http://localhost:3333/api/client/assets/${assetId}`,
				'DELETE',
				null,
			);
			const index = assets.findIndex((asset) => asset._id === assetId);
			if (index !== -1) {
				const assetsAux = [...assets];
				assetsAux.splice(index, 1);
				setAssets(assetsAux);
			}
			console.log(response);
		} catch (err) {
			console.log(err);
			alert(err.message);
		}
	};

	if (isNewAssetMode) {
		return (
			<Container>
				<Menu />
				{isLoading && <LoadingSpinner asOverlay />}
				<Card>
					<Formik
						initialValues={{
							equipment: '',
							modelo: '',
							hostname: '',
							user: '',
							memory: '',
							cpu: '',
							hd: '',
							so: '',
							licensed: '',
							antivirus: '',
							tdr: '',
							inuse: '',
							clientId: '',
						}}
						validationSchema={Yup.object({
							clientId: Yup.string().required('Selecione o cliente'),
							equipment: Yup.string().required('Campo obrigatório'),
							modelo: Yup.string().required('Campo obrigatório'),
							hostname: Yup.string().required('Campo obrigatório'),
							user: Yup.string().required('Campo obrigatório'),
							memory: Yup.string().required('Campo obrigatório'),
							cpu: Yup.string().required('Campo obrigatório'),
							hd: Yup.string().required('Campo obrigatório'),
							so: Yup.string().required('Campo obrigatório'),
							licensed: Yup.string().required('Campo obrigatório'),
							antivirus: Yup.string().required('Campo obrigatório'),
							tdr: Yup.string().required('Campo obrigatório'),
							inuse: Yup.string().required('Campo obrigatório'),
						})}
						onSubmit={async (values, { setSubmitting }) => {
							console.log(values);
							//https://secureone-backend.herokuapp.com
							//http://localhost:3333
							try {
								const response = await sendRequest(
									'http://localhost:3333/api/client/assets',
									'POST',
									JSON.stringify({
										clientId: values.clientId,
										equipment: values.equipment,
										modelo: values.modelo,
										hostname: values.hostname,
										user: values.user,
										memory: values.memory,
										cpu: values.cpu,
										hd: values.hd,
										so: values.so,
										licensed: values.licensed,
										antivirus: values.antivirus,
										tdr: values.tdr,
										inuse: values.inuse,
									}),
									{
										'Content-Type': 'application/json',
									},
								);
								const newAsset = {
									_id: response._id,
									equipment: response.equipment,
									modelo: response.modelo,
									hostname: response.hostname,
									user: response.user,
									memory: response.memory,
									cpu: response.cpu,
									hd: response.hd,
									so: response.so,
									licensed: response.licensed,
									antivirus: response.antivirus,
									tdr: response.tdr,
									inuse: response.inuse,
								};

								const ausAssets = [...assets];
								ausAssets.push(newAsset);
								setAssets(ausAssets);

								setSubmitting(false);
								setModalText('Nova ativo criado com sucesso!');
								switchModalState();
								switchNewAssetMode();
							} catch (err) {
								console.error(err);
							}
						}}
					>
						<Form>
							<div>
								<h1>Cadastrar novo ativo</h1>

								<DuoColumns>
									<div>
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
									</div>

									<div>
										<Label htmlFor="equipment">Equipamento</Label>
										<Field name="equipment" as="select">
											<option defaultChecked>Selecione</option>
											<option value="Notebook">Notebook</option>
											<option value="Desktop">Desktop</option>
										</Field>
										<Error>
											<ErrorMessage name="equipment" />
										</Error>
									</div>
								</DuoColumns>

								<Label htmlFor="modelo">Modelo</Label>
								<Field name="modelo" type="text" />
								<Error>
									<ErrorMessage name="modelo" />
								</Error>

								<Label htmlFor="hostname">Host Name</Label>
								<Field name="hostname" type="text" />
								<Error>
									<ErrorMessage name="hostname" />
								</Error>

								<Label htmlFor="user">Usuário</Label>
								<Field name="user" type="text" />
								<Error>
									<ErrorMessage name="user" />
								</Error>

								<DuoColumns>
									<div>
										<Label htmlFor="cpu">Processador</Label>
										<Field name="cpu" type="text" />
										<Error>
											<ErrorMessage name="cpu" />
										</Error>
									</div>

									<div>
										<Label htmlFor="hd">Disco</Label>
										<Field name="hd" type="text" />
										<Error>
											<ErrorMessage name="hd" />
										</Error>
									</div>
								</DuoColumns>

								<DuoColumns>
									<div>
										<Label htmlFor="memory">Memória</Label>
										<Field name="memory" as="select">
											<option defaultChecked>Selecione</option>
											<option value="8GB">8GB</option>
											<option value="12GB">12GB</option>
											<option value="16GB">16GB</option>
											<option value="32GB">32GB</option>
											<option value="64GB">64GB</option>
											<option value="128GB">128GB</option>
											<option value="256BB">256BB</option>
											<option value="Outros">Outros</option>
										</Field>
										<Error>
											<ErrorMessage name="memory" />
										</Error>
									</div>

									<div>
										<Label htmlFor="so">Sistema Operacional</Label>
										<Field name="so" as="select">
											<option defaultChecked>Selecione</option>
											<option value="Windows 10 Pro">Windows 10 Pro</option>
											<option value="Linux Ubunto">Linux Ubunto</option>
											<option value="Outros">Outros</option>
										</Field>
										<Error>
											<ErrorMessage name="so" />
										</Error>
									</div>
								</DuoColumns>

								<DuoColumns>
									<div>
										<Label htmlFor="licensed">Licenciado</Label>
										<Field name="licensed" as="select">
											<option defaultChecked>Selecione</option>
											<option value="Sim">Sim</option>
											<option value="Não">Não</option>
										</Field>
										<Error>
											<ErrorMessage name="licensed" />
										</Error>
									</div>

									<div>
										<Label htmlFor="antivirus">Antivírus</Label>
										<Field name="antivirus" as="select">
											<option defaultChecked>Selecione</option>
											<option value="Sim">Sim</option>
											<option value="Não">Não</option>
										</Field>
										<Error>
											<ErrorMessage name="antivirus" />
										</Error>
									</div>
								</DuoColumns>

								<DuoColumns>
									<div>
										<Label htmlFor="tdr">TDR Watchguard</Label>
										<Field name="tdr" as="select">
											<option defaultChecked>Selecione</option>
											<option value="Sim">Sim</option>
											<option value="Não">Não</option>
										</Field>
										<Error>
											<ErrorMessage name="tdr" />
										</Error>
									</div>

									<div>
										<Label htmlFor="inuse">Em uso</Label>
										<Field name="inuse" as="select">
											<option defaultChecked>Selecione</option>
											<option value="Sim">Sim</option>
											<option value="Não">Não</option>
										</Field>
										<Error>
											<ErrorMessage name="inuse" />
										</Error>
									</div>
								</DuoColumns>
							</div>
							<Button type="submit">Registrar ativo</Button>
							<Button onClick={switchNewAssetMode}> Voltar </Button>
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
							equipment: initialFormValues.equipment,
							modelo: initialFormValues.modelo,
							hostname: initialFormValues.hostname,
							user: initialFormValues.user,
							memory: initialFormValues.memory,
							cpu: initialFormValues.cpu,
							hd: initialFormValues.hd,
							so: initialFormValues.so,
							licensed: initialFormValues.licensed,
							antivirus: initialFormValues.antivirus,
							tdr: initialFormValues.tdr,
							inuse: initialFormValues.inuse,
							assetId: initialFormValues.assetId,
						}}
						validationSchema={Yup.object({
							equipment: Yup.string().required('Campo obrigatório'),
							modelo: Yup.string().required('Campo obrigatório'),
							hostname: Yup.string().required('Campo obrigatório'),
							user: Yup.string().required('Campo obrigatório'),
							memory: Yup.string().required('Campo obrigatório'),
							cpu: Yup.string().required('Campo obrigatório'),
							hd: Yup.string().required('Campo obrigatório'),
							so: Yup.string().required('Campo obrigatório'),
							licensed: Yup.string().required('Campo obrigatório'),
							antivirus: Yup.string().required('Campo obrigatório'),
							tdr: Yup.string().required('Campo obrigatório'),
							inuse: Yup.string().required('Campo obrigatório'),
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
									`http://localhost:3333/api/client/assets/${values.assetId}`,
									'PATCH',
									JSON.stringify({
										equipment: values.equipment,
										modelo: values.modelo,
										hostname: values.hostname,
										user: values.user,
										memory: values.memory,
										cpu: values.cpu,
										hd: values.hd,
										so: values.so,
										licensed: values.licensed,
										antivirus: values.antivirus,
										tdr: values.tdr,
										inuse: values.inuse,
									}),
									{
										'Content-Type': 'application/json',
									},
								);
								const editedAsset = {
									_id: values.assetId,
									equipment: values.equipment,
									modelo: values.modelo,
									hostname: values.hostname,
									user: values.user,
									memory: values.memory,
									cpu: values.cpu,
									hd: values.hd,
									so: values.so,
									licensed: values.licensed,
									antivirus: values.antivirus,
									tdr: values.tdr,
									inuse: values.inuse,
								};
								const index = assets.findIndex(
									(asset) => asset._id === values.assetId,
								);
								if (index !== -1) {
									const auxAssets = [...assets];
									auxAssets[index] = editedAsset;
									setAssets(auxAssets);
								}
								setSubmitting(false);
								setModalText('Ativo editado com sucesso!');
								switchModalState();
								switchEditModeHandler();
							} catch (err) {
								console.log(err);
							}
						}}
					>
						<Form>
							<div>
								<h1>Editar ativo da empresa</h1>

								<Label htmlFor="equipment">Equipamento</Label>
								<Field name="equipment" as="select">
									<option defaultChecked>Selecione</option>
									<option value="Notebook">Notebook</option>
									<option value="Desktop">Desktop</option>
								</Field>
								<Error>
									<ErrorMessage name="equipment" />
								</Error>

								<Label htmlFor="modelo">Modelo</Label>
								<Field name="modelo" type="text" />
								<Error>
									<ErrorMessage name="modelo" />
								</Error>

								<Label htmlFor="hostname">Host Name</Label>
								<Field name="hostname" type="text" />
								<Error>
									<ErrorMessage name="hostname" />
								</Error>

								<Label htmlFor="user">Usuário</Label>
								<Field name="user" type="text" />
								<Error>
									<ErrorMessage name="user" />
								</Error>

								<DuoColumns>
									<div>
										<Label htmlFor="cpu">Processador</Label>
										<Field name="cpu" type="text" />
										<Error>
											<ErrorMessage name="cpu" />
										</Error>
									</div>

									<div>
										<Label htmlFor="hd">Disco</Label>
										<Field name="hd" type="text" />
										<Error>
											<ErrorMessage name="hd" />
										</Error>
									</div>
								</DuoColumns>

								<DuoColumns>
									<div>
										<Label htmlFor="memory">Memória</Label>
										<Field name="memory" as="select">
											<option defaultChecked>Selecione</option>
											<option value="8GB">8GB</option>
											<option value="12GB">12GB</option>
											<option value="16GB">16GB</option>
										</Field>
										<Error>
											<ErrorMessage name="memory" />
										</Error>
									</div>

									<div>
										<Label htmlFor="so">Sistema Operacional</Label>
										<Field name="so" as="select">
											<option defaultChecked>Selecione</option>
											<option value="Windows 10 Pro">Windows 10 Pro</option>
											<option value="Linux Ubunto">Linux Ubunto</option>
										</Field>
										<Error>
											<ErrorMessage name="so" />
										</Error>
									</div>
								</DuoColumns>

								<DuoColumns>
									<div>
										<Label htmlFor="licensed">Licenciado</Label>
										<Field name="licensed" as="select">
											<option defaultChecked>Selecione</option>
											<option value="Sim">Sim</option>
											<option value="Não">Não</option>
										</Field>
										<Error>
											<ErrorMessage name="licensed" />
										</Error>
									</div>

									<div>
										<Label htmlFor="antivirus">Antivírus</Label>
										<Field name="antivirus" as="select">
											<option defaultChecked>Selecione</option>
											<option value="Sim">Sim</option>
											<option value="Não">Não</option>
										</Field>
										<Error>
											<ErrorMessage name="antivirus" />
										</Error>
									</div>
								</DuoColumns>

								<DuoColumns>
									<div>
										<Label htmlFor="tdr">TDR Watchguard</Label>
										<Field name="tdr" as="select">
											<option defaultChecked>Selecione</option>
											<option value="Sim">Sim</option>
											<option value="Não">Não</option>
										</Field>
										<Error>
											<ErrorMessage name="tdr" />
										</Error>
									</div>

									<div>
										<Label htmlFor="inuse">Em uso</Label>
										<Field name="inuse" as="select">
											<option defaultChecked>Selecione</option>
											<option value="Sim">Sim</option>
											<option value="Não">Não</option>
										</Field>
										<Error>
											<ErrorMessage name="inuse" />
										</Error>
									</div>
								</DuoColumns>
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
					<h1>Lista de ativos cadastrados</h1>
					<Button onClick={switchNewAssetMode}>Adicionar Novo Ativo</Button>
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
							<th>Equipamento</th>
							<th>Modelo</th>
							<th>Host Name</th>
							<th>Usuário</th>
							<th>Memória</th>
							<th>Processador</th>
							<th>Disco</th>
							<th>Sistema OP</th>
							<th>Licenciado</th>
							<th>Antivírus</th>
							<th>TDR</th>
							<th>Em uso</th>
							<th>Editar</th>
							<th>Deletar</th>
						</tr>
					</tbody>
					{assets &&
						assets.map((asset) => {
							//erro causado por falta de um tbody em volta da tabela
							return (
								<tr key={asset._id}>
									<td>{asset.equipment}</td>
									<td>{asset.modelo}</td>
									<td>{asset.hostname}</td>
									<td>{asset.user}</td>
									<td>{asset.memory}</td>
									<td>{asset.cpu}</td>
									<td>{asset.hd}</td>
									<td>{asset.so}</td>
									<td>{asset.licensed}</td>
									<td>{asset.antivirus}</td>
									<td>{asset.tdr}</td>
									<td>{asset.inuse}</td>
									<td>
										<AiFillEdit
											onClick={() => switchEditModeHandler(asset)}
											style={{ fill: 'blue' }}
											size={20}
										/>
									</td>
									<td>
										<AiFillDelete
											onClick={(event) => deleteClientHandler(asset._id, event)}
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

export default AdminEnterpriseAssets;
