import * as React from 'react';
import { useEffect, useState } from 'react';
import { Button, ButtonGroup, FormControl } from 'react-bootstrap';
import { useRecoilState } from 'recoil';
import { FormIDContext, formData } from './formState';
import Timer from 'shared/dataClasses/FormClass/Timer';

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
	const [editableTime, setEditableTime] = useState((millis/1000).toFixed(2));
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
			setEditableTime(((millis + endTime - startTime)/1000).toFixed(2));
		}
	};
	const restartTimer = () => {
		setMillis(0);
		setValue(0);
		setEditableTime('0');
		setStartTime(Date.now());
		setEndTime(Date.now());
	};

	const onChange = (value: string) => {
		const newTime = Math.floor(Number.parseFloat(value) * 1000);
		setMillis(newTime);
		setValue(newTime);
		setEditableTime(value);
	};

	return (
		<div className="d-flex flex-column">
			{intervalRef === undefined ? <FormControl value={editableTime} onChange={(e) => onChange(e.target.value)} /> : <div className='text-center fs-5 fw-bold'>{((millis + endTime - startTime) / 1000).toFixed(2)} seconds</div>}
			<ButtonGroup>
				<Button variant='outline-secondary' onClick={startTimer}>
					Start
				</Button>
				<Button variant='outline-secondary' onClick={stopTimer}>
					Stop
				</Button>
				<Button variant='outline-secondary' onClick={restartTimer}>
					Restart
				</Button>
			</ButtonGroup>
		</div>
	);
}
