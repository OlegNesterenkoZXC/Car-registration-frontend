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
        :loading="isLoading"
        :disabled="isLoading"
        text
        @click="connectHandler"
      >
        Подключиться
      </v-btn>
      <v-btn
        color="error"
        text
        @click="closeHandler"
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
  props: {
    provider: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      isLoading: false,
      error: null,
    }
  },
  methods: {
    closeHandler () {
      $emit('close')

      this.isLoading = false
      this.error = null
    },
    connectHandler () {
      this.initMetMaskProvider()
    },
    initMetMaskProvider () {
      this.isLoading = true;

      getMetaMaskProviderAPI()
      .then(async (provider) => {
        const metaMaskProvider = new ethers.BrowserProvider(provider)
        await metaMaskProvider.getSigner()

        this.$emit('change', metaMaskProvider)
      })
      .catch((error) => {
        console.error(error)

        this.error = {
          type: 'error',
          text: 'Не удалось подключиться к MetaMask, проверьте расширение и повторите попытку'
        }
      })
      .finally(() => this.isLoading = false)
    }
  }
}
</script>