<template>
  <div>
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
  </div>
</template>

<script>
import { getMetaMaskProvider as getMetaMaskProviderAPI } from '@/libs/api'
import { getBrowserProvider } from '@/libs/utils';

export default {
  data () {
    return {
      error: null,
    }
  },
  methods: {
    async getMetaMaskProvider () {
      return getMetaMaskProviderAPI()
    },
    async initMetMaskProvider () {
      this.error = true

      try {
        const provider = await getMetaMaskProviderAPI()
        
        const metaMaskProvider = getBrowserProvider(provider)
        await metaMaskProvider.getSigner()

        return metaMaskProvider
      } catch (error) {
        console.error(error)

        this.error = {
          type: 'error',
          text: 'Не удалось подключиться к MetaMask, проверьте расширение и повторите попытку'
        }
      }
    },
  }
}
</script>