import React, { useEffect, useState } from 'react';
import { AiFillEdit, AiFillDelete } from 'react-icons/ai';

import {
	Container,
	UsersContainer,
	Header,
	ClientsTable,
	Card,
	Error,
	Label,
} from './styles';
import Menu from '../../components/Menu';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useHttpClient } from '../../hooks/http-hook';

import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Button from '../../components/Button';

const AdminEquipments = () => {
	const { sendRequest, isLoading } = useHttpClient();

	const [equipments, setEquipments] = useState([]);
	// const [clients, setClients] = useState([]);
	const [initialFormValues, setInitialFormValues] = useState();
	const [isEditMode, setIsEditMode] = useState(false);

	//falta auth
	useEffect(() => {
		//https://secureone-backend.herokuapp.com
		//http://localhost:3333
		sendRequest(
			'http://localhost:3333/api/client/equipments',
			'GET',
			null,
		).then((response) => {
			setEquipments(response);
		});
	}, [sendRequest]);

	const switchEditModeHandler = (equipment) => {
		if (equipment) {
			const initialvalues = {
				equipment: equipment.equipment,
				version: equipment.version,
				type: equipment.type,
				due_date: equipment.due_date,
				modalidade: equipment.modalidade,
				equipmentId: equipment._id,
			};
			setInitialFormValues(initialvalues);
		}
		setIsEditMode((prevMode) => !prevMode);
	};

	const deleteClientHandler = async (equipmentId, event) => {
		event.preventDefault();
		//https://secureone-backend.herokuapp.com
		//http://localhost:3333
		try {
			const response = await sendRequest(
				`http://localhost:3333/api/client/equipment/${equipmentId}`,
				'DELETE',
				null,
			);
			const index = equipments.findIndex(
				(equipment) => equipment._id === equipmentId,
			);
			if (index !== -1) {
				const auxEquipments = [...equipments];
				auxEquipments.splice(index, 1);
				setEquipments(auxEquipments);
			}
			console.log(response);
		} catch (err) {
			console.log(err);
			alert(err.message);
		}
	};

	if (isEditMode) {
		return (
			<Container>
				<Menu />
				<Card>
					<Formik
						initialValues={{
							equipment: initialFormValues.equipment,
							version: initialFormValues.version,
							type: initialFormValues.type,
							due_date: initialFormValues.due_date,
							modalidade: initialFormValues.modalidade,
							equipmentId: initialFormValues.equipmentId,
						}}
						validationSchema={Yup.object({
							equipment: Yup.string().required('Campo obrigatório'),
							version: Yup.string().required('Campo obrigatório'),
							type: Yup.string().required('Campo obrigatório'),
							due_date: Yup.string().required('Campo obrigatório'),
							modalidade: Yup.string().required('Campo obrigatório'),
						})}
						onSubmit={async (values, { setSubmitting }) => {
							try {
								//vai precisar disso aqui depois
								/**
								 * {
										'Content-Type': 'application/json',
										Authorization: `Bearer ${storedData.token}`,
									},
								 */
								//https://secureone-backend.herokuapp.com
								//http://localhost:3333
								await sendRequest(
									`http://localhost:3333/api/client/equipment/${values.equipmentId}`,
									'PATCH',
									JSON.stringify({
										equipment: values.equipment,
										version: values.version,
										type: values.type,
										due_date: values.due_date,
										modalidade: values.modalidade,
									}),
									{
										'Content-Type': 'application/json',
									},
								);
								const editedEquipment = {
									_id: values.equipmentId,
									equipment: values.equipment,
									version: values.version,
									type: values.type,
									due_date: values.due_date,
									modalidade: values.modalidade,
								};
								const index = equipments.findIndex(
									(equipment) => equipment._id === values.equipmentId,
								);
								if (index !== -1) {
									const auxEquipments = [...equipments];
									auxEquipments[index] = editedEquipment;
									setEquipments(auxEquipments);
								}
								setSubmitting(false);
							} catch (err) {
								console.log(err);
							}
							switchEditModeHandler();
						}}
					>
						<Form>
							<div>
								<h1>Editar equipamento</h1>

								<Label htmlFor="equipment">Equipamento</Label>
								<Field name="equipment" as="select">
									<option defaultChecked>Selecione</option>
									<option value="Dimension">Dimension</option>
									<option value="WebBlocker Server">WebBlocker Server</option>
									<option value="Firebox T10">Firebox T10</option>
									<option value="Firebox T15">Firebox T15</option>
									<option value="Firebox T20 and T40">
										Firebox T20 and T40
									</option>
									<option value="Firebox T30 and T50">
										Firebox T30 and T50
									</option>
									<option value="Firebox T35">Firebox T35</option>
									<option value="Firebox T55">Firebox T55</option>
									<option value="Firebox T70">Firebox T70</option>
									<option value="Firebox T80">Firebox T80</option>
									<option value="Firebox M200 and M300">
										Firebox M200 and M300
									</option>
									<option value="Firebox M400 and M500">
										Firebox M400 and M500
									</option>
									<option value="Firebox M440">Firebox M440</option>
									<option value="Firebox M270, M370, M470, M570 and M670">
										Firebox M270, M370, M470, M570 and M670
									</option>
									<option value="Firebox M4600 and M5600">
										Firebox M4600 and M5600
									</option>
									<option value="FireboxV Hyper-V">FireboxV Hyper-V</option>
									<option value="FireboxV VMware">FireboxV VMware</option>
									<option value="Firebox Cloud">Firebox Cloud</option>
									<option value="XTM 25 and 26">XTM 25 and 26</option>
									<option value="XTM 33">XTM 33</option>
									<option value="XTM 330">XTM 330</option>
									<option value="XTM 5 Series (515, 525, 535, 545)">
										XTM 5 Series (515, 525, 535, 545)
									</option>
									<option value="XTM 8 Series (810, 820, 830)">
										XTM 8 Series (810, 820, 830)
									</option>
									<option value="XTM 800, 1500, and 2500 Series">
										XTM 800, 1500, and 2500 Series
									</option>
									<option value="XTM 1050 Series">XTM 1050 Series</option>
									<option value="XTM 2050 Series">XTM 2050 Series</option>
									<option value="XTMv VMware">XTMv VMware</option>
									<option value="XTMv Hyper-V">XTMv Hyper-V</option>
									<option value="AP420">AP420</option>
									<option value="AP300">AP300</option>
									<option value="AP200">AP200</option>
									<option value="AP100/AP102">AP100/AP102</option>
									<option value="AP327X">AP327X</option>
									<option value="AP325">AP325</option>
									<option value="AP322">AP322</option>
									<option value="AP320">AP320</option>
									<option value="AP225W">AP225W</option>
									<option value="AP125">AP125</option>
									<option value="AP120">AP120</option>
									<option value="Threat Detection and Response">
										Threat Detection and Response
									</option>
									<option value="DNSWatchGO">DNSWatchGO</option>
									<option value="XCS">XCS</option>
									<option value="XCSv">XCSv</option>
									<option value="XTM 21, 22, and 23">XTM 21, 22, and 23</option>
									<option value="Firebox X Edge e-Series">
										Firebox X Edge e-Series
									</option>
									<option value="Firebox X Core e-Series">
										Firebox X Core e-Series
									</option>
									<option value="Firebox X Peak e-Series">
										Firebox X Peak e-Series
									</option>
									<option value="XTM 5 Series (505, 510, 520, 530)">
										XTM 5 Series (505, 510, 520, 530)
									</option>
									<option value="SSL 100">SSL 100</option>
									<option value="SSL 560">SSL 560</option>
									<option value="QMSeQMSv">QMSeQMSv</option>
								</Field>
								<Error>
									<ErrorMessage name="equipment" />
								</Error>

								<Label htmlFor="type">Modelo</Label>
								<Field name="type" type="text" />
								<Error>
									<ErrorMessage name="type" />
								</Error>

								<Label htmlFor="version">Versão do Firmware</Label>
								<Field name="version" type="text" />
								<Error>
									<ErrorMessage name="version" />
								</Error>

								<Label htmlFor="due_date">Data de vencimento</Label>
								<Field name="due_date" type="date" />
								<Error>
									<ErrorMessage name="due_date" />
								</Error>

								<Label htmlFor="modalidade">Modalidade</Label>
								<Field name="modalidade" type="text" />
								<Error>
									<ErrorMessage name="modalidade" />
								</Error>
							</div>
							<Button type="submit">Editar</Button>
							<Button onClick={switchEditModeHandler}> Voltar </Button>
						</Form>
					</Formik>
				</Card>
			</Container>
		);
	}

	return (
		<Container>
			<Menu />
			<UsersContainer>
				<Header>
					<h1>Lista de equipamentos cadastrados</h1>
				</Header>
				{isLoading && <LoadingSpinner />}
				<ClientsTable>
					<tbody>
						<tr>
							<th>Equipamento</th>
							<th>Modelo</th>
							<th>Versão Firmware</th>
							<th>Data de vencimento</th>
							<th>Modalidade</th>
							<th>Editar</th>
							<th>Deletar</th>
						</tr>
					</tbody>
					{equipments &&
						equipments.map((equipment) => {
							const dueDate = new Date(equipment.due_date);
							const date = dueDate.getDate();
							const month = dueDate.getMonth();
							const year = dueDate.getFullYear();
							const dateString = date + 1 + '/' + (month + 1) + '/' + year;
							//erro causado por falta de um tbody em volta da tabela
							return (
								<tr key={equipment._id}>
									<td>{equipment.equipment}</td>
									<td>{equipment.type}</td>
									<td>{equipment.version}</td>
									<td>{dateString}</td>
									<td>{equipment.modalidade}</td>

									<td>
										<AiFillEdit
											onClick={() => switchEditModeHandler(equipment)}
											style={{ fill: 'blue' }}
											size={20}
										/>
									</td>
									<td>
										<AiFillDelete
											onClick={(event) =>
												deleteClientHandler(equipment._id, event)
											}
											style={{ fill: 'red' }}
											size={20}
										/>
									</td>
								</tr>
							);
						})}
				</ClientsTable>
			</UsersContainer>
		</Container>
	);
};

export default AdminEquipments;
