<template>
  <CustomModal 
    :title="modalTitle"
    :loading="isLoading"
    modalButtonName="Оплатить"
    :confirmButton="modalConfirmButton"
    @confirm="confirmHandler"
  >
    <div v-if="metaMaskProvider">
      <v-card-text>Ваш счёт: {{ signer.address }}</v-card-text>
      <v-card-text>К оплате: {{ amount }} eth</v-card-text>
      
      <v-card-text>
        <v-alert
          v-if="error"
          prominent
          text
          :type="error.type"
        >
          {{ error.text }}
        </v-alert>

        <v-alert
          v-if="isLoading"
          prominent
          text
          type="info"
        >
          Проверьте расширение
        </v-alert>
      </v-card-text>
    </div>

    <ConnectMetaMask
      v-else
      ref="connectMetaMask"
    />
  </CustomModal>
</template>

<script>
import { payCarDuties as payCarDutiesAPI } from '@/libs/api'

import ConnectMetaMask from '@/components/ConnectMetaMask.vue'
import CustomModal from '@/components/elements/CustomModal.vue'

import { parseEther } from 'ethers'
import { mapState } from 'vuex';

export default {
  components: { ConnectMetaMask, CustomModal },
  props: {
    amount: {
      type: String,
      required: true
    },
    vin: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      isLoading: false,
      dialog: false,
      error: null,
    }
  },
  computed: {
    ...mapState({
      abi: 'abi',
      contractAddress: 'contractAddress',
      metaMaskProvider: 'metaMaskProvider',
      signer: 'signer'
    }),
    modalTitle () {
      if (!this.metaMaskProvider) {
        return 'Подключение к MetaMask'
      }
      
      return 'Оплата'
    },
    modalConfirmButton () {
      if (!this.metaMaskProvider) {
        return 'Подключиться'
      }

      return 'Оплатить'
    }
  },
  methods: {
    async initMetMaskProvider () {
      this.isLoading = true

      if (this.$refs.connectMetaMask) {
        await this.$refs.connectMetaMask.initMetMaskProvider()
      }

      this.isLoading = false
    },
    async confirmHandler () {
      if (!this.metaMaskProvider) {
        this.initMetMaskProvider()

        return
      }

      this.payDuties()
    },
    async refreshSigner () {
      this.signer = await this.metaMaskProvider.getSigner()
    },
    async payCarDuties () {
      const params = {
        address: this.contractAddress,
        signer: this.signer,
        abi: this.abi,
        provider: this.metaMaskProvider,
        vin: this.vin,
        amount: parseEther(this.amount),
      }

      return payCarDutiesAPI(params)
    },
    async payDuties () {
      this.isLoading = true
      this.error = false

      try {
        await this.payCarDuties()

        this.$emit('success')
      } catch (error) {
        console.error(error);

        this.error = {
          type: 'error',
          text: 'Что-то пошло не так, попробуйте ещё раз'
        }
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>