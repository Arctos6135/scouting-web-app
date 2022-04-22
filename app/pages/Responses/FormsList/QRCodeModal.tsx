import * as React from 'react';
import { useState } from 'react';
import { Button, Carousel, Modal } from 'react-bootstrap';
import { serialize } from 'shared/dataClasses/Form';
import { Response } from 'shared/dataClasses/Response';
import qrcodegen from '3rd_party/qrcodegen';
import _ from 'lodash';
import { useSelector, useDispatch } from 'app/hooks';
import { deleteFromSubmitQueue } from 'app/store/reducers/user';
import generatePath from 'shared/generatePath';

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

function toUtf8ByteArray(str: string): Array<number> {
	str = encodeURI(str);
	const result: Array<number> = [];
	for (let i = 0; i < str.length; i++) {
		if (str.charAt(i) != '%')
			result.push(str.charCodeAt(i));
		else {
			result.push(parseInt(str.substring(i + 1, 2), 16));
			i += 2;
		}
	}
	return result;
}

export function QRCodeModal(props: {
	show: boolean;
	onClose: () => void;
}) {
	const submitQueue = useSelector(state => state.user.responses.submitQueue, _.isEqual);

	const forms = useSelector(state => state.user.forms.schemas.map);
	const size = useWindowSize();
	const dispatch = useDispatch();


	const createSVG = (submission: Response) => {
		try {
			const formId = submission.form.replace(/-/g, '');
			const serializedData = serialize(submission.data, forms[submission.form].sections);
			const segments = [
				qrcodegen.QrSegment.makeNumeric(BigInt('0x' + submission.id).toString()),
				qrcodegen.QrSegment.makeBytes(toUtf8ByteArray(';' + submission.name + ';')),
				qrcodegen.QrSegment.makeNumeric(BigInt('0x' + formId).toString()),
				qrcodegen.QrSegment.makeBytes(toUtf8ByteArray(';' + submission.scout + ';')),
				qrcodegen.QrSegment.makeNumeric(serializedData.toString())];
			const qr = qrcodegen.QrCode.encodeSegments(segments, qrcodegen.QrCode.Ecc.LOW).getModules();
			return { qr: qr, submission: submission };
		} catch (err) {
			console.error(err);
			return { qr: [], submission: submission };
		}
	};

	const deleteSubmission = (id: string) => {
		dispatch(deleteFromSubmitQueue(id));
	};

	return <Modal show={props.show} onHide={props.onClose}>
		<Modal.Header closeButton>
			<Modal.Title>
				Sync With QR
			</Modal.Title>
		</Modal.Header>
		<Modal.Body>
			<Carousel controls={false} interval={null} variant='dark'>{submitQueue.map((submission) => createSVG(submission)).map(({ qr, submission }) => (
				<Carousel.Item key={submission.id}>
					<div style={{ marginBottom: 64 }} className='d-flex flex-column align-items-center'>
						<svg
							height={Math.min(Math.ceil(size * 0.8), 400)}
							width={Math.min(Math.ceil(size * 0.8), 400)}
							viewBox={`0 0 ${qr.length + 0 * 2} ${qr.length + 0 * 2}`}
							shapeRendering='crispEdges'
						>
							<rect d={`M0,0 h${qr.length + 0 * 2}v${qr.length + 0 * 2}H0z`} fill='white' />
							<path d={generatePath(qr)} fill='black' />
						</svg>
						<Button className='my-3' variant='outline-secondary' onClick={() => deleteSubmission(submission.id)}>Delete</Button>
					</div>
					<Carousel.Caption>
						{submission.name}
					</Carousel.Caption>

				</Carousel.Item>
			))}</Carousel>
		</Modal.Body>
	</Modal>;
}
