import * as React from 'react';
import { useState } from 'react';
import { Carousel, Modal } from 'react-bootstrap';
import { serialize } from 'shared/dataClasses/FormClass';
import ResponseClass from 'shared/dataClasses/ResponseClass';
import qrcodegen from '3rd_party/qrcodegen';
import _ from 'lodash';
import { useSelector } from '../../../hooks';

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

function generatePath(modules: Array<Array<boolean>>, margin = 0): string {
	const ops: Array<string> = [];
	modules.forEach(function (row, y) {
		let start: number | null = null;
		row.forEach(function (cell, x) {
			if (!cell && start !== null) {
				// M0 0h7v1H0z injects the space with the move and drops the comma,
				// saving a char per operation
				ops.push(
					`M${start + margin} ${y + margin}h${x - start}v1H${start + margin}z`
				);
				start = null;
				return;
			}

			// end of row, clean up or skip
			if (x === row.length - 1) {
				if (!cell) {
					// We would have closed the op above already so this can only mean
					// 2+ light modules in a row.
					return;
				}
				if (start === null) {
					// Just a single dark module.
					ops.push(`M${x + margin},${y + margin} h1v1H${x + margin}z`);
				} else {
					// Otherwise finish the current line.
					ops.push(
						`M${start + margin},${y + margin} h${x + 1 - start}v1H${start + margin
						}z`
					);
				}
				return;
			}

			if (cell && start === null) {
				start = x;
			}
		});
	});
	return ops.join('');
}

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
	const submitQueue = useSelector(state => state.responses.submitQueue, _.isEqual);
	const forms = useSelector(state => state.forms.schemas.map);
	const size = useWindowSize();

	const createSVG = (submission: ResponseClass) => {
		const formId = submission.form.replace(/-/g, '');
		const serializedData = serialize(submission.data, forms[submission.form].sections);
		const segments = [qrcodegen.QrSegment.makeNumeric(BigInt('0x' + formId).toString()), qrcodegen.QrSegment.makeBytes(toUtf8ByteArray(';'+submission.scout+';')), qrcodegen.QrSegment.makeNumeric(serializedData.toString())];
		const qr = qrcodegen.QrCode.encodeSegments(segments, qrcodegen.QrCode.Ecc.LOW).getModules();
		return { qr: qr, submission: submission };
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
					<div style={{ marginBottom: Math.floor((size * 0.9) / 2) }} className='d-flex justify-content-center'>
						<svg
							height={Math.ceil(size * 0.9)}
							width={Math.ceil(size * 0.9)}
							viewBox={`0 0 ${qr.length + 0 * 2} ${qr.length + 0 * 2}`}
							shapeRendering='crispEdges'
						>
							<rect d={`M0,0 h${qr.length + 0 * 2}v${qr.length + 0 * 2}H0z`}  fill='white' />
							<path d={generatePath(qr)} fill='black' />
						</svg>
					</div>
					<Carousel.Caption>
						{submission.name}
					</Carousel.Caption>

				</Carousel.Item>
			))}</Carousel>
		</Modal.Body>
	</Modal>;
}
