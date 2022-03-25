import * as React from 'react';
import { Button, Card, Col, Alert, FormSelect, Row } from 'react-bootstrap';
import { BrowserQRCodeReader, BrowserCodeReader } from '@zxing/browser';
import { deserialize } from '../../shared/dataClasses/FormClass';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import * as conn from '../connection';
import ResponseClass from '../../shared/dataClasses/ResponseClass';
import Text from '../../shared/dataClasses/FormClass/Text';


export default function QRReader() {
	const [reader, setReader] = React.useState(new BrowserQRCodeReader());
	const [inputs, setInputs] = React.useState<MediaDeviceInfo[]>(undefined);
	const [deviceId, setDeviceId] = React.useState<string>(undefined);
	const videoRef = React.useRef<HTMLVideoElement>(null);
	const forms = useRecoilValue(conn.forms);
	const setSubmitQueue = useSetRecoilState(conn.submitQueue);
	const scout = useRecoilValue(conn.scout);
	const [scanning, setScanning] = React.useState(false);
	const [scanned, setScanned] = React.useState(false);
	const [invalidQR, setInvalidQR] = React.useState(false);

	React.useEffect(() => {
		BrowserQRCodeReader.listVideoInputDevices().then((value) => setInputs(value));
	}, []);

	React.useEffect(() => {
		if (scanning) {
			const controls = reader.decodeFromVideoDevice(deviceId, videoRef.current, (result, error, controls) => {
				if (result && scanning) {
					try {
						const text = result.getText();
						const [formId, scoutId, serializedResponse] = text.split(';');
						const data = deserialize(BigInt(serializedResponse), forms.find((form) => form.id === formId).sections);
						const response: ResponseClass = {
							data: data,
							form: formId,
							id: crypto.randomUUID(),
							name: '',
							org: scout.org,
							scout: scoutId
						};
						setSubmitQueue((submitQueue) => [...submitQueue, response]);
						setScanning(false);
						controls.stop();
						setScanned(true);
						setTimeout(() => setScanned(false), 5000);
					} catch {
						setInvalidQR(true);
						setTimeout(() => setInvalidQR(false), 5000);
					}
				}


			});
			return () => {
				controls.then(controls => controls.stop());
			};
		}
	}, [deviceId, scanning]);
	return <Card>
		<Card.Body>
			<div className='d-flex flex-column'>
				<div>
					<video ref={videoRef} />
				</div>
				<div className='d-flex justify-content-start'>
					<Row>
						<Col><Button onClick={() => setScanning(!scanning)}>{scanning ? 'Stop Scanning' : 'Scan QR'}</Button></Col>
						<Col><FormSelect title='Camera' onChange={(e) => setDeviceId(e.target.value)}>{inputs?.map((input) => <option key={input.deviceId} value={input.deviceId}>{input.label}</option>)}</FormSelect></Col>
					</Row>
				</div>
			</div>
		</Card.Body>
		<Alert variant='success' show={scanned}>Submission Added</Alert>
		<Alert variant='warning' show={invalidQR}>Invalid QR try again</Alert>
	</Card>;
}