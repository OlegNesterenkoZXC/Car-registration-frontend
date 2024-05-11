<template>
  <v-card>
    <v-card-title>Подключение к MetaMask</v-card-title>
    <v-card-subtitle>Проверьте включено ли расширение в вашем браузере</v-card-subtitle>
    <v-card-text v-if="error">
      <v-alert
        prominent
        text
        :type="error.type"
      >
        {{ error.text }}
      </v-alert>
    </v-card-text>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        color="primary"
        text
        @click="handler"
      >
        Подключиться
      </v-btn>
      <v-btn
        color="error"
        text
        @click="$emit('close')"
      >
        отмена
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { getMetaMaskProvider as getMetaMaskProviderAPI } from '@/libs/api'
import { ethers } from 'ethers';

export default {
  data () {
    return {
      provider: null,
      error: null,
    }
  },
  methods: {
    handler () {
      this.initMetMaskProvider()
    },
    initMetMaskProvider () {
      getMetaMaskProviderAPI()
      .then((provider) => this.provider = new ethers.BrowserProvider(provider))
      .then(() => this.provider.getSigner())
      .catch((error) => {
        console.error(error)

        this.error = {
          type: 'error',
          text: 'Не удалось подключиться к MetaMask, проверьте расширение и повторите попытку'
        }
      })
    }
  }
}
</script>