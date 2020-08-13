import React from 'react';

import { Label } from './styles';

const Select = ({ name, value, setValue }) => {
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
