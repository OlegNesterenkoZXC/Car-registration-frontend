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
import { mapActions } from 'vuex';

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
    ...mapActions({
      storeInitMetaMaskProvider: 'initMetaMaskProvider',
      storeInitSigner: 'initSigner'
    }),
    async initMetMaskProvider () {
      this.error = null

      try {
        const provider = await this.getMetaMaskProvider()
        
        const ethersMetaMaskProvider = getBrowserProvider(provider)
        const signer = await ethersMetaMaskProvider.getSigner()

        this.storeInitMetaMaskProvider(ethersMetaMaskProvider)
        this.storeInitSigner(signer)
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