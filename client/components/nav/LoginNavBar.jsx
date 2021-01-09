import React from 'react';
import { Link } from 'react-router-dom';

const LoginNavBar = () => (
	<nav>
		<Link to="/register" >
			Login
		</Link>
		<Link to="/about">
			About
		</Link>
	</nav>
);

export default LoginNavBar;
