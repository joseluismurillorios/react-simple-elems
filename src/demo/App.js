import React, { useState } from 'react';
// import { ModalPicker, TimePicker } from '../lib';
import {
  TimePicker,
  DayPicker,
  HourPicker,
  ModalPicker,
} from '../lib';

const App = () => {
  const [modal, setModal] = useState('');
  const [date, setDate] = useState(new Date());
  const onTimeChanged = (t) => {
    setDate(new Date(t.value));
    setModal('');
  };
  const onDateChanged = (d) => {
    console.log(d);
    setModal('');
  };
  return (
    <div className="app__fixed">
      <div>
        <h1>{date.toLocaleString()}</h1>
      </div>
      <TimePicker
        value={date}
        minValue={new Date()}
        onConfirm={(date) => setDate(new Date(date.value))}
      />
      <button onClick={() => setModal('time')}>Time</button>
      <button onClick={() => setModal('date')}>Date</button>
      <ModalPicker
        isVisible={modal === 'time'}
        toggleModal={() => setModal('')}
      >
        <TimePicker
          onCancel={() => setModal('')}
          onConfirm={onTimeChanged}
          value={date}
          minValue={new Date()}
          controls
        />
      </ModalPicker>
      <ModalPicker
        isVisible={modal === 'date'}
        onCancel={() => setModal('')}
      >
        <DayPicker
          controls
          onCancel={() => setModal('')}
          onConfirm={onDateChanged}
          live
        />
      </ModalPicker>
    </div>
  );
};

export default App;
