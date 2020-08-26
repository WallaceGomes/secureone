import React, { useEffect, useState, useContext } from 'react';

import { Container, AuxCard, DataTable } from './styles';
import Menu from '../../components/Menu';
import { useHttpClient } from '../../hooks/http-hook';
import LoadingSpinner from '../../components/LoadingSpinner';
import { AuthContext } from '../../util/AuthContext';

const ClientEnterpriseAssets = () => {
	const [assets, setAssets] = useState([]);

	const { sendRequest, isLoading } = useHttpClient();
	const auth = useContext(AuthContext);

	useEffect(() => {
		//https://secureone-backend.herokuapp.com
		//http://localhost:3333
		sendRequest(
			`http://localhost:3333/api/client/assets/${auth.userId}`,
			'GET',
			null,
			{
				Authorization: 'Bearer ' + auth.token,
			},
		).then((response) => {
			setAssets(response);
		});
	}, [sendRequest, auth]);

	return (
		<Container>
			<Menu />
			{isLoading && <LoadingSpinner />}
			<AuxCard>
				<h1>Ativos registrados</h1>
				<DataTable>
					<tbody>
						<tr>
							<th>Equipamento</th>
							<th>Host Name</th>
							<th>Usuário</th>
							<th>Memória</th>
							<th>Processador</th>
							<th>Disco</th>
							<th>Sistema OP</th>
							<th>Licenciado</th>
							<th>Antivírus</th>
							<th>TDR (Watchguard)</th>
							<th>Em uso</th>
						</tr>
					</tbody>
					{assets &&
						assets.map((asset) => {
							return (
								<tr key={asset._id}>
									<td>{asset.equipment}</td>
									<td>{asset.hostname}</td>
									<td>{asset.user}</td>
									<td>{asset.memory}</td>
									<td>{asset.cpu}</td>
									<td>{asset.hd}</td>
									<td>{asset.so}</td>
									<td>{asset.licensed}</td>
									<td>{asset.antivirus}</td>
									<td>{asset.tdr}</td>
									<td>{asset.inuse}</td>
								</tr>
							);
						})}
				</DataTable>
			</AuxCard>
		</Container>
	);
};

export default ClientEnterpriseAssets;
