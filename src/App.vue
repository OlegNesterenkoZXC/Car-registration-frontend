<template>
  <v-app>
    <v-app-bar color="deep-purple" dark app>
			<v-app-bar-nav-icon @click="drawer = true"></v-app-bar-nav-icon>

			<v-toolbar-title>Система регистрации автомобилей</v-toolbar-title>
			<v-spacer></v-spacer>
		</v-app-bar>

		<v-navigation-drawer v-model="drawer" absolute temporary app>
			<v-list nav dense>
				<v-list-item-group v-model="group" active-class="deep-purple--text text--accent-4">
					<v-list-item to="/">
						<v-list-item-icon>
							<v-icon>mdi-home</v-icon>
						</v-list-item-icon>
						<v-list-item-title>Домой</v-list-item-title>
					</v-list-item>
				</v-list-item-group>
			</v-list>
		</v-navigation-drawer>
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
      drawer: false,
      group: null
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
    }
  },
  mounted() {
    this.init()
  },
}
</script>
