import styled from 'styled-components';

export const Label = styled.label`
	display: flex;
	flex-direction: column;
	position: relative;
	margin-bottom: 1rem;

	input {
		background-color: #fff;
		border: 2px solid #808080;
		border-radius: 3px;
		padding: 16px;
		font-size: 16px;
		transition: 180ms ease-in-out;
		&::placeholder {
			color: rgba(0, 0, 0, 1);
		}

		&:focus {
			border: 2px solid #333333;
		}
	}

	select {
		background-color: #fff;
		border: 2px solid #808080;
		border-radius: 3px;
		padding: 16px;
		font-size: 16px;
		transition: 180ms ease-in-out;
		&::placeholder {
			color: rgba(0, 0, 0, 1);
		}

		&:focus {
			border: 2px solid #333333;
		}
	}
`;
