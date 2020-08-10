import styled from 'styled-components';

export const Container = styled.div`
	display: flex;
`;

export const Card = styled.div`
	width: 35%;
	margin-left: 12%;
	margin-top: 50px;
	height: 80vh;
	position: relative;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
	border-radius: 6px;
	padding: 1rem;
	overflow: hidden;
	background: white;

	h1 {
		margin: 2rem;
	}

	Input {
		width: 90%;
		margin-left: 2rem;
		margin-right: 2rem;
	}

	Button {
		width: 40%;
		height: 40px;
		margin-left: 2rem;
	}
`;
