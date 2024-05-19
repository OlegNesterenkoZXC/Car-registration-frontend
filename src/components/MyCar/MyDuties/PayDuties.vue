<template>
  <v-dialog 
    v-model="dialog"
    persistent
    width="500"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        color="primary"
        v-bind="attrs"
        v-on="on"
      >
        Оплатить
      </v-btn>
    </template>

    <v-card v-if="metaMaskProvider">
      <v-card-title>Оплата</v-card-title>
      
      <v-card-text>Ваш счёт: {{ signer.address }}</v-card-text>
      <v-card-text>К оплате: {{ amount }} eth</v-card-text>
      
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
          @click="payDuties"
          text
        >
         Оплатить
        </v-btn>
        <v-btn
          color="error"
          text
          :disabled="isLoading"
          @click="dialog = false"
        >
          Отмена
        </v-btn>
      </v-card-actions>

    </v-card>

    <ConnectMetaMask
      v-else
      :provider="metaMaskProvider"
      @change="changeProviderHandler"
      @close="dialog = false"
    />

  </v-dialog>
</template>

<script>
import { payCarDuties as payCarDutiesAPI } from '@/libs/api';

import ConnectMetaMask from '@/components/ConnectMetaMask.vue';
import { parseEther } from 'ethers';

export default {
  components: { ConnectMetaMask },
  props: {
    amount: {
      type: String,
      required: true
    },
    vin: {
      type: String,
      required: true
    },
    abi: {
      type: Array,
      required: true,
    },
    contractAddress: {
      type: String,
      required: true,
    },
  },
  data () {
    return {
      isLoading: false,
      dialog: false,
      error: null,
      metaMaskProvider: null,
      signer: ''
    }
  },
  methods: {
    changeProviderHandler (provider) {
      this.metaMaskProvider = provider

      this.setSigner()

      window.ethereum.on('accountsChanged', this.setSigner)
    },
    async setSigner () {
      this.signer = await this.metaMaskProvider.getSigner()
    },
    async payDuties () {
      this.isLoading = true

      const params = {
        address: this.contractAddress,
        signer: this.signer,
        abi: this.abi,
        provider: this.metaMaskProvider,
        vin: this.vin.toUpperCase(),
        amount: parseEther(this.amount),
      }

      try {
        await payCarDutiesAPI (params)
        this.dialog = false

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