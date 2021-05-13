import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import ScrollPicker from '../scroll-picker';
import {
  HOURS, MINUTES, parse24hours, roundDate,
} from '../scroll-picker/utils';

const TimePicker = ({
  name,
  className,
  style,
  value,
  minValue,
  onChange,
  onConfirm,
  onCancel,
  // controls,
}) => {
  const rounded = roundDate(value);

  const [hours, setHours] = useState(rounded.roundedHours % 12 || 12);
  const [minutes, setMins] = useState(rounded.roundedMinutes);
  const [am, setAmPm] = useState(rounded.roundedHours < 12);

  const onHour = (e) => {
    setHours(e.value);
  };

  const onMinutes = (e) => {
    setMins(e.value);
  };

  const onAmPm = (e) => {
    setAmPm(e.value === 'AM');
  };

  const onConfirmTime = () => {
    const newHour = parse24hours(hours, am);
    const newValue = new Date(
      value.getFullYear(),
      value.getMonth(),
      value.getDate(),
      newHour,
      minutes,
      0,
    );
    onConfirm({
      name,
      value: newValue,
    });
  };

  useEffect(() => {
    const newHour = parse24hours(hours, am);
    const newValue = new Date(
      value.getFullYear(),
      value.getMonth(),
      value.getDate(),
      newHour,
      minutes,
      0,
    );
    if (minValue && minValue.getTime() > newValue.getTime()) {
      setTimeout(() => {
        setHours(rounded.roundedHours % 12 || 12);
        setMins(rounded.roundedMinutes);
        setAmPm(rounded.roundedHours < 12);
      }, 200);
    } else {
      onChange({
        name,
        value: newValue,
      });
    }
  }, [value, minValue, hours, minutes, am, rounded, name, onChange]);

  return (
    <div className="scrollpicker__main">
      <div className="scrollpicker__header">
        <div className="scrollpicker__title">Seleccionar Hora</div>
      </div>
      <div className={`scrollpicker__wrapper ${className}`} style={style}>
        <ScrollPicker name="hours" items={HOURS} value={hours} onChange={onHour} />
        <ScrollPicker name="minutes" items={MINUTES} value={minutes} onChange={onMinutes} />
        <ScrollPicker name="am" items={['AM', 'PM']} value={am ? 'AM' : 'PM'} onChange={onAmPm} />
      </div>
      <div className="scrollpicker__footer">
        <button
          type="button"
          className="scrollpicker__control control-cancel"
          onClick={onCancel}
        >
          Cancelar
        </button>
        <button
          type="button"
          className="scrollpicker__control control-confirm"
          onClick={onConfirmTime}
        >
          Aceptar
        </button>
      </div>
    </div>
  );
};

TimePicker.defaultProps = {
  className: '',
  name: '',
  style: {},
  value: new Date(),
  minValue: undefined,
  onChange: () => {},
  onConfirm: () => {},
  onCancel: () => {},
  // controls: false,
};

TimePicker.propTypes = {
  className: PropTypes.string,
  name: PropTypes.string,
  style: PropTypes.objectOf(PropTypes.any),
  value: PropTypes.instanceOf(Date),
  minValue: PropTypes.instanceOf(Date),
  onChange: PropTypes.func,
  onConfirm: PropTypes.func,
  onCancel: PropTypes.func,
  // controls: PropTypes.bool,
};

export default TimePicker;
