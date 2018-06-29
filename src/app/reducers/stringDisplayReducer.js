import { ActionTypes } from "../actions";

const testString = "";

function sourceStringToSourceMap(srcString) {
  return srcString.split("").map(char => ({
    char,
    touched: false,
    correct: null,
    edited: false,
    corrected: false,
    dateTouched: null
  }));
}

const initialState = {
  stringMap: sourceStringToSourceMap(testString),
  rollingStats: {
    wpm: 0,
    wpmMax: 0,
    wpmMin: 30,
    accuracy: 100,
    accuracyMin: 100,
    words: 0,
    correct: 0,
    touched: 0,
    corrected: 0
  },
  rollingErrors: {},
  snapshots: [],
  sessionHistories: [],
  currentPosition: 0,
  tabSpaces: 2,
  textType: "js",
  testStartDate: null,
  activeTest: false,
  shouldDisplayComplete: false,
  modalDisplayed: false,
  shouldTabulateHistories: false
};

function calibrateStatsMaxMins(state) {
  return Object.assign({}, state.rollingStats, {
    wpmMax: state.rollingStats.wpm,
    accuracyMin: state.rollingStats.accuracy
  });
}

function calculateRollingStats(
  startDate,
  correctChange,
  touchedChange,
  correctedChange,
  rollingStats
) {
  const newCorrect = Math.max(rollingStats.correct + correctChange, 0);
  const newWords = newCorrect / 5;
  const newTouched = Math.max(rollingStats.touched + touchedChange, 0);
  const newCorrected = rollingStats.corrected + correctedChange;
  const newAccuracy =
    newTouched > 0
      ? (Math.max(newCorrect - newCorrected, 0) * 100) / newTouched
      : 100;
  const now = new Date();
  const elapsedMins = (now - startDate) / (60 * 1000);
  const newWPM =
    newWords >= 2 ? Math.round(Math.min(newWords / elapsedMins, 200)) : 0;
  const newAccuracyMin =
    newAccuracy < rollingStats.accuracyMin
      ? newAccuracy
      : rollingStats.accuracyMin;
  const newWPMMax = newWPM > rollingStats.wpmMax ? newWPM : rollingStats.wpmMax;
  const newWPMMin = newWPM < rollingStats.wpmMin ? newWPM : rollingStats.wpmMin;
  return {
    wpm: newWPM,
    wpmMax: newWPMMax,
    wpmMin: newWPMMin,
    accuracy: newAccuracy,
    accuracyMin: newAccuracyMin,
    words: newWords,
    correct: newCorrect,
    touched: newTouched,
    corrected: newCorrected
  };
}

function calculateRollingErrors(char, change, rollingErrors) {
  const errorsChange = Object.assign({}, rollingErrors);
  if (errorsChange.hasOwnProperty(char)) {
    errorsChange[char] = errorsChange[char] + change;
  } else {
    errorsChange[char] = change;
  }
  return errorsChange;
}

function handleBackspace(state) {
  const currentPosition = state.currentPosition;
  const stringMap = state.stringMap;
  const startDate = state.testStartDate;
  const rollingStats = state.rollingStats;
  const rollingErrors = state.rollingErrors;
  const newPosition = Math.max(currentPosition - 1, 0);
  const newStringMap = stringMap.map((item, index) => {
    if (index === newPosition) {
      return {
        char: item.char,
        touched: false,
        correct: null,
        edited: item.correct === false,
        corrected: item.corrected,
        dateTouched: new Date()
      };
    }
    return item;
  });
  const changedChar = newStringMap[newPosition];
  const updatedRollingStats = calculateRollingStats(
    startDate,
    changedChar.edited === false ? -1 : 0,
    -1,
    0,
    rollingStats
  );
  const updateRollingErrors = calculateRollingErrors(
    changedChar.char,
    changedChar.correct === true ? 1 : 0,
    rollingErrors
  );
  return {
    stringMap: newStringMap,
    currentPosition: newPosition,
    rollingStats: updatedRollingStats,
    rollingErrors: updateRollingErrors
  };
}

function calculateTrailingSnapshot(stringMap, currentPosition) {
  //
  const lookBackLength = 15;
  if (currentPosition < lookBackLength) {
    return null;
  }
  const subStringMap = stringMap.slice(
    currentPosition - lookBackLength,
    currentPosition
  );
  const subStringReducer = (accumulator, currentItem) => ({
    correct: accumulator.correct + (currentItem.correct === true ? 1 : 0),
    touched: accumulator.touched + (currentItem.touched === true ? 1 : 0),
    corrected: accumulator.corrected + (currentItem.corrected === true ? 1 : 0)
  });
  const stats = subStringMap.reduce(subStringReducer, {
    correct: 0,
    touched: 0,
    corrected: 0
  });
  const subStartDate = subStringMap[0].dateTouched;
  const words = (stats.correct - stats.corrected) / 5;
  const elapsedTime = (new Date() - subStartDate) / (60 * 1000);
  const wpm = words / elapsedTime;
  const accuracy = ((stats.correct - stats.corrected) / stats.touched) * 100;
  return {
    wpm,
    accuracy,
    currentPosition
  };
}

