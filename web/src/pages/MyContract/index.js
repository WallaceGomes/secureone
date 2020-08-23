import React, { useEffect, useState } from 'react';

import { Container, Card } from './styles';
import Menu from '../../components/Menu';
import { useHttpClient } from '../../hooks/http-hook';
import LoadingSpinner from '../../components/LoadingSpinner';

const MyContract = () => {
	const [client, setClient] = useState({});

	const { sendRequest, isLoading } = useHttpClient();

	useEffect(() => {
		const storedData = JSON.parse(localStorage.getItem('userData'));

		sendRequest(
			`https://secureone-backend.herokuapp.com/api/client/info/${storedData.userId}`,
			'GET',
			null,
		).then((response) => {
			setClient(response);
			console.log(response);
		});
	}, [sendRequest]);

	return (
		<Container>
			<Menu />
			{isLoading && <LoadingSpinner />}
			<Card>
				<h1>Cliente: {client.name}</h1>
				<h1>E-mail: {client.email}</h1>
				<h1>Endereço: {client.address}</h1>
				<h1>CNPJ: {client.cnpj}</h1>
				<h1>Status: {client.status}</h1>
				<h1>Contrato: {client.contract}</h1>
				<h1>Data de vencimento: {client.due_date}</h1>
			</Card>
		</Container>
	);
};

export default MyContract;
