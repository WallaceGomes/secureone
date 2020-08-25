import React, { useState, useEffect } from 'react';

import { Container, Card, Label, Error } from './styles';
import Menu from '../../components/Menu';
import { useHttpClient } from '../../hooks/http-hook';
import LoadingSpinner from '../../components/LoadingSpinner';

import Button from '../../components/Button';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const NewEquipments = () => {
	const [clients, setClients] = useState([]);

	const { sendRequest, isLoading } = useHttpClient();

	useEffect(() => {
		//https://secureone-backend.herokuapp.com
		//http://localhost:3333
		sendRequest('http://localhost:3333/api/users/clients', 'GET', null).then(
			(response) => {
				setClients(response);
			},
		);
	}, [sendRequest]);

	return (
		<>
			<Container>
				<Menu />
				{isLoading && <LoadingSpinner asOverlay />}
				<Card>
					<Formik
						initialValues={{
							equipment: '',
							version: '',
							type: '',
							due_date: '',
							clientId: '',
							modalidade: '',
							modelo: '',
						}}
						validationSchema={Yup.object({
							clientId: Yup.string().required('Selecione o cliente'),
							equipment: Yup.string().required('Campo obrigatório'),
							version: Yup.string().required('Campo obrigatório'),
							type: Yup.string().required('Campo obrigatório'),
							due_date: Yup.string().required('Campo obrigatório'),
							modalidade: Yup.string().required('Campo obrigatório'),
						})}
						onSubmit={async (values, { setSubmitting }) => {
							console.log(values);
							//https://secureone-backend.herokuapp.com
							//http://localhost:3333
							try {
								await sendRequest(
									'http://localhost:3333/api/client/equipments',
									'POST',
									JSON.stringify({
										equipment: values.equipment,
										version: values.version,
										type: values.type,
										due_date: values.due_date,
										modalidade: values.modalidade,
										modelo: values.modelo,
										clientId: values.clientId,
									}),
									{
										'Content-Type': 'application/json',
									},
								);
								setSubmitting(false);
								// history.push('/admin');
							} catch (err) {
								console.error(err);
							}
						}}
					>
						<Form>
							<div>
								<h1>Novo equipamento</h1>
								<Label htmlFor="clientId">Cliente</Label>
								<Field
									name="clientId"
									as="select"
									placeholder="Selecione o cliente"
								>
									<option defaultChecked>Selecione o cliente</option>
									{clients.map((client) => {
										return (
											<option key={client._id} value={client._id}>
												{client.name}
											</option>
										);
									})}
								</Field>

								<Error>
									<ErrorMessage name="clientId" />
								</Error>

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

								<Label htmlFor="modelo">Modelo</Label>
								<Field name="modelo" type="text" />
								<Error>
									<ErrorMessage name="modelo" />
								</Error>

								<Label htmlFor="version">Versão de Firmware</Label>
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
							<Button type="submit">Cadastrar</Button>
						</Form>
					</Formik>
				</Card>
			</Container>
		</>
	);
};

export default NewEquipments;
