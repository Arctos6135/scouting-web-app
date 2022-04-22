import * as React from 'react';
import { useEffect, useState } from 'react';
import { Button, ButtonGroup, FormControl } from 'react-bootstrap';
import { FormIDContext } from './formState';
import { Timer } from 'shared/dataClasses/Form/Timer';
import { useSelector, useDispatch } from 'app/hooks';
import { setFormData } from 'app/store/reducers/user';

export function TimerInput(props: {
	component: Timer;
}) {
	const formID = React.useContext(FormIDContext);
	const dispatch = useDispatch();
	const value = useSelector(state => state.user.forms.data[formID]?.[props.component.valueID]);
	useEffect(() => {
		if (value == undefined) {
			dispatch(setFormData({
				form: formID, 
				valueID: props.component.valueID, 
				value: 0
			}));
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
			dispatch(setFormData({
				form: formID, 
				valueID: props.component.valueID, 
				value: millis + endTime - startTime
			}));
			setStartTime(Date.now());
			setEndTime(Date.now());
			setEditableTime(((millis + endTime - startTime)/1000).toFixed(2));
		}
	};
	const restartTimer = () => {
		setMillis(0);
		dispatch(setFormData({
			form: formID, 
			valueID: props.component.valueID, 
			value: 0
		}));
		setEditableTime('0');
		setStartTime(Date.now());
		setEndTime(Date.now());
	};

	const onChange = (value: string) => {
		const newTime = Math.floor(Number.parseFloat(value) * 1000);
		setMillis(newTime);
		dispatch(setFormData({
			form: formID, 
			valueID: props.component.valueID, 
			value: newTime
		}));
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
