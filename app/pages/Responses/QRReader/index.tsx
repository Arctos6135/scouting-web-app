import * as React from 'react';
import { Button, Card, Col, Alert, FormSelect, Row } from 'react-bootstrap';
import { BrowserQRCodeReader } from '@zxing/browser';
import { deserialize } from 'shared/dataClasses/FormClass';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import * as conn from 'app/connection';
import ResponseClass from 'shared/dataClasses/ResponseClass';
import uniqueID from 'shared/uniqueId';

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
						const [formIdBigInt, scoutId, serializedResponse] = text.split(';');
						const formId = BigInt(formIdBigInt).toString(16);
						const form = forms.find((form) => form.id.replace(/-/g, '') === formId);
						const data = deserialize(BigInt(serializedResponse), form.sections);
						const response: ResponseClass = {
							data: data,
							form: form.id,
							id: uniqueID(),
							name: '',
							org: scout.org,
							scout: scoutId
						};
						setSubmitQueue((submitQueue) => [...submitQueue, response]);
						setScanning(false);
						controls.stop();
						setScanned(true);
						setTimeout(() => setScanned(false), 5000);
					} catch (err) {
						console.log(err);
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
