<template>
  <CustomModal 
    modalButtonName="Оплатить"
    :title="modalTitle"
    :loading="isLoading"
    :confirmButtonText="modalConfirmButton"
    @confirm="confirmHandler"
  >
    <div v-if="metaMaskProvider">
      <v-card-text>Ваш аккаунт: {{ signer.address }}</v-card-text>
      <v-card-text>К оплате: {{ amount }} eth</v-card-text>
      
      <v-card-text>
        <v-alert
          v-if="alert"
          prominent
          text
          :type="alert.type"
        >
          {{ alert.text }}
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
import ConnectMetaMask from '@/components/ConnectMetaMask.vue'
import CustomModal from '@/components/elements/CustomModal.vue'

import { payCarDuties as payCarDutiesAPI } from '@/libs/api'
import { parseEther } from '@/libs/utils';
import { ALERT_TYPE } from '@/constants';
import { mapState } from 'vuex';

const MODAL_TYPE = {
  PAY_DUTIES: {
    title: 'Оплата пошлин',
    confirmButton: 'Оплатить',
  },
  CONNECT_METAMASK: {
    title: 'Подключение к MetaMask',
    confirmButton: 'Подключиться',
  }
}

const PAY_DUTIES_ERROR_ALERT = {
  type: 'error',
  text: 'Не удалось оплатить пошлины, попробуйте ещё раз'
}

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
      alert: null,
    }
  },
  computed: {
    ...mapState({
      abi: 'abi',
      contractAddress: 'contractAddress',
      metaMaskProvider: 'metaMaskProvider',
      signer: 'signer'
    }),
    modalType () {
      return this.metaMaskProvider ? MODAL_TYPE.PAY_DUTIES : MODAL_TYPE.CONNECT_METAMASK
    },
    modalTitle () {
      return this.modalType.title
    },
    modalConfirmButton () {
      return this.modalType.confirmButton
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
      this.alert = ALERT_TYPE.CONFIRM_TRANSACTION

      try {
        await this.payCarDuties()

        this.$emit('success')
      } catch (error) {
        console.error(error);

        this.alert = PAY_DUTIES_ERROR_ALERT
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>