import styled from 'styled-components';

export const StyledButton = styled.button`
	height: 35px;
	width: 90px;
	background: #0d0d0d;
	border: 1px solid #ffff33;
	color: #fff;
	font-weight: bold;
	cursor: pointer;
	text-decoration: none;
	display: inline-block;
	border-radius: 3px;
	font-size: 14px;

	&:hover {
		color: #000000;
		background: #fff;
		transition: 0.3s;
	}

	&:disabled,
	&:hover:disabled,
	&:active:disabled {
		background: #ccc;
		color: #979797;
		border-color: #ccc;
		cursor: not-allowed;
	}
`;
