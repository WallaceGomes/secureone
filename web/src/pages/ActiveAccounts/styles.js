import styled from 'styled-components';

export const Container = styled.div`
	display: flex;
`;

export const AuxCard = styled.div`
	background-color: blue;
	width: 110vh;
	height: 80vh;
	margin: 0 auto;
	margin-top: 90px;
	margin-left: 22%;

	h1 {
		margin: 20px;
	}
`;

export const StyledCard = styled.div`
	position: relative;
	margin: 15px;
	width: 400px;
	height: 100px;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
	border-radius: 6px;
	padding: 1rem;
	overflow: hidden;
	background: #fff;
	display: flex;
	flex-direction: column;
	transition: ease all 0.5s;
`;
