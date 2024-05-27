<template>
  <v-app>
    <AppFooter 
      title="Система учёта автомобилей"
    />
    <v-main>
      <v-overlay v-if="isLoading">
        <v-progress-circular
          indeterminate
          size="64"
        />
      </v-overlay>

      <v-container v-else-if="alert" fluid>
        <v-alert 
          prominent
          text
          :type="alert.type" 
        >
          <v-row>
            <v-col cols="11">{{ alert.text }}</v-col>
            <v-col cols="1">
              <v-btn
                icon
                @click="clickHandler"
              >
                <v-icon
                  color="error"
                >
                  mdi-cached
                </v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-alert>
      </v-container>

      <router-view v-else />
    </v-main>
  </v-app>
</template>

<script>
import { 
  getContractInfo as getContractInfoAPI,
} from '@/libs/api'

import { getProvider } from '@/libs/utils';
import { mapActions } from 'vuex';

import AppFooter from '@/components/elements/AppFooter.vue';

export default {
  name: 'App',
  components: { AppFooter },
  data: () => {
    return {
      isLoading: true,
      alert: null,
    }
  },
  methods: {
    ...mapActions({
      initHttpProvider: 'initHttpProvider',
      initStoreContractInfo: 'initContractInfo'
    }),
    clickHandler () {
      this.init()
    },
    async init () {
      this.isLoading = true
      this.error = null

      await Promise.all([
        this.initProvider(),
        this.initContractInfo()
      ])

      this.isLoading = false
    },
    async getContractInfo () {
      return getContractInfoAPI()
    },
    async initContractInfo () {
      try {
        const { abi, address } = await this.getContractInfo()

        this.initStoreContractInfo({
          abi,
          address
        })
      } catch (error) {
        console.error(error)

        this.alert = {
          type: 'error',
          text: 'Не удалось получить информацию о контракте'
        }
      }
    },
    initProvider () {
      try {
        const provider = getProvider()

        this.initHttpProvider(provider)
      } catch (error) {
        console.error(error);

        this.alert = {
          type: 'error',
          text: 'Не удалось подключиться к Ethereum'
        }
      }
    },
  },
  created () {
    this.init()
  },
}
</script>
