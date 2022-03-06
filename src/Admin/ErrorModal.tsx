import * as React from 'react';
import { Button, Modal } from 'react-bootstrap';

export function ErrorModal(props: {
	show: boolean;
	onClose: () => any;
	content: string;
}) {
	return <Modal centered show={props.show} onHide={() => props.onClose()}>
		<Modal.Header closeButton>
			<Modal.Title>
				Error!
			</Modal.Title>
		</Modal.Header>
		<Modal.Body>
			{props.content}
		</Modal.Body>
		<Modal.Footer>
			<Button onClick={() => props.onClose()} variant="danger">Close</Button>
		</Modal.Footer>
	</Modal>;
}
