import React, { useRef, useState } from 'react'
import PropTypes from 'prop-types'

import './style.scss';
import { replaceMentionValues } from './utils';

const DELIMITER = Math.random().toString();
const MENTION_REGEX = /(@\[[a-zA-Z0-9À-ú]+\]\([a-zA-Z0-9]+\))/;
const GLOBAL_MENTION = new RegExp(MENTION_REGEX, 'gi')

const CommentInput = props => {
  const displayRef = useRef(null);
  const [size, setSize] = useState({});
  const [value, setValue] = useState('');
  const [valueReal, setValueReal] = useState('we @[José](mSYBlmC8hRTT3xwZLfsLonBkqy33) we se rompio eso, @[Test](aSYBlmC8hRTT3xwZLfsLonBkqy33) we se rompio eso');
  const onRealChange = (e) => {
    setValueReal(e.target.value);
    setValue(e.target.value);
  };
  const replaced = valueReal.replace(GLOBAL_MENTION, `${DELIMITER}$1${DELIMITER}`);
  const splited = replaced.split(DELIMITER);
  useState(() => {
    console.log(displayRef.current);
    if (size.width) {
      const rect = displayRef.current.getBoundingClientRect();
      console.log(rect);
    }
  }, [valueReal, size]);
  console.log(valueReal);
  const parsed = splited.map((s) => {
    return ({
      tag: !!s.match(MENTION_REGEX),
      value: replaceMentionValues(s, ({ name }) => `@${name}`),
    });
  });
  const parsedValue = parsed.map((s) => s.value).join('')
  console.log(splited);
  console.log(parsed);
  console.log(parsedValue);
  return (
    <div className="commentinput">
      <div
        className="commentinput__display"
        ref={(el) => {
           if (!el || size.width) return;
           displayRef.current = el;
           const rect = el.getBoundingClientRect();
           setSize({
            width: rect.width + 100,
            height: rect.height + 20,
           });
        }}
      >
        {parsed.map((s) => (
          s.tag ? (
            <span
              className="commentinput__tag"
              tabIndex={-1}
              role="button"
              onClick={() => {
                console.log(s);
              }}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  console.log(s);
                }
              }}
            >
              {s.value.trim()}&nbsp;
            </span>
          ) : (
            <span>{s.value.trim()}&nbsp;</span>
          )
        ))}
      </div>
      <textarea
        className="commentinput__value"
        style={{ ...size }}
        name="value"
        value={parsedValue}
        onChange={onRealChange}
        onSelect={(e) => {
          console.log(e.target.selectionStart)
          console.log(e.target.selectionEnd)
        }}
      />
    </div>
  )
}

CommentInput.propTypes = {

}

export default CommentInput
