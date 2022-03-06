import * as React from 'react';
import { Button, Modal } from 'react-bootstrap';

// "Are you sure you want to delete" modal
// Input to onClose is a boolean for whether the delete was cancelled
export function DeleteModal(props: {
	onClose: (result: boolean) => any;
	show: boolean;
	bodyText: string;
}) {
	return <Modal centered show={props.show} onHide={props.onClose.bind(false)}>
		<Modal.Header closeButton>
			<Modal.Title>
				Are you sure you want to delete this scout?
			</Modal.Title>
		</Modal.Header>
		<Modal.Body>
			{props.bodyText}
		</Modal.Body>
		<Modal.Footer>
			<Button onClick={props.onClose.bind(true)} variant="danger">Yes</Button>
		</Modal.Footer>
	</Modal>;
}
