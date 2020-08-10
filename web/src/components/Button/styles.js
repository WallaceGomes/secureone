import styled from 'styled-components';

export const StyledButton = styled.button`
	height: 35px;
	width: 90px;
	border: 2px solid #808080;
	font-weight: bold;
	cursor: pointer;
	text-decoration: none;
	display: inline-block;
	border-radius: 3px;
	font-size: 14px;

	&:hover {
		background: #fff;
		transition: 0.3s;
		border: 2px solid #333333;
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
