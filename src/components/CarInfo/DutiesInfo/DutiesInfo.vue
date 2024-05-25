<template>
  <PanelTemplate 
    v-if="true"
    title="Пошлины"
    :error="error"
    :loading="isLoading"
  >
    <ListItems
      :items="dutiesListItems"
      @edit="editHandler"
      @remove="removeHandler"
    >
      <template #actions>
        <PayDuties
          v-if="totalAmount != 0"
          :amount="totalAmount" 
          :vin="vin" 
          :abi="abi" 
          :contractAddress="contractAddress" 
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
import { 
  getCarDuties as getCarDutiesAPI, 
  getAmountDuty as getAmountDutyAPI, 
  getTotalAmountDuties as getTotalAmountAPI 
} from '@/libs/api'

import { formatEther } from 'ethers'
import { DUTIES_DESCRIPTION } from '@/constants'

import PayDuties from '@/components/CarInfo/DutiesInfo/PayDuties.vue'
import PanelTemplate from '@/components/elements/PanelTemplate.vue'
import ListItems from '@/components/elements/ListItems.vue'

export default {
  components: { PayDuties, PanelTemplate, ListItems },
  props: {
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
      duties: [],
      totalAmount: 0,
      error: null,
      isLoading: true
    }
  },
  computed: {
    dutiesListItems () {
      const duties = this.duties.map((duty) => {
        const item = {} 
        if (duty.name) {
          item.title = duty.name
        }

        item.subtitles = (duty.amount ? [`${duty.amount} eth`] : [])

        return item
      })

      if (duties.length !== 0) {
        duties.push({ 
          title: 'Всего',
          subtitles: [`${this.totalAmount} eth`],
          disabled: true
        })
      }

      return duties
    }
  },
  methods: {
    async init () {
      this.isLoading = true
      this.error = null

      try {
        await Promise.all([
          this.initDuties(),
          this.initTotalAmount()
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
    addHandler () {
      console.log('add event');
    },
    editHandler (index) {
      console.log('edit event', index);
    },
    removeHandler (index) {
      console.log('remove event', index);
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
        name: DUTIES_DESCRIPTION[duty],
        amount
      })
    },
    async getDuties () {
      const params = {
        address: this.contractAddress,
        abi: this.abi,
        provider: this.provider,
        vin: this.vin.toUpperCase(),
      }

      return getCarDutiesAPI(params)
    },
    async getAmountDuty (duty) {
      const params = {
        address: this.contractAddress,
        abi: this.abi,
        provider: this.provider,
        duty
      }
      const amount = await getAmountDutyAPI(params)

      return formatEther(amount)
    },
    async getTotalAmount () {
      const params = {
        address: this.contractAddress,
        abi: this.abi,
        provider: this.provider,
        vin: this.vin.toUpperCase(),
      }

      const totalAmount = await getTotalAmountAPI(params)

      return formatEther(totalAmount)
    },
  },
  created () {
    this.init()
  }
}
</script>