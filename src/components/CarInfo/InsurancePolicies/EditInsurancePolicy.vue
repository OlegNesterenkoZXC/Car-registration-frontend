<template>
  <EditPanelTemplate
    ref="editTemplatePanel"
    v-model="isEditor"
    :loading="isLoading"
    :disabled="isDisabledModal"
    :modal="modalType"
    @confirm="confirmHandler"
  >
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
        v-model="formInsurancePolicy.series"
        label="Серия"
        required
        :counter="3"
        :rules="seriesRules"
      />
      <v-text-field
        v-model="formInsurancePolicy.number"
        label="Номер"
        required
        :counter="10"
        :rules="numberRules"
      />
    </v-form>
  </EditPanelTemplate>
</template>

<script>
import EditPanelTemplate from '@/components/CarInfo/EditPanelTemplate.vue'

import {
  addInsurancePolicy as addInsurancePolicyAPI,
  editInsurancePolicy as editInsurancePolicyAPI,
  removeInsurancePolicy as removeInsurancePolicyAPI,
} from '@/libs/api'

import { MODE, ALERT_TYPE } from '@/constants';
import { mapState } from 'vuex';

const MODAL_TYPE_MAPPING = {
  [MODE.ADD]: {
    title: 'Добавление полиса ТС',
    confirmButton: 'Добавить',
    disabledForm: false,
  },
  [MODE.EDIT]: {
    title: 'Редактирование полиса ТС',
    confirmButton: 'Изменить',
    disabledForm: false,
  },
  [MODE.REMOVE]: {
    title: 'Удаление полиса ТС',
    confirmButton: 'Удалить',
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

const SERIES_RULES = {
  required: (v) => !!v || 'Серия обязательное поле',
  length: (v) => !v || v.length === 3 || 'Неправильная длина'
}
const NUMBER_RULES = {
  required: (v) => !!v || 'Номер обязательное поле',
  length: (v) => !v || v.length === 10 || 'Неправильная длина'
}

export default {
  components: { EditPanelTemplate },
  props: {
    mode: {
      type: String,
      required: true
    },
    vin: {
      type: String,
      required: true
    },
    insurancePolicy: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      isEditor: false,
      isValidForm: false,
      isLoading: false,
      formInsurancePolicy: {
        series: '',
        number: ''
      },
      alert: null
    }
  },
  computed: {
    ...mapState({
      signer: 'signer',
      httpProvider: 'httpProvider',
      abi: 'abi',
      contractAddress: 'contractAddress'
    }),
    modalType () {
      return MODAL_TYPE_MAPPING[this.mode]
    },
    isDisabledForm () {
      return !this.isEditor || this.isLoading || this.modalType.disabledForm
    },
    isDisabledModal () {
      const isDataChanged = (this.mode === MODE.EDIT ? this.isDataChanged : true)

      return !this.isEditor || !this.isValidForm || !isDataChanged
    },
    seriesRules () {
      return [SERIES_RULES.required, SERIES_RULES.length]
    },
    numberRules () {
      return [NUMBER_RULES.required, NUMBER_RULES.length]
    },
    isDataChanged () {
      return this.insurancePolicy.series !== this.formInsurancePolicy.series || 
        this.insurancePolicy.number !== this.formInsurancePolicy.number
    }
  },
  methods: {
    openDialog () {
      this.alert = null
      this.$refs.editTemplatePanel.openDialog()

      this.$nextTick(this.initFormData)      
    },
    confirmHandler () {
      let method = null
      if (this.mode === MODE.ADD) {
        method = this.addInsurancePolicy
      } else if (this.mode === MODE.EDIT) {
        method = this.editInsurancePolicy
      } else {
        method = this.removeInsurancePolicy
      }

      const alert = POLICY_ALERT_MAPPING[this.mode]

      this.startEditData(method, alert)
    },
    initFormData () {
      if (this.mode === MODE.ADD) {
        this.$refs.form?.reset()
      } else {
        this.formInsurancePolicy.series = this.insurancePolicy.series
        this.formInsurancePolicy.number = this.insurancePolicy.number
      }
    },
    async startEditData (method, alert) {
      this.isLoading = true
      this.alert =  ALERT_TYPE.CONFIRM_TRANSACTION

      try {

        await method()

        this.$emit('success')
      } catch (error) {
        console.error(error)

        this.alert = alert
      } finally {
        this.isLoading = false
      }
    },
    async addInsurancePolicy () {
      const params = {
        address: this.contractAddress,
        abi: this.abi,
        provider: this.httpProvider,
        signer: this.signer,
        vin: this.vin,
        series: this.formInsurancePolicy.series,
        number: this.formInsurancePolicy.number
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
        series: this.formInsurancePolicy.series,
        number: this.formInsurancePolicy.number
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