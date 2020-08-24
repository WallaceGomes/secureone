import React, { useState, useContext } from 'react';
import Modal from 'react-modal';

import { Container, Card, Label, Error } from './styles';
import { useHttpClient } from '../../hooks/http-hook';
import { AuthContext } from '../../util/AuthContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import logo from '../../assets/logo.png';
import Button from '../../components/Button';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

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

const Login = () => {
	const [isConfirmMode, setIsConfirmMode] = useState(false);
	const { isLoading, sendRequest } = useHttpClient();

	const auth = useContext(AuthContext);

	const [modalIsOpen, setIsOpen] = useState(false);
	const [modalText, setModalText] = useState('');

	function switchModalState() {
		setIsOpen((prevMode) => !prevMode);
	}

	if (isConfirmMode) {
		return (
			<Container>
				{isLoading && <LoadingSpinner asOverlay />}
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
							//https://secureone-backend.herokuapp.com
							//http://localhost:3333
							try {
								const response = await sendRequest(
									'http://localhost:3333/api/users/changepass',
									'PATCH',
									JSON.stringify({
										email: values.email,
										password: values.password,
									}),
									{
										'Content-Type': 'application/json',
									},
								);
								setModalText('Senha alterada com sucesso!');
								switchModalState();
								setSubmitting(false);
								setIsConfirmMode(false);
								if (!response) {
									setIsConfirmMode(true);
								}
							} catch (err) {
								console.error(err);
								setModalText(
									'Erro ao tentar alterar a senha, por favor confira seu email',
								);
								switchModalState();
							}
						}}
					>
						<Form>
							<div>
								<h1>Troque sua senha</h1>

								<Label htmlFor="email">Email</Label>
								<Field name="email" type="text" />
								<Error>
									<ErrorMessage name="email" />
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
				<Card>
					<img src={logo} alt="Logo" />
					<Formik
						initialValues={{
							email: '',
							password: '',
						}}
						validationSchema={Yup.object({
							password: Yup.string().required('Campo obrigatório'),
							email: Yup.string()
								.email('Formato de email inválido')
								.required('Campo obrigatório'),
						})}
						onSubmit={async (values, { setSubmitting }) => {
							console.log(values);
							//https://secureone-backend.herokuapp.com
							//http://localhost:3333
							try {
								const response = await sendRequest(
									'http://localhost:3333/api/users/login',
									'POST',
									JSON.stringify({
										email: values.email,
										password: values.password,
									}),
									{
										'Content-Type': 'application/json',
									},
								);
								console.log(response);
								setSubmitting(false);
								if (!response) {
									setModalText('Por medidada de segurança troque sua senha!');
									switchModalState();
									setIsConfirmMode(true);
									return;
								}
								auth.login(response.userId, response.token, response.role);
							} catch (err) {
								console.error(err);
								setModalText('Email ou senha incorretos!');
								switchModalState();
							}
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
