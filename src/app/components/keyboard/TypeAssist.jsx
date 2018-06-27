import React from 'react';
import PropTypes from 'prop-types';
import TypeAssistKey from './TypeAssistKey';

const keyboardKeys = {
  xsmall: [['`', '~'], ['1', '!'], ['2', '@'], ['3', '#'], ['4', '$'], ['5', '%'], ['6', '^'],
    ['7', '&'], ['8', '*'], ['9', '('], ['0', ')'], ['-', '_'], ['=', '+'], ['q', 'Q'], ['w', 'W'],
    ['e', 'E'], ['r', 'R'], ['t', 'T'], ['y', 'Y'], ['u', 'U'], ['i', 'I'], ['o', 'O'], ['p', 'P'],
    ['[', '{'], [']', '}'], ['\\', '|'], ['a', 'A'], ['s', 'S'], ['d', 'D'], ['f', 'F'], ['g', 'G'],
    ['h', 'H'], ['j', 'J'], ['k', 'K'], ['l', 'L'], [';', ':'], ['\'', '"'], ['z', 'Z'], ['x', 'X'],
    ['c', 'C'], ['v', 'V'], ['b', 'B'], ['n', 'N'], ['m', 'M'], [',', '<'], ['.', '>'], ['/', '?'],
  ],
  small: ['delete', 'tab'],
  medium: ['caps lock', 'enter'],
  large: [['shift-l', 'shift'], ['shift-r', 'shift']],
  xlarge: ['space'],
};

const keyboardShape = [
  ...Array(13).fill('xsmall'), 'small',
  'small', ...Array(13).fill('xsmall'),
  'medium', ...Array(11).fill('xsmall'), 'medium',
  'large', ...Array(10).fill('xsmall'), 'large',
  'xlarge',
];

const getHeatMapScore = (lowChar, shiftChar, errorHeatMap) => {
  let lowScore = 0;
  let shiftScore = 0;
  if (errorHeatMap.hasOwnProperty(lowChar)) {
    lowScore = errorHeatMap[lowChar];
  }
  if (errorHeatMap.hasOwnProperty(shiftChar)) {
    shiftScore = errorHeatMap[shiftChar];
  }
  return (lowChar === shiftChar) ? lowScore : lowScore + shiftScore;
};

const buildKeyboard = (activeChars, errorHeatMap) => {
  const buildProgress = {
    xsmall: 0,
    small: 0,
    medium: 0,
    large: 0,
    xlarge: 0,
  };
  const typeAssistKeyComponent = (index, lowChar, shiftChar, keySize) => {
    return (<TypeAssistKey
      key={`type-key-:${index}`}
      activeChars={activeChars}
      lowChar={lowChar}
      shiftChar={shiftChar}
      keySize={keySize}
      errorHeatMapScore={getHeatMapScore(lowChar, shiftChar, errorHeatMap)}
    />);
  };
  const makeKeyComponent = (keySize, currentKey, index) => {
    switch (keySize) {
      case 'xsmall':
        return typeAssistKeyComponent(index, currentKey[0], currentKey[1], keySize);
      case 'large':
        return typeAssistKeyComponent(index, currentKey[0], currentKey[1], keySize);
      default :
        return typeAssistKeyComponent(index, currentKey, currentKey, keySize);
    }
  };
  const keyMapper = (keySize, index) => {
    const keyIndex = buildProgress[keySize];
    const keysArray = keyboardKeys[keySize];
    const currentKey = keysArray[keyIndex];
    buildProgress[keySize] = keyIndex + 1;
    return makeKeyComponent(keySize, currentKey, index);
  };
  return keyboardShape.map(keyMapper);
};
const TypeAssist = ({ activeChars, errorHeatMap }) => (
  <div className="type-assist" >
    {buildKeyboard(activeChars, errorHeatMap)}
  </div>
);

TypeAssist.propTypes = {
  activeChars: PropTypes.array,
  errorHeatMap: PropTypes.object,
};
TypeAssist.defaultProps = {
  errorHeatMap: {},
};

export default TypeAssist;
