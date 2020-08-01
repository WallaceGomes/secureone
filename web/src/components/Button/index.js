import React from 'react';

import { StyledButton } from './styles';

const Button = (props) => {
	return (
		<StyledButton
			type={props.type}
			onClick={props.onClick}
			disabled={props.disabled}
		>
			{props.children}
		</StyledButton>
	);
};

export default Button;
