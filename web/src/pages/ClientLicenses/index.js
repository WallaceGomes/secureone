import React, { useEffect, useState, useContext } from 'react';

import { Container, AuxCard, DataTable } from './styles';
import Menu from '../../components/Menu';
import { useHttpClient } from '../../hooks/http-hook';
import LoadingSpinner from '../../components/LoadingSpinner';
import { AuthContext } from '../../util/AuthContext';

const ClientLicenses = () => {
	const [licenses, setLicenses] = useState([]);

	const { sendRequest, isLoading } = useHttpClient();
	const auth = useContext(AuthContext);

	useEffect(() => {
		//https://secureone-backend.herokuapp.com
		//http://localhost:3333
		sendRequest(
			`https://secureone-backend.herokuapp.com/api/client/licenses/${auth.userId}`,
			'GET',
			null,
			{
				Authorization: 'Bearer ' + auth.token,
			},
		).then((response) => {
			setLicenses(response);
		});
	}, [sendRequest, auth]);

	return (
		<Container>
			<Menu />
			{isLoading && <LoadingSpinner />}
			<AuxCard>
				<h1>Registro de licenças</h1>
				<DataTable>
					<tbody>
						<tr>
							<th>Fornecedor</th>
							<th>Licenças disponíveis</th>
							<th>Licenças utilizadas</th>
							<th>Equipamentos instalados</th>
							<th>Vencimento</th>
							<th>Fornecedor</th>
							<th>Gerenciamento</th>
						</tr>
					</tbody>
					{licenses &&
						licenses.map((license) => {
							return (
								<tr key={license._id}>
									<td>{license.brand}</td>
									<td>{license.available_licenses}</td>
									<td>{license.used_licenses}</td>
									<td>{license.used_equipments}</td>
									<td>{license.due_date}</td>
									<td>{license.provider}</td>
									<td>{license.management}</td>
								</tr>
							);
						})}
				</DataTable>
			</AuxCard>
		</Container>
	);
};

export default ClientLicenses;
