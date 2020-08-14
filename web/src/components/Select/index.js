import React from 'react';

import { Label } from './styles';

const Select = ({ name, value, setValue, options }) => {
	if (options) {
		return (
			<Label>
				<select
					name={name}
					value={value}
					onChange={(e) => setValue(e.target.value)}
				>
					<option defaultChecked>Selecione o cliente</option>
					{options.map((client) => {
						return (
							<option key={client._id} value={client._id}>
								{client.name}
							</option>
						);
					})}
				</select>
			</Label>
		);
	}

	return (
		<Label>
			<select
				name={name}
				value={value}
				onChange={(e) => setValue(e.target.value)}
			>
				<option value="Ativo">Ativo</option>
				<option value="Inativo">Inativo</option>
			</select>
		</Label>
	);
};

export default Select;
