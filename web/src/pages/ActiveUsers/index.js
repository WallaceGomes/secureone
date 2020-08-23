import React, { useState, useEffect } from 'react';

import { Container, Card, Error, Label } from './styles';
import Menu from '../../components/Menu';
import { useHttpClient } from '../../hooks/http-hook';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Button from '../../components/Button';

const ActiveUsers = () => {
	const [clients, setClients] = useState([]);

	const { sendRequest, isLoading } = useHttpClient();

	useEffect(() => {
		sendRequest(
			'https://secureone-backend.herokuapp.com/api/users/clients',
			'GET',
			null,
		).then((response) => {
			setClients(response);
		});
	}, [sendRequest]);

	return (
		<>
			<Container>
				<Menu />
				{isLoading && <LoadingSpinner asOverlay />}
				<Card>
					<Formik
						initialValues={{
							name: '',
							email: '',
							password: '',
							teamviewer: '',
							tvpassword: '',
							phone: '',
							login: '',
							clientId: '',
						}}
						validationSchema={Yup.object({
							clientId: Yup.string().required('Selecione o cliente'),
							name: Yup.string().required('Campo obrigatório'),
							email: Yup.string()
								.email('Formato de email inválido')
								.required('Campo obrigatório'),
							password: Yup.string().required('Campo obrigatório'),
							teamviewer: Yup.string().required('Campo obrigatório'),
							tvpassword: Yup.string().required('Campo obrigatório'),
							phone: Yup.string()
								.min(10, 'Número incompleto')
								.max(11, 'Máximo de 11 números')
								.required('Campo obrigatório'),
							login: Yup.string().required('Campo obrigatório'),
						})}
						onSubmit={async (values, { setSubmitting }) => {
							console.log(values);
							try {
								const response = await sendRequest(
									'https://secureone-backend.herokuapp.com/api/active/create',
									'POST',
									JSON.stringify({
										name: values.name,
										email: values.email,
										password: values.password,
										teamviewer: values.teamviewer,
										tvpassword: values.tvpassword,
										phone: values.phone,
										login: values.login,
										clientId: values.clientId,
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
								<h1>Cadastrar novo usuário ativo</h1>

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
								<Field
									name="email"
									type="email"
									placeholder="exemplo@exemplo.com"
								/>
								<Error>
									<ErrorMessage name="email" />
								</Error>

								<Label htmlFor="password">Senha</Label>
								<Field name="password" type="text" />
								<Error>
									<ErrorMessage name="password" />
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
								<Field
									name="phone"
									type="number"
									placeholder="Somente números"
								/>
								<Error>
									<ErrorMessage name="phone" />
								</Error>

								<Label htmlFor="login">Login</Label>
								<Field name="login" type="text" />
								<Error>
									<ErrorMessage name="login" />
								</Error>
							</div>
							<Button type="submit">Registrar</Button>
						</Form>
					</Formik>
				</Card>
			</Container>
		</>
	);
};

export default ActiveUsers;
