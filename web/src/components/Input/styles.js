import styled from 'styled-components';

export const Label = styled.label`
	display: flex;
	position: relative;
	margin-bottom: 2rem;

	input {
		background-color: #00001a;
		border: 2px solid #cccc00;
		border-radius: 3px;
		padding: 16px;
		color: #fff;
		font-size: 16px;
		transition: 180ms ease-in-out;
		&::placeholder {
			color: rgba(255, 255, 255, 0.4);
		}

		&:focus {
			border: 2px solid;
		}
	}
`;
