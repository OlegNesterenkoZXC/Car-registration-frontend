<template>
  <CustomModal
    ref="modal"
    disabled
    :loading="isLoading"
    :title="modalTitle"
    :confirmButtonText="modalConfirmButtonText"
    :disabledConfirmButton="modalDisabledConfirmButton"
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

        <v-form
          ref="form"
          v-model="isValidForm"
          :disabled="isDisabledForm"
        >
          <v-text-field
            v-model="series"
            label="Серия"
            required
            :counter="3"
            :rules="[seriesRules.required, seriesRules.length]"
          />
          <v-text-field
            v-model="number"
            label="Номер"
            required
            :counter="10"
            :rules="[numberRules.required, numberRules.length]"
          />
        </v-form>
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

import { 
  hasRole as hasRoleAPI, 
  addInsurancePolicy as addInsurancePolicyAPI,
  editInsurancePolicy as editInsurancePolicyAPI,
  removeInsurancePolicy as removeInsurancePolicyAPI,
} from '@/libs/api'

import { encodeRole } from '@/libs/utils'

import { MODE, EDITOR_ROLE, ALERT_TYPE } from '@/constants';
import { mapState } from 'vuex';

const MODAL_TYPE_MAPPING = {
  [MODE.ADD]: {
    title: 'Добавление полиса',
    confirmButton: 'Добавить',
    disabledForm: false,
  },
  [MODE.EDIT]: {
    title: 'Редактирование полиса',
    confirmButton: 'Изменить',
    disabledForm: false,
  },
  [MODE.REMOVE]: {
    title: 'Удаление полиса',
    confirmButton: 'Удалить',
    disabledForm: true,
  },
  CONNECT_METAMASK: {
    title: 'Подключение к MetaMask',
    confirmButton: 'Подключиться',
    disabledForm: true,
  }
}

const POLICY_ALERT_MAPPING = {
  [MODE.ADD]: {
    type: 'error',
    text: 'Не удалось добавить полис страхования',
  },
  [MODE.EDIT]: {
    type: 'error',
    text: 'Не удалось изменить полис страхования',
  },
  [MODE.REMOVE]: {
    type: 'error',
    text: 'Не удалось удалить полис страхования',
  }
}

export default {
  components: { CustomModal, ConnectMetaMask },
  props: {
    mode: {
      type: String,
      required: true
    },
    insurancePolicy: {
      type: Object,
      default: null
    },
    vin: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      isLoading: false,
      isDisabled: false,
      isEditor: false,
      isValidForm: false,
      series: '',
      seriesRules: {
        required: (v) => !!v || 'Серия обязательное поле',
        length: (v) => !v || v.length === 3 || 'Неправильная длина',
      },
      number: '',
      numberRules: {
        required: (v) => !!v || 'Номер обязательное поле',
        length: (v) => !v || v.length === 10 || 'Неправильная длина',
      },
      alert: null
    }
  },
  watch: {
    addressSigner: {
      immediate: true,
      handler (value, oldValue) {
        if (value && value !== oldValue) {
          this.refreshSigner()
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
      if (!this.metaMaskProvider) {
        return MODAL_TYPE_MAPPING.CONNECT_METAMASK
      }

      return MODAL_TYPE_MAPPING[this.mode]
    },
    modalTitle () {
      return this.modalType.title
    },
    modalConfirmButtonText () {
      return this.modalType.confirmButton
    },
    modalDisabledConfirmButton () {
      if (!this.metaMaskProvider || this.mode === MODE.REMOVE) {
        return false
      }

      if (!this.isEditor) {
        return true
      }

      if (this.mode === MODE.EDIT) {
        return !this.isValidForm || !this.isDataChanged
      }

      return !this.isValidForm
    },
    isDisabledForm () {
      return !this.isEditor || MODAL_TYPE_MAPPING[this.mode].disabledForm
    },
    isDataChanged () {
      return this.insurancePolicy.series !== this.series || this.insurancePolicy.number !== this.number
    }
  },
  methods: {
    confirmHandler () {
      if (!this.metaMaskProvider) {
        this.initMetMaskProvider()

        return
      }

      this.startEditData()
    },
    openDialog () {
      this.alert = null
      this.$refs.modal.openDialog()

      this.$nextTick(this.initFormData)      
    },
    initFormData () {
      if (this.mode === MODE.ADD) {
        this.$refs.form?.reset()
      } else {
        this.series = this.insurancePolicy.series
        this.number = this.insurancePolicy.number
      }
    },
    async initMetMaskProvider () {
      this.isLoading = true
      
      await this.$refs.connectMetaMask?.initMetMaskProvider()

      this.isLoading = false
    },
    async refreshSigner () {
      try {
        const hasRole = await this.hasEditorRole()
        if(!hasRole) {
          this.alert = ALERT_TYPE.NO_PERMISSION

          this.isEditor = false

          return
        }

        this.isEditor = true
      } catch (error) {
        this.alert = ALERT_TYPE.ACCOUNT_PERMISSION_ERROR
      }

      this.alert = null
    },
    async startEditData () {
      this.isLoading = true
      this.isDisabled = true
      this.alert = null

      try {
        this.alert = ALERT_TYPE.CONFIRM_TRANSACTION

        if (this.mode === MODE.ADD) {
          await this.addInsurancePolicy()
        } else if (this.mode === MODE.EDIT) {
          await this.editInsurancePolicy()
        } else if (this.mode === MODE.REMOVE) {
          await this.removeInsurancePolicy()
        }

        this.$emit('success')
      } catch (error) {
        console.error(error)

        this.alert = POLICY_ALERT_MAPPING[this.mode]
      } finally {
        this.isLoading = false
        this.isDisabled = false
      }
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
    async addInsurancePolicy () {
      const params = {
        address: this.contractAddress,
        abi: this.abi,
        provider: this.httpProvider,
        signer: this.signer,
        vin: this.vin,
        series: this.series,
        number: this.number
      }

      return addInsurancePolicyAPI(params)
    },
    async editInsurancePolicy () {
      const params = {
        address: this.contractAddress,
        abi: this.abi,
        provider: this.httpProvider,
        signer: this.signer,
        vin: this.vin,
        index: this.insurancePolicy.index,
        series: this.series,
        number: this.number
      }

      return editInsurancePolicyAPI(params)
    },
    async removeInsurancePolicy () {
      const params = {
        address: this.contractAddress,
        abi: this.abi,
        provider: this.httpProvider,
        signer: this.signer,
        vin: this.vin,
        index: this.insurancePolicy.index
      }

      return removeInsurancePolicyAPI(params)
    }
  },
}
</script>