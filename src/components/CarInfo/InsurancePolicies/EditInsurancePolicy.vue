<template>
  <CustomModal
    ref="modal"
    isIconActivator
    :loading="isLoading"
    :title="modalTitle"
    :confirmButton="modalConfirmButton"
    :disabledConfirmButton="modalDisabledConfirmButton"
    @activator="activatorHandler"
    @change="changeHandler"
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
        <v-alert
          v-if="isLoading"
          prominent
          text
          type="info"
        >
          Проверьте расширение
        </v-alert>

        <v-alert
          v-if="error"
          prominent
          text
          :type="error.type"
        >
          {{ error.text }}
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

import { MODE } from '@/constants';

const MODAL_TYPE_MAPPING = {
  [MODE.ADD]: {
    title: 'Редактирование полиса',
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

const ALERT_TYPE = {
  STARTED_TRANSACTION: {
    type: 'info',
    text: 'Ожидайте исполнения транзакции'
  },
  NO_PERMISSION: {
    type: 'error',
    text: 'Нет прав, выберите другой аккаунт',
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
    },
    abi: {
      type: Array,
      required: true,
    },
    provider: {
      type: Object,
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
      isDisabled: false,
      isEditor: false,
      isValidForm: false,
      metaMaskProvider: null,
      signer: '',
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
      error: null,
      alert: null
    }
  },
  computed: {
    modalType () {
      if (!this.metaMaskProvider) {
        return MODAL_TYPE_MAPPING.CONNECT_METAMASK
      }

      return MODAL_TYPE_MAPPING[this.mode]
    },
    modalTitle () {
      return this.modalType.title
    },
    modalConfirmButton () {
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
    activatorHandler () {
      this.$emit('add')
    },
    changeHandler (isOpen) {
      this.$refs.form?.resetValidation()

      const isFillingMode = this.mode === MODE.EDIT || this.mode === MODE.REMOVE

      if (this.mode === MODE.ADD) {
        this.series = ''
        this.number = ''
      }

      if (isFillingMode && isOpen) {
        this.series = this.insurancePolicy.series
        this.number = this.insurancePolicy.number
      }
    },
    openDialog () {
      this.$refs.modal.openDialog()
    },
    async initMetMaskProvider () {
      this.isLoading = true

      if (this.$refs.connectMetaMask) {
        this.metaMaskProvider = await this.$refs.connectMetaMask.initMetMaskProvider()

        window.ethereum.on('accountsChanged', this.refreshSigner)

        await this.refreshSigner()
      }

      this.isLoading = false
    },
    async hasRole () {
      const params = {
        address: this.contractAddress,
        abi: this.abi,
        provider: this.provider,
        signer: this.signer,
        role: encodeRole('EDITOR')
      }

      return hasRoleAPI(params)
    },
    confirmHandler () {
      if (!this.metaMaskProvider) {
        this.initMetMaskProvider()

        return
      }

      this.startEditData()
    },
    async refreshSigner () {
      try {
        this.signer = await this.metaMaskProvider.getSigner()
        this.error = null

        const hasRole = await this.hasRole()
        if(!hasRole) {
          this.alert = {
            type: 'error',
            text: 'Нет прав, выберите другой аккаунт',
          }

          this.isEditor = false

          return
        }

        this.isEditor = true
      } catch (error) {
        this.alert = {
          type: 'error',
          text: 'Не удалось получить аккаунт',
        }
      }
    },
    async startEditData () {
      this.isLoading = true
      this.isDisabled = true
      this.error = null

      try {
        if (this.mode === MODE.ADD) {
          await this.addInsurancePolicy()
        }
        if (this.mode === MODE.EDIT) {
          const tx = this.editInsurancePolicy()
          console.log('ТРАНЗАКЦИЯ НАЧАТА')

          await tx
          console.log('ТРАНЗАКЦИЯ ИСПОЛНЕНА');
        }
        if (this.mode === MODE.REMOVE) {
          await this.removeInsurancePolicy()
        }

        this.$emit('success')
      } catch (error) {
        console.error(error)

        this.alert = {
          type: 'error',
          text: 'Не удалось изменить полис страхования',
        }

        this.error = {
          type: 'error',
          text: 'Не удалось изменить полис страхования',
        }
      } finally {
        this.isLoading = false
        this.isDisabled = false
      }
    },
    async addInsurancePolicy () {
      const params = {
        address: this.contractAddress,
        abi: this.abi,
        provider: this.provider,
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
        provider: this.provider,
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
        provider: this.provider,
        signer: this.signer,
        vin: this.vin,
        index: this.insurancePolicy.index
      }

      return removeInsurancePolicyAPI(params)
    }
  },
}
</script>