import styled from 'styled-components';

export const Container = styled.div`
	display: flex;
`;

export const UsersContainer = styled.div`
	background-color: gray;
	width: 76%;
	margin-left: 3%;
	margin-right: 3%;
	margin-top: 10px;
	margin-bottom: 20px;
`;

export const Header = styled.div`
	background-color: gray;
	width: 76%;
	height: 60px;
	padding-top: 10px;
	padding-left: 40px;
	font-size: 20px;
	font-weight: bold;
`;

export const ClientsTable = styled.table`
	width: 100%;
	td,
	th {
		text-align: left;
		padding-left: 10px;
		border: 1px solid #dddddd;
	}
	tr:nth-child(even) {
		background-color: #dddddd;
	}
	th {
		font-size: 22px;
	}
	td {
		font-size: 18px;
	}

	svg {
		&:hover {
			cursor: pointer;
		}
	}
`;
