import React from 'react';
import PropTypes from 'prop-types';

const Day = ({
  className,
  today,
  day,
  month,
  year,
  selected,
  active,
  markedDates,
  onClick,
}) => {
  const currDay = `${day + 100}`.substring(1);
  const currMonth = `${month + 1 + 100}`.substring(1);
  const datestring = `${year}-${month}-${day}`;
  const formattedstring = `${year}-${currMonth}-${currDay}`;
  const now = today.formatted === datestring;
  const nowClass = now ? 'today' : '';
  const currentClass = selected ? 'selected' : '';
  const activeClass = active ? 'active' : '';
  const onTap = () => {
    onClick(year, month, day);
  };
  const marked = markedDates[formattedstring];
  return (
    <button
      type="button"
      className={`day__picker--calendar-day ${nowClass} ${currentClass} ${activeClass} ${className}`}
      onClick={onTap}
      data-key={datestring}
    >
      <span>{day}</span>
      <span className="day__picker--calendar-dots">
        {
          !!(marked) && (
            <span className={`day__picker--calendar-dot ${currentClass}`} />
          )
        }
      </span>
    </button>
  );
};

Day.defaultProps = {
  className: '',
  today: {},
  day: 1,
  month: 0,
  year: undefined,
  markedDates: {},
  onClick: () => {},
  selected: false,
  active: false,
};

Day.propTypes = {
  className: PropTypes.string,
  day: PropTypes.number,
  today: PropTypes.objectOf(PropTypes.any),
  year: PropTypes.number,
  month: PropTypes.number,
  markedDates: PropTypes.objectOf(PropTypes.any),
  onClick: PropTypes.func,
  selected: PropTypes.bool,
  active: PropTypes.bool,
};

export default Day;
