import React, { useState } from 'react';

import { Container, Card, Label, Error } from './styles';
import { useHttpClient } from '../../hooks/http-hook';
import LoadingSpinner from '../../components/LoadingSpinner';
import logo from '../../assets/logo.png';
import Button from '../../components/Button';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const Login = () => {
	const [isConfirmMode, setIsConfirmMode] = useState(false);
	const { isLoading, sendRequest } = useHttpClient();

	if (isConfirmMode) {
		return (
			<Container>
				{isLoading && <LoadingSpinner asOverlay />}
				<Card>
					<img src={logo} alt="Logo" />
					<Formik
						initialValues={{
							email: '',
							password: '',
							confirmPassword: '',
						}}
						validationSchema={Yup.object({
							password: Yup.string()
								.min(8, 'Mínimo 8 caracteres')
								.required('Campo obrigatório'),
							email: Yup.string()
								.email('Formato de email inválido')
								.required('Campo obrigatório'),
							confirmPassword: Yup.string()
								.required('Confirme sua senha')
								.test('passwords-match', 'Senhas diferentes', function (value) {
									return this.parent.password === value;
								}),
						})}
						onSubmit={async (values, { setSubmitting }) => {
							console.log(values);
							setIsConfirmMode(false);
							// try {
							// 	const response = await sendRequest(
							// 		'http://localhost:3333/api/users/changepass',
							// 		'POST',
							// 		JSON.stringify({
							// 			email: values.email,
							// 			password: values.password,
							// 		}),
							// 		{
							// 			'Content-Type': 'application/json',
							// 		},
							// 	);
							// 	setSubmitting(false);
							// 	if(!response){
							// 		setIsConfirmMode(true);
							// 	}
							// } catch (err) {
							// 	console.error(err);
							// }
						}}
					>
						<Form>
							<div>
								<h1>Troque sua senha</h1>

								<Label htmlFor="name">Nome</Label>
								<Field name="name" type="text" />
								<Error>
									<ErrorMessage name="name" />
								</Error>

								<Label htmlFor="password">Senha</Label>
								<Field name="password" type="password" />
								<Error>
									<ErrorMessage name="password" />
								</Error>

								<Label htmlFor="confirmPassword">Confirme sua senha</Label>
								<Field name="confirmPassword" type="password" />
								<Error>
									<ErrorMessage name="confirmPassword" />
								</Error>
							</div>
							<Button type="submit">Trocar a senha</Button>
						</Form>
					</Formik>
				</Card>
			</Container>
		);
	} else {
		return (
			<Container>
				{isLoading && <LoadingSpinner asOverlay />}
				<Card>
					<img src={logo} alt="Logo" />
					<Formik
						initialValues={{
							email: '',
							password: '',
						}}
						validationSchema={Yup.object({
							password: Yup.string()
								.min(8, 'Mínimo 8 caracteres')
								.required('Campo obrigatório'),
							email: Yup.string()
								.email('Formato de email inválido')
								.required('Campo obrigatório'),
						})}
						onSubmit={async (values, { setSubmitting }) => {
							console.log(values);
							setIsConfirmMode(true);
							// try {
							// 	const response = await sendRequest(
							// 		'http://localhost:3333/api/users/login',
							// 		'POST',
							// 		JSON.stringify({
							// 			email: values.email,
							// 			password: values.password,
							// 		}),
							// 		{
							// 			'Content-Type': 'application/json',
							// 		},
							// 	);
							// 	setSubmitting(false);
							// 	if(!response){
							// 		setIsConfirmMode(true);
							// 	}
							// } catch (err) {
							// 	console.error(err);
							// }
						}}
					>
						<Form>
							<div>
								<h1>Login</h1>

								<Label htmlFor="email">Email</Label>
								<Field name="email" type="email" />
								<Error>
									<ErrorMessage name="email" />
								</Error>

								<Label htmlFor="password">Senha</Label>
								<Field name="password" type="password" />
								<Error>
									<ErrorMessage name="password" />
								</Error>
							</div>
							<Button type="submit">Login</Button>
						</Form>
					</Formik>
				</Card>
			</Container>
		);
	}
};

export default Login;
