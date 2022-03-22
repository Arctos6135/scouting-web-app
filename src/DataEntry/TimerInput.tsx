import * as React from 'react';
import { useEffect, useState } from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';
import { useRecoilState } from 'recoil';
import { FormIDContext, formData } from './formState';
import Timer from '../../shared/dataClasses/FormClass/Timer';

export function TimerInput(props: {
	component: Timer;
}) {
	const formID = React.useContext(FormIDContext);
	const [value, setValue] = useRecoilState(formData(formID + '/' + props.component.valueID));
	useEffect(() => {
		if (value == undefined) {
			setValue(0);
		}
	});
	const [millis, setMillis] = useState(typeof value === 'number' ? value : 0);
	const [startTime, setStartTime] = useState(Date.now());
	const [endTime, setEndTime] = useState(Date.now());
	const [intervalRef, setIntervalRef] = useState<undefined | NodeJS.Timer>(undefined);
	const startTimer = () => {
		setStartTime(Date.now());
		setEndTime(Date.now());
		if (!intervalRef) {
			setIntervalRef(setInterval(() => {
				setEndTime(Date.now());
			}, 100));
		}
	};
	const stopTimer = () => {
		if (intervalRef) {
			clearInterval(intervalRef);
			setIntervalRef(undefined);
			setMillis(millis + endTime - startTime);
			setValue(millis + endTime - startTime);
			setStartTime(Date.now());
			setEndTime(Date.now());
		}
	};
	const restartTimer = () => {
		setMillis(0);
		setValue(0);
		setStartTime(Date.now());
		setEndTime(Date.now());
	};
	return (
		<div className="d-flex flex-column">
			<div className='text-center fs-5 fw-bold'>{((millis + endTime - startTime) / 1000).toFixed(2)} seconds</div>
			<ButtonGroup>
				<Button onClick={startTimer}>
					Start
				</Button>
				<Button onClick={stopTimer}>
					Stop
				</Button>
				<Button onClick={restartTimer}>
					Restart
				</Button>
			</ButtonGroup>
		</div>
	);
}
