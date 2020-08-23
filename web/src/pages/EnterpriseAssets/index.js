import React, { useState, useEffect } from 'react';

import { Container, Card, Error, Label, DuoColumns } from './styles';
import Menu from '../../components/Menu';
import { useHttpClient } from '../../hooks/http-hook';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Button from '../../components/Button';

const EnterpriseAssets = () => {
	const [clients, setClients] = useState([]);

	const { sendRequest, isLoading } = useHttpClient();

	useEffect(() => {
		sendRequest('http://localhost:3333/api/users/clients', 'GET', null).then(
			(response) => {
				setClients(response);
			},
		);
	}, [sendRequest]);

	return (
		<>
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
								console.log(response);
								setSubmitting(false);
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
							<Button type="submit">Registrar ativo</Button>
						</Form>
					</Formik>
				</Card>
			</Container>
		</>
	);
};

export default EnterpriseAssets;
