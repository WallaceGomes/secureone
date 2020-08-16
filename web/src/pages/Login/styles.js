import styled from 'styled-components';

export const Container = styled.div`
	display: flex; /* Para todos os childs fica com flex */
	align-items: center; /*vertical*/
	justify-content: center; /*horizontal*/
	min-height: 80vh; /*Para alinhar verticalmente tbm*/
	margin: 0;
`;

export const Card = styled.div`
	height: 600px;
	width: 350px;
	position: relative;
	margin-top: 50px;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
	border-radius: 6px;
	overflow: hidden;
	background: white;

	img {
		height: 90px;
		margin-left: 6rem;
		margin-bottom: 10px;
		margin-top: 10px;
	}

	h1 {
		text-align: center;
		margin: 0 0 20px;
	}

	input,
	select {
		width: 90%;
		margin-left: 1rem;
		margin-top: 5px;
		background-color: #fff;
		border: 2px solid #808080;
		border-radius: 3px;
		padding: 8px;
		font-size: 16px;
		transition: 180ms ease-in-out;

		&:focus {
			border: 2px solid #333333;
		}
	}

	Button {
		width: 40%;
		height: 40px;
		font-size: 18px;
		margin-top: 2rem;
		margin-left: 6rem;
	}
`;

export const Error = styled.div`
	color: red;
	margin-left: 2rem;
	font-weight: bold;
	margin-top: 5px;
	margin-bottom: 15px;
`;

export const Label = styled.label`
	font-weight: bold;
	margin-left: 1rem;
	font-size: 20px;
`;
