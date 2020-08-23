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
	DuoColumns,
} from './styles';
import Menu from '../../components/Menu';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useHttpClient } from '../../hooks/http-hook';

import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Button from '../../components/Button';

const AdminEnterpriseAssets = () => {
	const { sendRequest, isLoading } = useHttpClient();

	const [assets, setAssets] = useState([]);
	// const [clients, setClients] = useState([]);
	const [initialFormValues, setInitialFormValues] = useState();
	const [isEditMode, setIsEditMode] = useState(false);

	//falta auth
	useEffect(() => {
		// sendRequest('http://localhost:3333/api/users/clients', 'GET', null).then(
		// 	(response) => {
		// 		setClients(response);
		// 	},
		// );

		sendRequest('http://localhost:3333/api/client/assets', 'GET', null).then(
			(response) => {
				setAssets(response);
			},
		);
	}, [sendRequest]);

	const switchEditModeHandler = (asset) => {
		if (asset) {
			const initialvalues = {
				equipment: asset.equipment,
				model: asset.model,
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
		try {
			const response = await sendRequest(
				`http://localhost:3333/api/client/asset/${assetId}`,
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

	if (isEditMode) {
		return (
			<Container>
				<Menu />
				<Card>
					<Formik
						initialValues={{
							equipment: initialFormValues.equipment,
							model: initialFormValues.model,
							hostname: initialFormValues.hostname,
							user: initialFormValues.user,
							memory: initialFormValues.memory,
							cpu: initialFormValues.cpu,
							hd: initialFormValues.hd,
							so: initialFormValues.so,
							licensed: initialFormValues.licensed,
							antivirus: initialFormValues.antivirus,
							tdr: initialFormValues.tdr,
							assetId: initialFormValues.assetId,
						}}
						validationSchema={Yup.object({
							equipment: Yup.string().required('Campo obrigatório'),
							model: Yup.string().required('Campo obrigatório'),
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
								await sendRequest(
									`http://localhost:3333/api/client/asset/${values.assetId}`,
									'PATCH',
									JSON.stringify({
										equipment: values.equipment,
										model: values.model,
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
									model: values.model,
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
							} catch (err) {
								console.log(err);
							}
							switchEditModeHandler();
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

								<Label htmlFor="model">Modelo</Label>
								<Field name="model" type="text" />
								<Error>
									<ErrorMessage name="model" />
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
				</Header>
				{isLoading && <LoadingSpinner />}
				<ClientsTable>
					<tbody>
						<tr>
							<th>Equipamento</th>
							<th>Host Name</th>
							<th>Usuário</th>
							<th>Memória</th>
							<th>Processador</th>
							<th>Disco</th>
							<th>Sistema OP</th>
							<th>Licenciado</th>
							<th>Antivírus</th>
							<th>TDR (Watchguard)</th>
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
