import React, { useState, useEffect } from 'react';

import { Container, Card } from './styles';
import Menu from '../../components/Menu';
import Select from '../../components/Select';
import { useHttpClient } from '../../hooks/http-hook';
import LoadingSpinner from '../../components/LoadingSpinner';
import Input from '../../components/Input';
import Button from '../../components/Button';

const ActiveUsers = () => {
	const [clients, setClients] = useState();
	const [clientId, setClientId] = useState();
	const [name, setName] = useState();
	const [email, setEmail] = useState();
	const [password, setPassword] = useState();
	const [teamViewer, setTeamViewer] = useState();
	const [tvPassword, setTvPassword] = useState();
	const [phone, setPhone] = useState();
	const [login, setLogin] = useState();

	const { sendRequest, isLoading } = useHttpClient();

	useEffect(() => {
		sendRequest('http://localhost:3333/api/users/clients', 'GET', null).then(
			(response) => {
				setClients(response);
			},
		);
	}, [sendRequest]);

	const newActiveUserSubmitHandler = async (event) => {
		event.preventDefault();
		try {
			//tem que mudar no backend a rota
			const response = await sendRequest(
				'http://localhost:3333/api/active/create',
				'POST',
				JSON.stringify({
					clientId: clientId,
					email: email,
					name: name,
					password: password,
					teamviewer: teamViewer,
					tvpassword: tvPassword,
					phone: phone,
					login: login,
				}),
				{
					'Content-Type': 'application/json',
				},
			);
			console.log(clientId);
			console.log(response);
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
					<form onSubmit={newActiveUserSubmitHandler}>
						<h1>Cadastrar novo usuário ativo</h1>
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
							type="email"
							value={email}
							placeholder="E-mail"
							setValue={setEmail}
						/>
						<Input
							name="password"
							type="text"
							value={password}
							placeholder="Senha"
							setValue={setPassword}
						/>
						<Input
							name="teamviewer"
							type="text"
							value={teamViewer}
							placeholder="Team Viewer"
							setValue={setTeamViewer}
						/>
						<Input
							name="tvpassword"
							type="text"
							value={tvPassword}
							placeholder="Senha do Team Viewer"
							setValue={setTvPassword}
						/>
						<Input
							name="phone"
							type="text"
							value={phone}
							placeholder="Telefone"
							setValue={setPhone}
						/>
						<Input
							name="login"
							type="text"
							value={login}
							placeholder="Login"
							setValue={setLogin}
						/>

						<Button type="submit">Cadastrar</Button>
					</form>
				</Card>
			</Container>
		</>
	);
};

export default ActiveUsers;
