<template>
  <div>
    <v-card-subtitle>Проверьте включено ли расширение в вашем браузере</v-card-subtitle>
    <v-card-text v-if="alert">
      <v-alert
        prominent
        text
        :type="alert.type"
      >
        {{ alert.text }}
      </v-alert>
    </v-card-text>
  </div>
</template>

<script>
import { getMetaMaskProvider as getMetaMaskProviderAPI } from '@/libs/api'
import { getBrowserProvider } from '@/libs/utils';
import { mapActions } from 'vuex';

const METAMASK_ALERT = {
  type: 'error',
  text: 'Не удалось подключиться к MetaMask, проверьте расширение и повторите попытку'
}

export default {
  data () {
    return {
      alert: null,
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
      this.alert = null

      try {
        const provider = await this.getMetaMaskProvider()
        
        const ethersMetaMaskProvider = getBrowserProvider(provider)
        const signer = await ethersMetaMaskProvider.getSigner()

        this.storeInitMetaMaskProvider(ethersMetaMaskProvider)
        this.storeInitSigner(signer)
      } catch (error) {
        console.error(error)

        this.alert = METAMASK_ALERT
      }
    },
  }
}
</script>