function takeSnapshot(state) {
  const newTrailingSnapshot = calculateTrailingSnapshot(
    state.stringMap,
    state.currentPosition,
    state.rollingStats
  );
  if (newTrailingSnapshot === null) {
    return [...state.snapshots];
  }
  const snapshot = Object.assign({}, newTrailingSnapshot, { date: new Date() });
  return [...state.snapshots, snapshot];
}

function handleTypedCharacter(keyValue, state) {
  const currentPosition = state.currentPosition;
  const stringMap = state.stringMap;
  const startDate = state.testStartDate;
  const rollingStats = state.rollingStats;
  const rollingErrors = state.rollingErrors;
  const newStringMap = stringMap.map((item, index) => {
    if (index === currentPosition) {
      return {
        char: item.char,
        touched: true,
        correct: item.char === keyValue,
        edited: item.edited,
        corrected: item.edited === true && item.char === keyValue,
        dateTouched: new Date()
      };
    }
    return item;
  });
  const changedChar = newStringMap[currentPosition];
  const updatedRollingStats = calculateRollingStats(
    startDate,
    changedChar.correct === true ? 1 : 0,
    1,
    changedChar.corrected === true ? 1 : 0,
    rollingStats
  );
  const updateRollingErrors = calculateRollingErrors(
    changedChar.char,
    changedChar.correct === false ? 1 : 0,
    rollingErrors
  );
  const newState = {
    stringMap: newStringMap,
    currentPosition: Math.min(currentPosition + 1, newStringMap.length),
    rollingStats: updatedRollingStats,
    rollingErrors: updateRollingErrors
  };
  if (
    state.shouldTabulateHistories === true &&
    state.currentPosition % Math.max(Math.floor(stringMap.length / 50), 1) === 0
  ) {
    newState.snapshots = takeSnapshot(state);
  }
  return newState;
}

function handleEnterKey(state) {
  return handleTypedCharacter("\n", state);
}

function handleTabKey(state) {
  const tabSpaces = state.tabSpaces;
  const currentPosition = state.currentPosition;
  const stringMap = state.stringMap;
  let newState = {
    currentPosition,
    stringMap
  };
  for (let i = 0; i < tabSpaces; i++) {
    newState = handleTypedCharacter(" ", state);
  }
  return newState;
}

function reducer(state = initialState, action) {
  switch (action.type) {
    case ActionTypes.Keyboard.TabKey:
      return Object.assign({}, state, handleTabKey(state));
    case ActionTypes.Keyboard.BackspaceKey:
      return Object.assign({}, state, handleBackspace(state));
    case ActionTypes.Keyboard.ReturnKey:
      return Object.assign({}, state, handleEnterKey(state));
    case ActionTypes.Keyboard.TypedChar:
      return Object.assign(
        {},
        state,
        handleTypedCharacter(action.keyValue, state)
      );
    case ActionTypes.App.SwitchTextType:
      return Object.assign({}, state, { textType: action.textType });
    case ActionTypes.App.LoadNewText:
      return Object.assign({}, state, {
        stringMap: sourceStringToSourceMap(action.text),
        currentPosition: 0,
        testStartDate: null,
        activeTest: false,
        snapshots: [],
        rollingStats: initialState.rollingStats,
        rollingErrors: {},
        shouldDisplayComplete: false,
        modalDisplayed: false
      });
    case ActionTypes.App.StartTraining:
      return Object.assign({}, state, {
        testStartDate: action.startDate,
        activeTest: true
      });
    case ActionTypes.Stats.SnapshotTest:
      return Object.assign({}, state, { snapshots: takeSnapshot(state) });
    case ActionTypes.Stats.CalibrateMaxMin:
      return Object.assign({}, state, {
        rollingStats: calibrateStatsMaxMins(state)
      });
    case ActionTypes.App.ShowComplete:
      return Object.assign({}, state, {
        shouldDisplayComplete: true,
        modalDisplayed: true,
        activeTest: false
      });
    case ActionTypes.App.HideComplete:
      return Object.assign({}, state, {
        shouldDisplayComplete: false,
        modalDisplayed: false
      });
    case ActionTypes.Stats.AddToHistory:
      return Object.assign({}, state, {
        sessionHistories: [
          ...state.sessionHistories,
          {
            rollingStats: state.rollingStats,
            rollingErrors: state.rollingErrors
          }
        ]
      });
    default:
      return state;
  }
}

export default reducer;
