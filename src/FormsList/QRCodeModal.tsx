import * as React from 'react';
import { useState } from 'react';
import { Carousel, Modal } from 'react-bootstrap';
import QRCode from 'qrcode.react';
import { serialize } from '../../shared/dataClasses/FormClass';
import { useRecoilValue } from 'recoil';
import * as conn from '../connection';
import ResponseClass from '../../shared/dataClasses/ResponseClass';

const useWindowWidth = () => {
	const [width, setWidth] = useState(window.innerWidth);
	React.useEffect(() => {
		function onResize() {
			setWidth(window.innerWidth);
		}
		window.addEventListener('resize', onResize);
		return () => window.removeEventListener('resize', onResize);
	}, []);
	return width;
};

export function QRCodeModal(props: {
	show: boolean;
	onClose: () => void;
}) {
	const submitQueue = useRecoilValue(conn.submitQueue);
	const forms = useRecoilValue(conn.forms);
	const divRef = React.useRef<HTMLDivElement>(null);
	const width = useWindowWidth();

	const createQRData = (submission: ResponseClass) => {
		const response = serialize(submission.data, forms.find(form => form.id === submission.form).sections).toString();
		return submission.form + ';' + submission.scout + ';' + response;
	};

	return <Modal show={props.show} onHide={props.onClose}>
		<Modal.Header closeButton>
			<Modal.Title>
				Sync With QR
			</Modal.Title>
		</Modal.Header>
		<Modal.Body>
			<Carousel controls={false} interval={null} variant='dark'>{submitQueue.map((submission, i) => (
				<Carousel.Item key={submission.id}>
					<div style={{ marginBottom: Math.floor((width * 0.9) / 2) }} className='d-flex justify-content-center'>
						<QRCode size={Math.ceil(width * 0.9)} renderAs='svg' value={createQRData(submission)} />
					</div>
					<Carousel.Caption>
						{submission.name}
					</Carousel.Caption>

				</Carousel.Item>
			))}</Carousel>
		</Modal.Body>
	</Modal>;
}