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

    <v-form :disabled="isDisabledForm">
      <v-select
        v-model="select"
        item-text="name"
        item-value="code"
        item-disabled="disabled"
        :items="selectItems"
      />
    </v-form>
  </EditPanelTemplate>
</template>

<script>
import EditPanelTemplate from '@/components/CarInfo/EditPanelTemplate.vue'

import {
  addCarDuty as addCarDutyAPI,
  removeCarDuty as removeCarDutyAPI,
} from '@/libs/api'

import { MODE, ALERT_TYPE, DUTIES_DESCRIPTION } from '@/constants';
import { mapState } from 'vuex';

const MODAL_TYPE_MAPPING = {
  [MODE.ADD]: {
    title: 'Назначение пошлины для ТС',
    confirmButton: 'Добавить',
    disabledForm: false,
  },
  [MODE.REMOVE]: {
    title: 'Удаление пошлины у ТС',
    confirmButton: 'Удалить',
    disabledForm: true,
  }
}

const DUTY_ALERT_MAPPING = {
  [MODE.ADD]: {
    type: 'error',
    text: 'Не удалось назначить пошлину',
  },
  [MODE.REMOVE]: {
    type: 'error',
    text: 'Не удалось удалить пошлину',
  }
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
    dutyList: {
      type: Array,
      required: true
    },
    selectedDuty: {
      type: String,
      default: ''
    },
    assignedDuties: {
      type: Array,
      default: []
    }
  },
  data () {
    return {
      isEditor: false,
      isLoading: false,
      select: '',
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
    selectItems () {
      const toObjectDuties = (duty) => {
        return {
          name: DUTIES_DESCRIPTION[duty],
          code: duty,
          disabled: true
        }
      }

      if (this.mode === MODE.REMOVE) {
        this.select = this.selectedDuty
        return this.assignedDuties.map(toObjectDuties)
      }

      const duties = this.dutyList.map(toObjectDuties)

      if (this.assignedDuties?.length) {
        const dutiesWithDisabled = duties.map(duty => {
          return {
            ...duty,
            disabled: this.assignedDuties.includes(duty.code)
          }
        })
        return dutiesWithDisabled
      }

      return duties
    },
    modalType () {
      return MODAL_TYPE_MAPPING[this.mode]
    },
    isDisabledForm () {
      return !this.isEditor || this.isLoading || this.modalType.disabledForm || !this.selectItems?.length
    },
    isDisabledModal () {
      return !this.isEditor || !this.select
    },
  },
  methods: {
    openDialog () {
      this.alert = null
      this.$refs.editTemplatePanel.openDialog()
    },
    confirmHandler () {
      let method = null
      if (this.mode === MODE.ADD) {
        method = this.addCarDuty
      } else {
        method = this.removeCarDuty
      }

      const alert = DUTY_ALERT_MAPPING[this.mode]

      this.startEditData(method, alert)
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
    async addCarDuty () {
      const params = {
        address: this.contractAddress,
        abi: this.abi,
        provider: this.httpProvider,
        signer: this.signer,
        vin: this.vin,
        duty: this.select
      }

      return addCarDutyAPI(params)
    },
    async removeCarDuty () {
      const params = {
        address: this.contractAddress,
        abi: this.abi,
        provider: this.httpProvider,
        signer: this.signer,
        vin: this.vin,
        duty: this.select
      }

      return removeCarDutyAPI(params)
    },
  },
}
</script>