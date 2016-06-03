import { handleActions } from 'redux-actions';
import { Map } from 'immutable';

const savedAnimations = localStorage.getItem('animations');
let animations = Map();
if (savedAnimations) {
  try {
    animations = Map(JSON.parse(savedAnimations));
  } catch (e) {
    localStorage.removeItem('animations');
  }
}

export default handleActions({
  ADD_ANIMATION: (state, { payload }) => {
    const animations = state.animations.set(payload.id, payload);
    localStorage.setItem('animations', JSON.stringify(animations.toJSON()));
    return {
      animations,
      selectedAnimation: payload,
    };
  },
  SELECT_ANIMATION: (state, { payload }) => ({
    selectedAnimation: payload,
  }),
  UPDATE_ANIMATION: (state, { payload }) => {
    const animations = state.animations.set(payload.id, payload);
    localStorage.setItem('animations', JSON.stringify(animations.toJSON()));
    return {
      animations,
      selectedAnimation: (state.selectedAnimation && state.selectedAnimation.id === payload.id) ? payload : state.selectedAnimation,
    };
  },
  REMOVE_ANIMATION: (state, { payload }) => {
    if (!state.animations.has(payload)) {
      return {};
    }
    const animations = state.animations.remove(payload);
    localStorage.setItem('animations', JSON.stringify(animations.toJSON()));
    return {
      animations,
      selectedAnimation: (state.selectedAnimation && state.selectedAnimation.id === payload) ? undefined : state.selectedAnimation,
    };
  },
  RESET: () => {
    localStorage.removeItem('animations');
    return {
      animations: Map(),
      selectedAnimation: undefined,
    };
  },
}, {
  animations,
  selectedAnimation: undefined,
});
