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
					{options.map((client) => {
						return <option value={client.id}>{client.name}</option>;
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
