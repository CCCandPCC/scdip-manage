import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    journey: null,
    _unsaved: null,
    _showSnackbar: false,
    _snackbarColour: null,
    _snackbarText: "",
    _snackbarTimeout: -1,
    _snackbarIcon: ''
  },

  getters: {
    showSnackbar: state => state._showSnackbar,
    snackbarText: state => state._snackbarText,
    snackbarColour: state => state._snackbarColour,
    snackbarTimeout: state => state._snackbarTimeout,
    snackbarIcon: state => state._snackbarIcon,
    unsaved: state => state._unsaved
  },

  mutations: {
    // Generally, you should dispatch doSnackbar rather than calling this directly
    setSnackbar(state, value) {
      state._snackbarColour = value.colour
      state._snackbarText = value.text
      state._snackbarIcon = value.icon
      state._snackbarTimeout = value.timeout | 5000
      state._showSnackbar = true
    },
    setSnackbarVisible(state, visible) {
      state._showSnackbar = visible
    },
    setUnsaved(state, value) {
      state._unsaved = value
    },
    clearUnsaved(state) {
      state._unsaved = null
    }
  },

  actions: {
    doSnackbar(context, value) {
      context.commit('setSnackbarVisible', false)
      Vue.nextTick(() => context.commit('setSnackbar', value))
    }
  }

})