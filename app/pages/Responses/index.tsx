import * as React from 'react';
import {Container} from 'react-bootstrap';
import FormsList from './FormsList';
import QRReader from './QRReader';

export default function App() {
	return (<div>
		<Container><FormsList /><br/><QRReader /></Container>
	</div>
	);
}
