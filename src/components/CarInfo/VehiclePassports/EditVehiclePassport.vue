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
        v-model="formVehiclePassport.region"
        label="Регион"
        required
        :counter="2"
        :rules="regionRules"
      />
      <v-text-field
        v-model="formVehiclePassport.series"
        label="Серия"
        required
        :counter="2"
        :rules="seriesRules"
      />
      <v-text-field
        v-model="formVehiclePassport.number"
        label="Номер"
        required
        :counter="6"
        :rules="numberRules"
      />
    </v-form>
  </EditPanelTemplate>
</template>

<script>
import EditPanelTemplate from '@/components/CarInfo/EditPanelTemplate.vue'

import {
  addVehiclePassport as addVehiclePassportAPI,
  editVehiclePassport as editVehiclePassportAPI,
  removeVehiclePassport as removeVehiclePassportAPI
} from '@/libs/api'

import { MODE, ALERT_TYPE } from '@/constants'

import { mapState } from 'vuex'

const MODAL_TYPE_MAPPING = {
  [MODE.ADD]: {
    title: 'Добавление паспорта ТС',
    confirmButton: 'Добавить',
    disabledForm: false,
  },
  [MODE.EDIT]: {
    title: 'Редактирование паспорта ТС',
    confirmButton: 'Изменить',
    disabledForm: false,
  },
  [MODE.REMOVE]: {
    title: 'Удаление паспорта ТС',
    confirmButton: 'Удалить',
    disabledForm: true,
  }
}

const PASSPORT_ALERT_MAPPING = {
  [MODE.ADD]: {
    type: 'error',
    text: 'Не удалось добавить паспорт ТС',
  },
  [MODE.EDIT]: {
    type: 'error',
    text: 'Не удалось изменить паспорт ТС',
  },
  [MODE.REMOVE]: {
    type: 'error',
    text: 'Не удалось удалить паспорт ТС',
  }
}

const REGION_RULES = {
  required: (v) => !!v || 'Регион обязательное поле',
  length: (v) => !v || v.length === 2 || 'Неправильная длина',
}
const SERIES_RULES = {
  required: (v) => !!v || 'Серия обязательное поле',
  length: (v) => !v || v.length === 2 || 'Неправильная длина',
}
const NUMBER_RULES = {
  required: (v) => !!v || 'Номер обязательное поле',
  length: (v) => !v || v.length === 6 || 'Неправильная длина',
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
    vehiclePassport: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      isEditor: false,
      isValidForm: false,
      isLoading: false,
      formVehiclePassport: {
        region: '',
        series: '',
        number: ''
      },
      alert: null
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
    regionRules () {
      return [REGION_RULES.required, REGION_RULES.length]
    },
    seriesRules () {
      return [SERIES_RULES.required, SERIES_RULES.length]
    },
    numberRules () {
      return [NUMBER_RULES.required, NUMBER_RULES.length]
    },
    isDataChanged () {
      return this.formVehiclePassport.region !== this.vehiclePassport.region ||
        this.formVehiclePassport.series !== this.vehiclePassport.series ||
        this.formVehiclePassport.number !== this.vehiclePassport.number
    }
  },
  methods: {
    openDialog () {
      this.$refs.editTemplatePanel.openDialog()

      this.$nextTick(this.initFormData)
    },
    confirmHandler () {
      let method = null
      if (this.mode === MODE.ADD) {
        method = this.addVehiclePassport
      } else if (this.mode === MODE.EDIT) {
        method = this.editVehiclePassport
      } else {
        method = this.removeVehiclePassport
      }

      const alert = PASSPORT_ALERT_MAPPING[this.mode]

      this.startEditData(method, alert)
    },
    initFormData () {
      if (this.mode === MODE.ADD) {
        this.$refs.form?.reset()
      } else {
        this.formVehiclePassport.region = this.vehiclePassport.region
        this.formVehiclePassport.series = this.vehiclePassport.series
        this.formVehiclePassport.number = this.vehiclePassport.number
      }
    },
    async startEditData (method, alert) {
      this.isLoading = true
      this.alert = ALERT_TYPE.CONFIRM_TRANSACTION

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
    async addVehiclePassport () {
      const params = {
        address: this.contractAddress,
        abi: this.abi,
        provider: this.httpProvider,
        signer: this.signer,
        vin: this.vin,
        region: this.formVehiclePassport.region,
        series: this.formVehiclePassport.series,
        number: this.formVehiclePassport.number
      }

      return addVehiclePassportAPI(params)
    },
    async editVehiclePassport () {
      const params = {
        address: this.contractAddress,
        abi: this.abi,
        provider: this.httpProvider,
        signer: this.signer,
        vin: this.vin,
        index: this.vehiclePassport.index,
        region: this.formVehiclePassport.region,
        series: this.formVehiclePassport.series,
        number: this.formVehiclePassport.number
      }

      return editVehiclePassportAPI(params)
    },
    async removeVehiclePassport () {
      const params = {
        address: this.contractAddress,
        abi: this.abi,
        provider: this.httpProvider,
        signer: this.signer,
        vin: this.vin,
        index: this.vehiclePassport.index,
      }

      return removeVehiclePassportAPI(params)
    }
  }
}
</script>