import React, { useState } from 'react';

import { Container, Card } from './styles';
import Menu from '../../components/Menu';
import Input from '../../components/Input';
import Button from '../../components/Button';

const NewClient = () => {
	const [clientName, setClientName] = useState('');
	const [clientEmail, setClientEmail] = useState('');
	const [clientAddress, setClientAddress] = useState('');
	const [clientCNPJ, setClientCNPJ] = useState('');
	const [clientContract, setClientContract] = useState('');
	const [clientDueDate, setClientDueDate] = useState('');

	const newClientSubmitHandler = async (event) => {
		event.preventDefault();
	};

	return (
		<Container>
			<Menu />
			<Card>
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
				<Button> Cadastrar </Button>
			</Card>
		</Container>
	);
};

export default NewClient;
