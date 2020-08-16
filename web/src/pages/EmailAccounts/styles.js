import styled from 'styled-components';

export const Container = styled.div`
	display: flex;
`;

export const Card = styled.div`
	width: 35%;
	margin-left: 12%;
	margin-top: 20px;
	height: 95vh;
	position: relative;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
	border-radius: 6px;
	overflow: hidden;
	background: white;

	h1 {
		margin-left: 2rem;
		margin-top: 1rem;
		margin-bottom: 1rem;
	}

	input,
	select {
		width: 90%;
		margin-left: 2rem;
		margin-right: 2rem;
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
		margin-left: 2rem;
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
	margin-left: 2rem;
	font-size: 20px;
`;

// export const Card = styled.div`
// 	width: 35%;
// 	margin-left: 12%;
// 	margin-top: 50px;
// 	height: 90vh;
// 	position: relative;
// 	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
// 	border-radius: 6px;
// 	padding: 1rem;
// 	overflow: hidden;
// 	background: white;

// 	h1 {
// 		margin: 2rem;
// 	}

// 	Select Input {
// 		width: 90%;
// 		margin-left: 2rem;
// 		margin-right: 2rem;
// 	}

// 	Button {
// 		width: 40%;
// 		height: 40px;
// 		margin-left: 2rem;
// 	}
// `;
