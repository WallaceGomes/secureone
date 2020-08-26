import React, { useEffect, useState, useContext } from 'react';

import { Container, Card } from './styles';
import Menu from '../../components/Menu';
import { useHttpClient } from '../../hooks/http-hook';
import LoadingSpinner from '../../components/LoadingSpinner';
import { AuthContext } from '../../util/AuthContext';

const MyContract = () => {
	const [client, setClient] = useState({});

	const { sendRequest, isLoading } = useHttpClient();

	const auth = useContext(AuthContext);

	useEffect(() => {
		//https://secureone-backend.herokuapp.com
		//http://localhost:3333
		sendRequest(
			`http://localhost:3333/api/client/info/${auth.userId}`,
			'GET',
			null,
			{
				Authorization: 'Bearer ' + auth.token,
			},
		).then((response) => {
			setClient(response);
		});
	}, [sendRequest, auth]);

	return (
		<Container>
			<Menu />
			{isLoading && <LoadingSpinner />}
			<Card>
				<h1>Bem Vindo ao Portal do Cliente SecureOne!</h1>
				<h1>Cliente: {client.name}</h1>
				<h1>E-mail: {client.email}</h1>
				<h1>Endereço: {client.address}</h1>
				<h1>CNPJ: {client.cnpj}</h1>
				<h1>Status do contrato: {client.status}</h1>
				<h1>Contrato: {client.contract}</h1>
				<h1>Data de vencimento: {client.due_date}</h1>
			</Card>
		</Container>
	);
};

export default MyContract;
