import React, { useEffect, useState, useContext } from 'react';

import { Container, AuxCard, DataTable } from './styles';
import Menu from '../../components/Menu';
import { useHttpClient } from '../../hooks/http-hook';
import LoadingSpinner from '../../components/LoadingSpinner';
import { AuthContext } from '../../util/AuthContext';

const ClientEquipments = () => {
	const [equipments, setEquipments] = useState([]);

	const { sendRequest, isLoading } = useHttpClient();
	const auth = useContext(AuthContext);

	useEffect(() => {
		//https://secureone-backend.herokuapp.com
		//http://localhost:3333
		sendRequest(
			`https://secureone-backend.herokuapp.com/api/client/equipments/${auth.userId}`,
			'GET',
			null,
			{
				Authorization: 'Bearer ' + auth.token,
			},
		).then((response) => {
			setEquipments(response);
		});
	}, [sendRequest, auth]);

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
							const dueDate = new Date(equipment.due_date);
							const date = dueDate.getDate();
							const month = dueDate.getMonth();
							const year = dueDate.getFullYear();
							const dateString = date + 1 + '/' + (month + 1) + '/' + year;
							return (
								<tr key={equipment._id}>
									<td>{equipment.equipment}</td>
									<td>{equipment.type}</td>
									<td>{equipment.version}</td>
									<td>{dateString}</td>
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
