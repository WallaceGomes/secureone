import React, { useState } from 'react';

import { Container, Card } from './styles';
import Menu from '../../components/Menu';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { useHistory } from 'react-router-dom';
import { useHttpClient } from '../../hooks/http-hook';
import LoadingSpinner from '../../components/LoadingSpinner';
import Select from '../../components/Select';

const NewClient = () => {
	const [clientName, setClientName] = useState('');
	const [clientEmail, setClientEmail] = useState('');
	const [clientAddress, setClientAddress] = useState('');
	const [clientCNPJ, setClientCNPJ] = useState('');
	const [clientContract, setClientContract] = useState('');
	const [clientActive, setClientActive] = useState('');
	const [clientDueDate, setClientDueDate] = useState('');

	const history = useHistory();
	const { isLoading, sendRequest } = useHttpClient();

	const newClientSubmitHandler = async (event) => {
		event.preventDefault();
		try {
			await sendRequest(
				'http://localhost:3333/api/users/create',
				'POST',
				JSON.stringify({
					name: clientName,
					email: clientEmail,
					address: clientAddress,
					cnpj: clientCNPJ,
					contract: clientContract,
					status: clientActive,
					due_date: clientDueDate,
				}),
				{
					'Content-Type': 'application/json',
				},
			);
			history.push('/admin');
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<Container>
			<Menu />
			{isLoading && <LoadingSpinner asOverlay />}
			<Card>
				<form onSubmit={newClientSubmitHandler}>
					<h1>Novo Cliente</h1>
					<Input
						name="clientName"
						type="text"
						value={clientName}
						placeholder="Nome"
						setValue={setClientName}
					/>
					<Input
						name="clientEmail"
						type="email"
						value={clientEmail}
						placeholder="E-mail"
						setValue={setClientEmail}
					/>
					<Input
						name="clientAddress"
						type="text"
						value={clientAddress}
						placeholder="Endereço"
						setValue={setClientAddress}
					/>
					<Input
						name="clientCNPJ"
						type="text"
						value={clientCNPJ}
						placeholder="CNPJ"
						setValue={setClientCNPJ}
					/>
					<Select
						name="clientActive"
						type="select"
						value={clientActive}
						setValue={setClientActive}
					/>
					<Input
						name="clientContract"
						type="text"
						value={clientContract}
						placeholder="Contrato"
						setValue={setClientContract}
					/>
					<Input
						name="clientDueDate"
						type="date"
						value={clientDueDate}
						placeholder="Data de Vencimento do Contrato"
						setValue={setClientDueDate}
					/>
					<Button type="submit"> Cadastrar </Button>
				</form>
			</Card>
		</Container>
	);
};

export default NewClient;
