import React from 'react';

import { Container, Card, Label, Error } from './styles';
import Menu from '../../components/Menu';
import Button from '../../components/Button';
import { useHistory } from 'react-router-dom';
import { useHttpClient } from '../../hooks/http-hook';
import LoadingSpinner from '../../components/LoadingSpinner';

import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const NewClient = () => {
	const history = useHistory();
	const { isLoading, sendRequest } = useHttpClient();

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
						try {
							await sendRequest(
								'http://localhost:3333/api/users/create',
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
								},
							);
							setSubmitting(false);
							history.push('/admin');
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
					</Form>
				</Formik>
			</Card>
		</Container>
	);
};

export default NewClient;
