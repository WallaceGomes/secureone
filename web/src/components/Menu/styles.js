import styled from 'styled-components';

export const Wraper = styled.aside`
	background-color: #595959;
	height: 100vh;
	width: 16%;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
	position: fixed;
	margin-right: 2px;

	img {
		width: 80%;
		margin-left: 15px;
		margin-top: 15px;
	}
`;

export const MenuUl = styled.ul`
	margin-top: 20px;
	margin-left: 5px;
	margin-right: 5px;
	text-align: center;
	display: flex;
	flex-direction: column;
	position: relative;
`;

export const MenuItem = styled.button`
	background-color: #fff;
	height: 50px;
	width: 90%;
	border: solid 2px;
	border-radius: 3px;
	vertical-align: center;
	font-size: 18px;
	font-weight: bold;
	margin-bottom: 15px;
	:hover {
		cursor: pointer;
	}
`;

export const LogoutButtom = styled.button`
	background-color: #fff;
	height: 50px;
	width: 90%;
	border: solid 2px;
	border-radius: 3px;
	vertical-align: center;
	font-size: 18px;
	font-weight: bold;
	margin-bottom: 1.5rem;
	:hover {
		cursor: pointer;
	}
`;
