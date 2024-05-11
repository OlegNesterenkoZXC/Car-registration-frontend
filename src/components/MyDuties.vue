<template>
  <v-expansion-panel>
    <v-expansion-panel-header>
      Пошлины
    </v-expansion-panel-header>
    <v-expansion-panel-content>
      <v-progress-circular 
        v-if="duties.length === 0"
        indeterminate size="64" 
      />
      <div
        v-else
      >
        <v-list-item 
         v-for="duty, index in duties" :key="index"
          two-line
        >
          <v-list-item-content>
            <v-list-item-title>{{ duty.name }}</v-list-item-title>
            <v-list-item-subtitle>{{ duty.amount }} eth</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>К оплате: {{ totalAmount }} eth</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <PayDuties />
      </div>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
import { 
  getDuties as getDutiesAPI, 
  getAmountDuty as getAmountDutyAPI, 
  getTotalAmountDuties as getTotalAmountAPI 
} from '@/libs/api'

import { formatEther } from 'ethers'
import { DUTIES_DESCRIPTION } from '@/constants'

import PayDuties from './PayDuties.vue'

export default {
  components: { PayDuties },
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
      totalAmount: 0
    }
  },
  methods: {
    async initDuties () {
      const params = {
        address: this.contractAddress,
        abi: this.abi,
        provider: this.provider,
        vin: this.vin.toUpperCase(),
      }

      try {
        const dutiesArray = await getDutiesAPI(params)

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
    this.initDuties()
    this.initTotalAmount()
  }
}
</script>