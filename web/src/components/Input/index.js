import React from 'react';

import { Label } from './styles';

const Input = ({ name, type = 'text', value, setValue, placeholder }) => {
	return (
		<Label htmlFor={name}>
			<input
				name={name}
				type={type}
				value={value}
				placeholder={placeholder}
				onChange={(e) => setValue(e.target.value)}
			/>
		</Label>
	);
};

export default Input;
