import React, { useEffect, useState } from 'react';

import { Container, AuxCard, DataTable } from './styles';
import Menu from '../../components/Menu';
import { useHttpClient } from '../../hooks/http-hook';
import LoadingSpinner from '../../components/LoadingSpinner';

const ClientEquipments = () => {
	const [equipments, setEquipments] = useState([]);

	const { sendRequest, isLoading } = useHttpClient();

	useEffect(() => {
		const storedData = JSON.parse(localStorage.getItem('userData'));

		//https://secureone-backend.herokuapp.com
		//http://localhost:3333
		sendRequest(
			`http://localhost:3333/api/client/equipments/${storedData.userId}`,
			'GET',
			null,
		).then((response) => {
			setEquipments(response);
			console.log(response);
		});
	}, [sendRequest]);

	return (
		<Container>
			<Menu />
			{isLoading && <LoadingSpinner />}
			<AuxCard>
				<h1>Equipamentos registrados</h1>
				<DataTable>
					<tbody>
						<tr>
							<th>Equipamento</th>
							<th>Modelo</th>
							<th>Versão Firmware</th>
							<th>Data de vencimento</th>
							<th>Modalidade</th>
						</tr>
					</tbody>
					{equipments &&
						equipments.map((equipment) => {
							return (
								<tr key={equipment._id}>
									<td>{equipment.equipment}</td>
									<td>{equipment.type}</td>
									<td>{equipment.version}</td>
									<td>{equipment.due_date}</td>
									<td>{equipment.modalidade}</td>
								</tr>
							);
						})}
				</DataTable>
			</AuxCard>
		</Container>
	);
};

export default ClientEquipments;
