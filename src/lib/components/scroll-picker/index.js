import React, { useCallback, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Tweenable } from 'shifty';

import Draggable from '../draggable';
import { clamp, isMobile } from './utils';
import './style.scss';

const ScrollPicker = ({
  id = (new Date()).getTime().toString(16),
  name,
  height,
  items,
  value,
  itemsToShow,
  onChange,
}) => {
  const tweenRef = useRef(new Tweenable()).current;
  const pickerRef = useRef(null);
  const bodyRef = useRef(null);
  const movingRef = useRef(false);
  const mountedRef = useRef(false);
  const unmountingRef = useRef(false);
  const indexRef = useRef(items.indexOf(value));
  const topRef = useRef(indexRef.current * height * -1);

  const { length } = items;

  const tween = useCallback((from, to) => {
    if (from === to) {
      mountedRef.current = true;
      return;
    }
    if (tweenRef.isPlaying()) {
      tweenRef.pause();
      tweenRef.stop();
    }
    tweenRef.setConfig({
      from: { x: parseFloat(from) },
      to: { x: parseFloat(to) },
      duration: 150,
      easing: 'easeOutQuad',
      step: (state) => {
        if (unmountingRef.current) {
          return;
        }
        const top = state.x * height * -1;
        bodyRef.current.style.top = `${top}px`;
        topRef.current = top;
      },
    });
    tweenRef.tween()
      .then(() => {
        indexRef.current = to;
        movingRef.current = false;
        if (mountedRef.current) {
          onChange({
            name,
            value: items[to],
          });
        } else {
          mountedRef.current = true;
        }
      });
  }, [height, tweenRef, items, onChange, name]);

  const move = ({ touchMoveY }) => {
    if (tweenRef.isPlaying()) {
      return;
    }
    movingRef.current = true;
    const currentTop = (indexRef.current * height * -1);
    topRef.current = currentTop + touchMoveY;
    bodyRef.current.style.top = `${topRef.current}px`;
  };

  const release = ({ touchMoveY }, e) => {
    const currentIndex = (topRef.current / height) * -1;
    const index = e.target.getAttribute('data-index');
    const moved = touchMoveY && Math.abs(touchMoveY) > 10;
    if (moved) {
      const rounded = Math.round(currentIndex);
      tween(currentIndex, clamp(rounded, 0, length - 1));
    } else if (index !== undefined) {
      tween(currentIndex, index);
    }
  };

  const initialAnimation = useRef(() => { tween(0, indexRef.current); });

  const onContext = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    return false;
  };

  useEffect(() => {
    initialAnimation.current();
    const curRef = pickerRef.current;
    curRef.addEventListener('contextmenu', onContext);
    return () => {
      unmountingRef.current = true;
      curRef.removeEventListener('contextmenu', onContext);
    };
  }, []);

  useEffect(() => {
    if (items[indexRef.current] !== value) {
      const currIndex = indexRef.current;
      indexRef.current = items.indexOf(value);
      topRef.current = indexRef.current * height * -1;
      tween(currIndex, indexRef.current);
    }
  }, [value, height, items, tween]);

  const toShow = itemsToShow > 1 ? itemsToShow : 1;
  const overlayHeight = (toShow - 1) / 2;

  return (
    <div
      ref={pickerRef}
      className={`scrollpicker ${isMobile ? 'scrollpicker__mobile' : 'scrollpicker__full'}`}
      style={{ height: height * toShow }}
    >
      <Draggable
        className="scrollpicker__container"
        style={{ height }}
        onPan={move}
        onPanEnd={release}
      >
        <div
          className="scrollpicker__body"
          style={{
            height: height * items.length,
          }}
          ref={bodyRef}
        >
          {
            items.map((item, i) => (
              <div
                key={`${id}-${item}`}
                data-key={`${id}-${item}`}
                className="scrollpicker__pick"
                style={{ height }}
                data-index={i}
              >
                {item}
              </div>
            ))
          }
        </div>
      </Draggable>
      <div className="scrollpicker__overlay overlay-top" style={{ height: overlayHeight * height }} />
      <div className="scrollpicker__overlay overlay-bottom" style={{ height: overlayHeight * height }} />
    </div>
  );
};

ScrollPicker.defaultProps = {
  id: undefined,
  name: '',
  height: 60,
  itemsToShow: 5,
  value: 'Yes',
  items: ['Yes', 'No'],
  onChange: () => {},
};

ScrollPicker.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  height: PropTypes.number,
  itemsToShow: PropTypes.number,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  items: PropTypes.arrayOf(PropTypes.any),
  onChange: PropTypes.func,
};

export default ScrollPicker;
