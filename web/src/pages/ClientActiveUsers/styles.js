import styled from 'styled-components';

export const Container = styled.div`
	display: flex;
`;

export const AuxCard = styled.div`
	background-color: transparent;
	width: 75%;
	height: 80vh;
	margin: 0 auto;
	margin-top: 90px;
	margin-left: 20%;

	h1 {
		margin: 20px;
		margin-left: 30px;
	}
`;

export const StyledCard = styled.div`
	position: relative;
	margin: 15px;
	width: 350px;
	height: 150px;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
	border-radius: 6px;
	padding: 1rem;
	overflow: hidden;
	background: #fff;
	display: flex;
	flex-direction: column;
	transition: ease all 0.5s;
	border: 1px solid #000;
`;

export const DataTable = styled.table`
	width: 100%;
	td,
	th {
		text-align: left;
		padding-left: 10px;
		border: 2px solid #000000;
	}
	tr:nth-child(even) {
		background-color: #cccccc;
	}
	th {
		font-size: 22px;
	}
	td {
		font-size: 16px;
	}

	svg {
		&:hover {
			cursor: pointer;
		}
	}
`;
