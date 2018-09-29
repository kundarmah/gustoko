import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  setRehydrationComplete: null
})

export const AppStateTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  rehydrationComplete: false
})

/* ------------- Reducers ------------- */

// rehydration is complete
export const setRehydrationComplete = (state: Object) =>
  state.merge({ rehydrationComplete: true })

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.SET_REHYDRATION_COMPLETE]: setRehydrationComplete
})

/* ------------- Selectors ------------- */

// Is rehydration complete?
export const isRehydrationComplete = (state: Object) => state.rehydrationComplete
