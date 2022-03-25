import * as React from 'react';
import { useState } from 'react';
import { Carousel, Modal } from 'react-bootstrap';
import QRCode from 'qrcode.react';
import { deserialize, serialize } from '../../shared/dataClasses/FormClass';
import { useRecoilValue } from 'recoil';
import * as conn from '../connection';
import ResponseClass from '../../shared/dataClasses/ResponseClass';
import Text from '../../shared/dataClasses/FormClass/Text';

const useWindowSize = () => {
	const [size, setSize] = useState(Math.min(window.innerWidth, window.innerHeight));
	React.useEffect(() => {
		function onResize() {
			setSize(Math.min(window.innerWidth, window.innerHeight));
		}
		window.addEventListener('resize', onResize);
		return () => window.removeEventListener('resize', onResize);
	}, []);
	return size;
};

export function QRCodeModal(props: {
	show: boolean;
	onClose: () => void;
}) {
	const submitQueue = useRecoilValue(conn.submitQueue);
	const forms = useRecoilValue(conn.forms);
	const size = useWindowSize();
	const scout = useRecoilValue(conn.scout);

	const createQRData = (submission: ResponseClass) => {
		const serializedData = serialize(submission.data, forms.find(form => form.id === submission.form).sections);
		const data = Text.serialize(submission.form, serializedData, {type:'text', valueID: 'form', charset: '0123456789abcdef-', maxlength: 32});
		return submission.form + ';' + submission.scout + ';' + data.toString();
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
					<div style={{ marginBottom: Math.floor((size * 0.9) / 2) }} className='d-flex justify-content-center'>
						<QRCode size={Math.ceil(size * 0.9)} renderAs='svg' value={createQRData(submission)} />
					</div>
					<Carousel.Caption>
						{submission.name}
					</Carousel.Caption>

				</Carousel.Item>
			))}</Carousel>
		</Modal.Body>
	</Modal>;
}