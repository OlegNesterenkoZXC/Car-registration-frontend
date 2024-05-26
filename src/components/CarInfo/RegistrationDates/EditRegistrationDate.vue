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

    <DatePicker
      :defaultDates="formRegistrationDate"
      :disabled="isDisabledDatePicker"
      @change="changeHandler"
    />
  </EditPanelTemplate>
</template>

<script>
import EditPanelTemplate from '@/components/CarInfo/EditPanelTemplate.vue'
import DatePicker from '@/components/elements/DatePicker.vue'

import {
  addRegistrationDate as addRegistrationDateAPI,
  editRegistrationDate as editRegistrationDateAPI,
  removeRegistrationDate as removeRegistrationDateAPI,
} from '@/libs/api'

import { MODE, ALERT_TYPE } from '@/constants';
import { mapState } from 'vuex';

const MODAL_TYPE_MAPPING = {
  [MODE.ADD]: {
    title: 'Добавление даты регистрации ТС',
    confirmButton: 'Добавить',
    disabledForm: false,
  },
  [MODE.EDIT]: {
    title: 'Редактирование даты регистрации ТС',
    confirmButton: 'Изменить',
    disabledForm: false,
  },
  [MODE.REMOVE]: {
    title: 'Удаление даты регистрации ТС',
    confirmButton: 'Удалить',
    disabledForm: true,
  }
}

const DATE_ALERT_MAPPING = {
  [MODE.ADD]: {
    type: 'error',
    text: 'Не удалось добавить дату регистрации',
  },
  [MODE.EDIT]: {
    type: 'error',
    text: 'Не удалось изменить дату регистрации',
  },
  [MODE.REMOVE]: {
    type: 'error',
    text: 'Не удалось удалить дату регистрации',
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
  components: { EditPanelTemplate, DatePicker },
  props: {
    mode: {
      type: String,
      required: true
    },
    vin: {
      type: String,
      required: true
    },
    registrationDate: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      isEditor: false,
      isLoading: false,
      formRegistrationDate: {
        start: '',
        end: ''
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
    isDisabledDatePicker () {
      return !this.isEditor || this.isLoading || this.modalType.disabledForm
    },
    isDisabledModal () {
      return !this.isEditor || !this.isSelectedDate
    },
    seriesRules () {
      return [SERIES_RULES.required, SERIES_RULES.length]
    },
    numberRules () {
      return [NUMBER_RULES.required, NUMBER_RULES.length]
    },
    isSelectedDate () {
      return this.formRegistrationDate.start || this.formRegistrationDate.end
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
        method = this.addRegistrationDate
      } else if (this.mode === MODE.EDIT) {
        method = this.editRegistrationDate
      } else {
        method = this.removeRegistrationDate
      }

      const alert = DATE_ALERT_MAPPING[this.mode]

      this.startEditData(method, alert)
    },
    changeHandler (dates) {
      this.formRegistrationDate.start = dates[0] ?? ''
      this.formRegistrationDate.end = dates[1] ?? ''
    },
    initFormData () {
      if (this.mode === MODE.ADD) {
        this.formRegistrationDate.start = ''
        this.formRegistrationDate.end = ''
      } else {
        this.formRegistrationDate.start = this.registrationDate.start
        this.formRegistrationDate.end = this.registrationDate.end
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
    async addRegistrationDate () {
      const startDate = this.formRegistrationDate.start ? Date.parse(this.formRegistrationDate.start) : 0
      const endDate = this.formRegistrationDate.end ? Date.parse(this.formRegistrationDate.end) : 0

      const params = {
        address: this.contractAddress,
        abi: this.abi,
        provider: this.httpProvider,
        signer: this.signer,
        vin: this.vin,
        start: startDate / 1000,
        end: endDate / 1000,
      }

      return addRegistrationDateAPI(params)
    },
    async editRegistrationDate () {
      const startDate = this.formRegistrationDate.start ? Date.parse(this.formRegistrationDate.start) : 0
      const endDate = this.formRegistrationDate.end ? Date.parse(this.formRegistrationDate.end) : 0

      const params = {
        address: this.contractAddress,
        abi: this.abi,
        provider: this.httpProvider,
        signer: this.signer,
        vin: this.vin,
        index: this.registrationDate.index,
        start: startDate / 1000,
        end: endDate / 1000,
      }

      return editRegistrationDateAPI(params)
    },
    async removeRegistrationDate () {
      const params = {
        address: this.contractAddress,
        abi: this.abi,
        provider: this.httpProvider,
        signer: this.signer,
        vin: this.vin,
        index: this.registrationDate.index,
      }

      return removeRegistrationDateAPI(params)
    }
  },
}
</script>