<template>
  <CustomModal
    ref="modal"
    disabled
    :loading="modalLoading"
    :title="modalTitle"
    :confirmButtonText="modalConfirmButton"
    :disabledConfirmButton="modalDisabledConfirm"
    @confirm="confirmHandler"
  >
    <div v-if="metaMaskProvider">
      <v-card-text>Ваш аккаунт: {{ signer.address }}</v-card-text>
      
      <v-card-text>
        <v-alert
          v-if="alert"
          prominent
          text
          :type="alert.type"
        >
          {{ alert.text }}
        </v-alert>

        <slot />
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

import { hasRole as hasRoleAPI } from '@/libs/api'
import { encodeRole } from '@/libs/utils'
import { EDITOR_ROLE, ALERT_TYPE } from '@/constants'
import { mapState } from 'vuex'

const CONNECT_METAMASK_MODAL = {
  title: 'Подключение к MetaMask',
  confirmButton: 'Подключиться',
}

export default {
  components: { CustomModal, ConnectMetaMask },
  props: {
    isEditor: Boolean,
    loading: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    modal: {
      type: Object,
      required: true
    }
  },
  model: {
    prop: 'isEditor',
    event: 'changeIsEditor'
  },
  data () {
    return {
      isLoading: false,
      alert: null
    }
  },
  watch: {
    addressSigner: {
      immediate: true,
      handler (value, oldValue) {
        if (value && value !== oldValue) {
          this.refreshSignerRole()
        }
      }
    }
  },
  computed: {
    ...mapState({
      metaMaskProvider: 'metaMaskProvider',
      signer: 'signer',
      httpProvider: 'httpProvider',
      abi: 'abi',
      contractAddress: 'contractAddress'
    }),
    addressSigner () {
      return this.signer?.address ?? ''
    },
    modalType () {
      return this.metaMaskProvider ? this.modal : CONNECT_METAMASK_MODAL
    },
    modalTitle () {
      return this.modalType.title
    },
    modalConfirmButton () {
      return this.modalType.confirmButton
    },
    modalDisabledConfirm () {
      return (this.metaMaskProvider ? this.disabled : false)
    },
    modalLoading () {
      return this.isLoading || this.loading
    }
  },
  methods: {
    confirmHandler () {
      if (!this.metaMaskProvider) {
        this.initMetMaskProvider()
      } else {
        this.$emit('confirm')
      }
    },
    openDialog () {
      this.$refs.modal.openDialog()
    },
    async initMetMaskProvider () {
      this.isLoading = true
      
      await this.$refs.connectMetaMask?.initMetMaskProvider()

      this.isLoading = false
    },
    async refreshSignerRole () {
      try {
        const hasRole = await this.hasEditorRole()
        if(!hasRole) {
          this.alert = ALERT_TYPE.NO_PERMISSION

          this.$emit('changeIsEditor', false)

          return
        }

        this.$emit('changeIsEditor', true)
      } catch (error) {
        this.alert = ALERT_TYPE.ACCOUNT_PERMISSION_ERROR
      }

      this.alert = null
    },

    async hasEditorRole () {
      const params = {
        address: this.contractAddress,
        abi: this.abi,
        provider: this.httpProvider,
        signer: this.signer,
        role: encodeRole(EDITOR_ROLE)
      }

      return hasRoleAPI(params)
    },
  }
}
</script>