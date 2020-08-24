import React, { useState, useEffect } from 'react';

import { Container, Card, Label, Error } from './styles';
import Menu from '../../components/Menu';
import { useHttpClient } from '../../hooks/http-hook';
import LoadingSpinner from '../../components/LoadingSpinner';

import Button from '../../components/Button';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const EmailAccounts = () => {
	const [clients, setClients] = useState([]);

	const { sendRequest, isLoading } = useHttpClient();

	useEffect(() => {
		//https://secureone-backend.herokuapp.com
		//http://localhost:3333
		sendRequest('http://localhost:3333/api/users/clients', 'GET', null).then(
			(response) => {
				setClients(response);
			},
		);
	}, [sendRequest]);

	// const newEmailSubmitHandler = async (event) => {
	// 	event.preventDefault();
	// 	try {
	// 		await sendRequest(
	// 			'https://secureone-backend.herokuapp.comapi/client/users/emails/create',
	// 			'POST',
	// 			JSON.stringify({
	// 				clientId: clientId,
	// 				email: email,
	// 				name: name,
	// 				license: license,
	// 			}),
	// 			{
	// 				'Content-Type': 'application/json',
	// 			},
	// 		);
	// 	} catch (err) {
	// 		console.error(err);
	// 	}
	// };

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
								await sendRequest(
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
								setSubmitting(false);
								// history.push('/admin');
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
						</Form>
					</Formik>
				</Card>
			</Container>
		</>
	);
};

export default EmailAccounts;
