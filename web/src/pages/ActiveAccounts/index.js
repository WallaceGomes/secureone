import React, { useEffect, useState } from 'react';

import { Container, AuxCard, StyledCard } from './styles';
import Menu from '../../components/Menu';
import { useHttpClient } from '../../hooks/http-hook';
import LoadingSpinner from '../../components/LoadingSpinner';
import Wraper from '../../components/Wraper';

const ActiveAccounts = () => {
	const [accounts, setAccounts] = useState([]);

	const { sendRequest, isLoading } = useHttpClient();

	useEffect(() => {
		const storedData = JSON.parse(localStorage.getItem('userData'));

		sendRequest(
			`http://localhost:3333/api/client/active/accounts/${storedData.userId}`,
			'GET',
			null,
		).then((response) => {
			setAccounts(response);
			console.log(response);
		});
	}, [sendRequest]);

	return (
		<Container>
			<Menu />
			{isLoading && <LoadingSpinner />}
			<AuxCard>
				<h1>Contas de Email Ativas</h1>
				<Wraper>
					{accounts.map((account) => {
						return (
							<StyledCard key={account._id}>
								<strong>Nome: {account.name}</strong>
								<span>E-mail: {account.email}</span>
								<span>Fornecedor: {account.license}</span>
							</StyledCard>
						);
					})}
				</Wraper>
			</AuxCard>
		</Container>
	);
};

export default ActiveAccounts;
