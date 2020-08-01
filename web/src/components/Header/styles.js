import styled from 'styled-components';

export const MainHeader = styled.header`
	width: 100%;
	height: 4rem;
	display: flex;
	justify-content: space-between;
	align-items: center;
	position: absolute;
	top: 0;
	left: 0;
	background: rgba(0, 0, 0, 0.3);
	box-shadow: 0 2px 6px rgba(0, 0, 0, 0.26);
	padding-right: 10rem;
	padding-left: 9rem;

	@media (max-width: 800px) {
		padding-right: 5rem;
		padding-left: 4rem;
	}
`;
