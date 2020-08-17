import styled from 'styled-components';

export const Container = styled.section`
	width: 90vh;
	max-width: 100%;
	height: 700px;
	margin: 15px;
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	transition: ease all 0.6s;

	@media (max-width: 1550px) {
		grid-template-columns: repeat(2, 1fr);
		height: 1000px;
	}

	@media (max-width: 1050px) {
		grid-template-columns: repeat(1, 1fr);
		height: 1400px;
	}
`;
