import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    metaMaskProvider: null,
    signer: "",
    httpProvider: null,
    abi: null,
    contractAddress: ''
  },
  getters: {
  },
  mutations: {
    setMetaMaskProvider (state, metaMaskProvider) {
      state.metaMaskProvider = metaMaskProvider
    },
    setSigner (state, signer) {
      state.signer = signer
    },
    setHttpProvider (state, httpProvider) {
      state.httpProvider = httpProvider
    },
    setAbi (state, abi) {
      state.abi = abi
    },
    setContractAddress (state, contractAddress) {
      state.contractAddress = contractAddress
    },
  },
  actions: {
    initMetaMaskProvider ({ dispatch, commit }, metaMaskProvider) {
      window.ethereum.on('accountsChanged', () => dispatch('refreshSigner'))

      commit('setMetaMaskProvider', metaMaskProvider)
    },
    initSigner ({ commit }, signer) {
      commit('setSigner', signer)
    },
    async refreshSigner ({dispatch, commit, state}) {
      if (state.metaMaskProvider) {
        const signer = await state.metaMaskProvider.getSigner()
        commit('setSigner', signer)
      }
    },
    initHttpProvider ({ commit }, httpProvider) {
      commit('setHttpProvider', httpProvider)
    },
    initContractInfo ({commit}, payload) {
      commit('setAbi', payload.abi)
      commit('setContractAddress', payload.address)
    }
  },
  modules: {
  }
})
