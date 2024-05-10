<template>
  <v-app>
    <v-main>
      <v-overlay v-if="isLoading">
        <v-progress-circular
          indeterminate
          size="64"
        />
      </v-overlay>

      <v-container v-else-if="error" >
        <v-alert 
          prominent
          text v-if="error" 
          :type="error.type" 
        >
          <v-row>
            <v-col cols="11">
              {{ error.text }}
            </v-col>

            <v-col cols="1">
              <v-btn
                icon
                @click="clickHandler"
              >
                <v-icon>mdi-cached</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-alert>
      </v-container>

      <router-view 
        v-else 
        :abi="abi"
        :provider="provider"
        :contractAddress="contractAddress"
      />
    </v-main>
  </v-app>
</template>

<script>
import { 
  getContractABI, 
  getProvider, 
  getMetaMaskProvider, 
  getContractAddress 
} from '@/libs/api'

import { BLOCKCHAIN_URL } from './constants';

export default {
  name: 'App',

  data: () => {
    return {
      isLoadingContractAbi: true,
      isLoadingProvider: true,
      isLoadingContractAddress: true,
      abi: null,
      provider: null,
      metaMaskProvider: null,
      contractAddress: '',
      error: null,
    }
  },
  computed: {
    isLoading () {
      return this.isLoadingContractAbi || 
        this.isLoadingContractAbi || this.isLoadingProvider
    }
  },
  methods: {
    clickHandler () {
      this.error = null

      this.init()
    },
    init () {
      this.initContractAbi()
      this.initProvider()
      this.initMetMaskProvider()
      this.initContractAddress()
    },
    initContractAbi () {
      this.isLoadingContractAbi = true

      getContractABI()
        .then((abi) => (this.abi = abi))
        .catch((err) => {
          console.error(err)

          this.error = {
            type: 'error',
            text: 'Не удалось получить ABI контракта'
          }
        })
        .finally(() => {
          this.isLoadingContractAbi = false
        })
    },
    initProvider () {
      this.isLoadingProvider = true

      try {
        this.provider = getProvider(BLOCKCHAIN_URL)
      } catch (error) {
        console.error(error);

        this.error = {
          type: 'error',
          text: 'Не удалось подключиться к Ethereum'
        }
      } finally {
        this.isLoadingProvider = false
      }
    },
    initContractAddress () {
      this.isLoadingContractAddress = true

      getContractAddress()
        .then((address) => this.contractAddress = address)
        .catch((error) => {
          console.error(error);

          this.error = {
            type: 'error',
            text: 'Не удалось подключиться к контракту'
          }
        })
        .finally(() => {
          this.isLoadingContractAddress = false
        })
    },
    initMetMaskProvider () {
      getMetaMaskProvider()
      .then((provider) => this.metaMaskProvider = provider)
      .catch((error) => {
        console.error(error)

        this.error = {
          type: 'error',
          text: 'Не удалось подключиться к MetaMask'
        }
      })
    }
  },
  mounted() {
    this.init()
  },
}
</script>
