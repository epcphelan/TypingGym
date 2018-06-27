import { combineReducers } from 'redux';
import stringDisplayReducer from './stringDisplayReducer';

const rootReducer = combineReducers({
  state: (state = {}) => state,
  stringDisplay: stringDisplayReducer,
});

export default rootReducer;
