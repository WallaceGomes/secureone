import React from 'react';

import { MainHeader } from './styles';

const Header = (props) => {
	return <MainHeader> {props.children} </MainHeader>;
};

export default Header;
