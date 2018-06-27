import React from 'react';
import PropTypes from 'prop-types';
import Finger from './Finger';

const Fingers = ({ activeChars }) => {
  const fingerCharRegx = {
    l1: /^(shift-l|tab|[`~!1QqAaZz])$/,
    l2: /^[@2WwSsXx]$/,
    l3: /^[#3EeDdCc]$/,
    l4: /^[$4RrFfVv%5TtGgBb]$/,
    l5: /^(space)$/,
    r5: /^(space)$/,
    r4: /^[&7UuJjMm^6YyHhNn]$/,
    r3: /^[*8IiKk<,]$/,
    r2: /^[(9OoLl>.]$/,
    r1: /^(delete|enter|shift-r|[+=}\]|\\"'{\[)0Pp:;?\/])$/,
  };
  const getActiveFinger = (activeChar) => {
    const fingers = Object.keys(fingerCharRegx);
    for (const finger of fingers) {
      if (fingerCharRegx.hasOwnProperty(finger)) {
        if (fingerCharRegx[finger].test(activeChar)) {
          return fingers.indexOf(finger);
        }
      }
    }
    return null;
  };
  const getActiveFingers = (activeCharsArray) =>
    activeCharsArray.map(getActiveFinger);
  const renderFingers = (activeFingers) => {
    const ten = [0,1,2,3,4,5,6,7,8,9];
    return ten.map((item) => (
      <Finger
        key={item}
        index={item}
        isActive={activeFingers.indexOf(item) > -1}
      />
    ));
  };
  return (
    <div className="typing-fingers">
      {renderFingers(getActiveFingers(activeChars))}
    </div>
  );
};

Fingers.propTypes = {
  activeChars: PropTypes.array.isRequired,
};
Fingers.defaultProps = {};

export default Fingers;
