// @flow
import { handleActions } from 'redux-actions';
import { Map, List } from 'immutable';

export type Animation = {
  id: string,
  delay?: number,
  repeat?: number,
  direction?: 0 | 1,
  name: string,
  speed?: number,
  text: string,
  creationDate: number,
  type: 'text' | 'pixel',
  animation: {
    length: number,
    currentFrame: number,
    frames: number,
    data: List<number>,
  },
  modifiedAt?: number,
};

export type State = {
  uid: string,
  animations: Map<string, Animation>,
  gallery: Map<string, Animation>,
};


const initialAnimations = Object.keys(localStorage).reduce((animations, key) => {
  if (!key.startsWith('animation:')) {
    return animations;
  }
  try {
    const tmp = JSON.parse(localStorage[key]);
    tmp.animation.data = List(tmp.animation.data);
    return animations.set(key.slice(10, key.length), tmp)
  } catch (e) {
    return animations;
  }
}, Map());
 
const initialState: State = {
  uid: '',
  animations: initialAnimations,
  gallery: Map(),
  adminGallery: Map()
};

export default handleActions(
  {
    // Local Library
    ADD_ANIMATION: (state: State, { payload }) => {
      const animations = state.animations.set(payload.id, payload);

      return {
        ...state,
        animations
      };
    },
    UPDATE_ANIMATION: (state: State, { payload }) => {
      const animations = state.animations.set(payload.id, payload);

      return {
        ...state,
        animations
      };
    },
    UPSERT_ANIMATIONS: (state: State, { payload }) => {
      let animations = state.animations;
      payload.map(animation => {
        animations = animations.set(animation.id, animation);
      })

      return {
        ...state,
        animations
      };
    },
    REMOVE_ANIMATION: (state: State, { payload }) => {
      if (!state.animations.has(payload)) {
        return state;
      }
      const animations = state.animations.remove(payload);

      return {
        ...state,
        animations
      };
    },

    // Public Gallery
    UPSERT_GALLERY_ANIMATIONS: (state: State, { payload }) => {
      let gallery = state.gallery;
      payload.map(animation => {
        gallery = gallery.set(animation.id, animation);
      })

      return {
        ...state,
        gallery
      };
    },
    REMOVE_GALLERY_ANIMATION: (state: State, { payload }) => {
      if (!state.gallery.has(payload)) {
        return state;
      }
      const gallery = state.gallery.remove(payload)

      return {
        ...state,
        gallery
      };
    },
    RESET_GALLERY: (state: State) => {

      return {
        ...state,
        gallery: new Map()
      };
    },


    // Authentication
    LOGIN: (state: State, { payload }) => {
      return {
        ...state,
        uid: payload
      };
    },
    LOGOUT: () => {
      localStorage.clear();

      return {
        uid: null,
        animations: new Map(),
        gallery: new Map(),
      }
    },

    // App-State reset
    RESET: () => {
      localStorage.clear();

      return {
        uid: '',
        gallery: new Map(),
        animations: new Map()
      };
    },
  },
  initialState
);
