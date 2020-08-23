import React, { useEffect, useState } from 'react';

import { Container, AuxCard, DataTable } from './styles';
import Menu from '../../components/Menu';
import { useHttpClient } from '../../hooks/http-hook';
import LoadingSpinner from '../../components/LoadingSpinner';

const ActiveAccounts = () => {
	const [accounts, setAccounts] = useState([]);

	const { sendRequest, isLoading } = useHttpClient();

	useEffect(() => {
		const storedData = JSON.parse(localStorage.getItem('userData'));

		sendRequest(
			`https://secureone-backend.herokuapp.com/api/client/active/emails/${storedData.userId}`,
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
				<DataTable>
					<tbody>
						<tr>
							<th>Nome</th>
							<th>E-mail</th>
							<th>Fornecedor</th>
						</tr>
					</tbody>
					{accounts &&
						accounts.map((account) => {
							return (
								<tr key={account._id}>
									<td>{account.name}</td>
									<td>{account.email}</td>
									<td>{account.license}</td>
								</tr>
							);
						})}
				</DataTable>
			</AuxCard>
		</Container>
	);
};

export default ActiveAccounts;
