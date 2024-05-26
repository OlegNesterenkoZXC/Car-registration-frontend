<template>
  <PanelTemplate
    title="Пошлины"
    :error="error"
    :loading="isLoading"
  >
    <ListItems
      :items="dutiesListItems"
      @remove="removeHandler"
    >
      <template #actions>
        <PayDuties
          v-if="totalAmount != 0"
          :amount="totalAmount" 
          :vin="vin"
          @success="refreshData" 
        />

        <EditCarDuty
          ref="editCarDuty"
          :mode="mode"
          :vin="vin"
          :selectedDuty="selectedDuty"
          :dutyList="dutiesList"
          :assignedDuties="assignedDuties"
          @success="refreshData"
        />

        <v-btn
          fab
          small
          class="ma-4" 
          color="primary"
          @click="addHandler"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </template>
    </ListItems>

    <template #alert>
      <v-alert
        v-if="totalAmount == 0"
        prominent
        text
        type="success"
      >
        Все пошлины оплачены
      </v-alert>
    </template>
  </PanelTemplate>
</template>

<script>
import PayDuties from '@/components/CarInfo/DutiesInfo/PayDuties.vue'
import PanelTemplate from '@/components/elements/PanelTemplate.vue'
import ListItems from '@/components/elements/ListItems.vue'
import EditCarDuty from '@/components/CarInfo/DutiesInfo/EditCarDuty.vue'

import { 
  getDutiesList as getDutiesListAPI,
  getCarDuties as getCarDutiesAPI, 
  getAmountDuty as getAmountDutyAPI, 
  getTotalAmountDuties as getTotalAmountAPI 
} from '@/libs/api'

import { formatEther } from '@/libs/utils'
import { DUTIES_DESCRIPTION, MODE } from '@/constants'
import { mapState } from 'vuex'

export default {
  components: { PayDuties, PanelTemplate, ListItems, EditCarDuty },
  props: {
    vin: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      isLoading: true,
      mode: MODE.ADD,
      selectedDuty: null,
      dutiesList: [],
      duties: [],
      totalAmount: 0,
      error: null,
    }
  },
  computed: {
    ...mapState({
      httpProvider: 'httpProvider',
      abi: 'abi',
      contractAddress: 'contractAddress'
    }),
    assignedDuties () {
      return this.duties.map(duty => duty.name)
    },
    dutiesListItems () {
      const duties = this.duties.map((duty) => {
        const item = {} 
        if (duty.name) {
          item.title = DUTIES_DESCRIPTION[duty.name]
        }

        item.subtitles = (duty.amount ? [`${duty.amount} eth`] : [])

        item.removable = true

        return item
      })

      if (duties.length !== 0) {
        duties.push({ 
          title: 'Всего',
          subtitles: [`${this.totalAmount} eth`]
        })
      }

      return duties
    }
  },
  methods: {
    addHandler () {
      this.mode = MODE.ADD

      this.$refs.editCarDuty.openDialog()
    },
    removeHandler (index) {
      this.mode = MODE.REMOVE

      this.selectedDuty = this.duties[index].name
      this.$refs.editCarDuty.openDialog()
    },
    async init () {
      this.isLoading = true
      this.error = null

      try {
        await Promise.all([
          this.initDuties(),
          this.initTotalAmount(),
          this.initDutiesList()
        ])
      } catch (error) {
        console.error(error)

        this.error = {
          type: 'error',
          text: 'Не удалось получить запись',
        }
      } finally {
        this.isLoading = false
      }
    },
    refreshData () {
      this.duties = []
      this.totalAmount = 0

      this.init()
    },
    async initDuties () {
      const dutiesArray = await this.getDuties()

      dutiesArray.forEach((duty) => {
        this.pushDuty(duty)
      })
    },
    async initTotalAmount () {
      this.totalAmount = await this.getTotalAmount()
    },
    async pushDuty (duty) {
      const amount = await this.getAmountDuty(duty)

      this.duties.push({
        name: duty,
        amount
      })
    },
    async initDutiesList () {
      this.dutiesList = await this.getDutiesList()
    }, 
    async getDuties () {
      const params = {
        address: this.contractAddress,
        abi: this.abi,
        provider: this.httpProvider,
        vin: this.vin,
      }

      return getCarDutiesAPI(params)
    },
    async getAmountDuty (duty) {
      const params = {
        address: this.contractAddress,
        abi: this.abi,
        provider: this.httpProvider,
        duty
      }
      const amount = await getAmountDutyAPI(params)

      return formatEther(amount)
    },
    async getTotalAmount () {
      const params = {
        address: this.contractAddress,
        abi: this.abi,
        provider: this.httpProvider,
        vin: this.vin,
      }

      const totalAmount = await getTotalAmountAPI(params)

      return formatEther(totalAmount)
    },
    async getDutiesList () {
      const params = {
        address: this.contractAddress,
        abi: this.abi,
        provider: this.httpProvider
      }

      return getDutiesListAPI(params)
    }
  },
  created () {
    this.init()
  }
}
</script>