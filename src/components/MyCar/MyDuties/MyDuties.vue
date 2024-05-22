<template>
  <PanelTemplate 
    v-if="true"
    title="Пошлины"
    :error="error"
    :loading="false"
  >
    <ListItems
      title="Пошлина"
      :items="dutiesListItems"
      @add="addHandler"
      @edit="editHandler"
      @remove="removeHandler"
    >
      <template #actions>
        <PayDuties 
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

import PayDuties from './PayDuties.vue'
import PanelTemplate from '@/components/elements/PanelTemplate.vue';
import ListItems from '@/components/elements/ListItems.vue';

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
      totalAmount: -1,
      error: null
    }
  },
  computed: {
    dutiesListItems () {
      const duties = this.duties.map((duty) => {
        const items = []
        if (duty.name) {
          items.push(duty.name)
        }
        if (duty.amount) {
          items.push(duty.amount)
        }

        return { subtitles: items }
      })

      duties.push({ subtitles: [
        `Всего: ${this.totalAmount} eth`
      ]})

      return duties
    }
  },
  methods: {
    init () {
      this.initDuties()
      this.initTotalAmount()
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
      this.totalAmount = -1

      this.init()
    },
    async initDuties () {
      const params = {
        address: this.contractAddress,
        abi: this.abi,
        provider: this.provider,
        vin: this.vin.toUpperCase(),
      }

      try {
        const dutiesArray = await getCarDutiesAPI(params)

        dutiesArray.forEach((duty) => {
          this.pushDuty(duty)
        })
      } catch (error) {
        console.error(error)

        this.error = {
          type: 'error',
          text: 'Не удалось получить запись',
        }
      }
    },
    async pushDuty (duty) {
      const amount = await this.getAmountDuty(duty)

      this.duties.push({
        name: DUTIES_DESCRIPTION[duty],
        amount
      })

    },
    async getAmountDuty (duty) {
      const params = {
        address: this.contractAddress,
        abi: this.abi,
        provider: this.provider,
        duty
      }

      try {
        const amount = await getAmountDutyAPI(params)

        return formatEther(amount);
        
      } catch (error) {
        console.error(error);
      }
    },
    async initTotalAmount () {
      const params = {
        address: this.contractAddress,
        abi: this.abi,
        provider: this.provider,
        vin: this.vin.toUpperCase(),
      }

      try {
        const totalAmount = await getTotalAmountAPI(params)


        this.totalAmount = formatEther(totalAmount)
      } catch (error) {
        console.error(error);
      }
    }
  },
  mounted () {
    this.init()
  }
}
</script>