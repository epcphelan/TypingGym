import axios from "axios";

const ActionTypes = {
  Keyboard: {
    TabKey: "TAB_KEY_PRESSED",
    BackspaceKey: "BACKSPACE_PRESSED",
    ReturnKey: "RETURN_KEY_PRESSED",
    TypedChar: "TYPED_CHAR_PRESSED"
  },
  App: {
    ShowComplete: "SHOW_COMPLETED_MODAL",
    HideComplete: "HIDE_COMPLETED_MODAL",
    LoadNewText: "LOAD_NEW_TEXT",
    SwitchTextType: "SWITCH_TEXT_TYPE",
    StartTraining: "START_TRAINING_TIME",
    StopTraining: "STOP_TRAINING_TIME",
    Loading: {
      NewText: {
        Update: "LOADING_NEW_TEXT_UPDATE"
      }
    }
  },
  Stats: {
    SnapshotTest: "TAKE_TEST_SNAPSHOT",
    CalibrateMaxMin: "CALIBRATE_STATS_MAX_MIN",
    AddToHistory: "ADD_TO_HISTORY"
  }
};

function startRecordingSession(startDate) {
  return {
    type: ActionTypes.App.StartTraining,
    startDate
  };
}

function stopRecordingSession() {
  return {
    type: ActionTypes.App.StopTraining
  };
}

function charKeyPressed(keyValue) {
  return {
    type: ActionTypes.Keyboard.TypedChar,
    keyValue
  };
}

function enterKeyPressed() {
  return {
    type: ActionTypes.Keyboard.ReturnKey
  };
}

function backspacePressed() {
  return {
    type: ActionTypes.Keyboard.BackspaceKey
  };
}

function tabPressed() {
  return {
    type: ActionTypes.Keyboard.TabKey
  };
}

function updateTextLoadingStatus(isLoading, success) {
  return {
    type: ActionTypes.App.Loading.NewText.Update,
    isLoading,
    success
  };
}

function addNewTextToApp(text) {
  return {
    type: ActionTypes.App.LoadNewText,
    text
  };
}

function changeTextType(textType) {
  return {
    type: ActionTypes.App.SwitchTextType,
    textType
  };
}

async function getDynamicUrlForSrc(txtType){
  const listing = `./static/texts/${txtType}/listing.json`;
  const res = await axios.get(listing);
  const content = res.data;
  const randIndex = Math.round(Math.random() * (content.length - 1));
  return `./static/texts/${txtType}/${content[randIndex]}`;
}
function showComplete() {
  return {
    type: ActionTypes.App.ShowComplete
  };
}

function hideComplete() {
  return {
    type: ActionTypes.App.HideComplete
  };
}

function addToHistory() {
  return {
    type: ActionTypes.Stats.AddToHistory
  };
}

function loadNewText() {
  return (dispatch, getState) => {
    dispatch(updateTextLoadingStatus(true, null));
    const txtType = getState().stringDisplay.textType;
    getDynamicUrlForSrc(txtType)
      .then(url=>{
        axios
          .get(url)
          .then(response => {
            dispatch(updateTextLoadingStatus(false, true));
            dispatch(addNewTextToApp(response.data));
          })
          .catch(err => {
            dispatch(updateTextLoadingStatus(false, false));
          });
      })
      .catch(err =>{
        dispatch(updateTextLoadingStatus(false, false));
      })
  };
}

function snapshotActiveTest() {
  return {
    type: ActionTypes.Stats.SnapshotTest
  };
}

function calibrateStatsMaxMins() {
  return {
    type: ActionTypes.Stats.CalibrateMaxMin
  };
}

export {
  snapshotActiveTest,
  startRecordingSession,
  calibrateStatsMaxMins,
  stopRecordingSession,
  addToHistory,
  showComplete,
  hideComplete,
  changeTextType,
  loadNewText,
  charKeyPressed,
  enterKeyPressed,
  backspacePressed,
  tabPressed,
  ActionTypes
};
