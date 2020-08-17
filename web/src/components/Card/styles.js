import styled from 'styled-components';

export const StyledCard = styled.div`
	position: relative;
	margin: 30px;
	height: 270px;
	width: 170px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
  border-radius: 6px;
  padding: 1rem;
  overflow: hidden;
	background: #fff;
	display: flex;
	flex-direction: column;
	transition: ease all .5s;

	@media(min-width: 1310px){
		width: 200px;
}
`;

