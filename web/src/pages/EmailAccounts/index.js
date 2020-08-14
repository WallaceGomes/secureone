import React, { useState, useEffect } from 'react';

import { Container, Card } from './styles';
import Menu from '../../components/Menu';
import Select from '../../components/Select';
import { useHttpClient } from '../../hooks/http-hook';
import LoadingSpinner from '../../components/LoadingSpinner';
import Input from '../../components/Input';
import Button from '../../components/Button';

const EmailAccounts = () => {
	const [clients, setClients] = useState();
	const [clientId, setClientId] = useState();
	const [name, setName] = useState();
	const [email, setEmail] = useState();
	const [license, setLicense] = useState();

	const { sendRequest, isLoading } = useHttpClient();

	useEffect(() => {
		sendRequest('http://localhost:3333/api/users/clients', 'GET', null).then(
			(response) => {
				setClients(response);
			},
		);
	}, []);

	const newEmailSubmitHandler = async (event) => {
		event.preventDefault();
		try {
			//falta status
			await sendRequest(
				'http://localhost:3333/api/client/users/emails/create',
				'POST',
				JSON.stringify({
					clientId: clientId,
					email: email,
					name: name,
					license: license,
				}),
				{
					'Content-Type': 'application/json',
				},
			);
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<>
			<Container>
				<Menu />
				{isLoading && <LoadingSpinner asOverlay />}
				<Card>
					<form onSubmit={newEmailSubmitHandler}></form>
					<h1>Cadastrar nova conta de e-email ativa</h1>
					<Select
						name="clients"
						type="select"
						value={clientId}
						options={clients}
						setValue={setClientId}
					/>
					<Input
						name="name"
						type="text"
						value={name}
						placeholder="Nome"
						setValue={setName}
					/>
					<Input
						name="email"
						type="text"
						value={email}
						placeholder="Email"
						setValue={setEmail}
					/>
					<Input
						name="license"
						type="text"
						value={license}
						placeholder="Licenças"
						setValue={setLicense}
					/>
					<Button type="submit">Registrar</Button>
				</Card>
			</Container>
		</>
	);
};

export default EmailAccounts;
