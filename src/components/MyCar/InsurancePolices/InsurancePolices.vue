<template>
  <v-expansion-panel>
    <v-expansion-panel-header>
      Полисы обязательного страхования
    </v-expansion-panel-header>
    <v-expansion-panel-content>
      <v-progress-linear 
        v-if="isLoading"
        indeterminate
      />
      <div
        v-else-if="insurancePolices.length !== 0"
      >
        <v-list-item 
         v-for="insurancePolice, index in insurancePolices" :key="index"
          two-line
        >
          <v-list-item-content>
            <v-list-item-title>Полис</v-list-item-title>
            <v-list-item-subtitle>Серия: {{ insurancePolice.series }}</v-list-item-subtitle>
            <v-list-item-subtitle>Номер: {{ insurancePolice.number }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </div>
      <v-alert
        v-if="error"
        prominent
        text
        :type="error.type"
      >
        {{ error.text }}
      </v-alert>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
import { getInsurancePolices as getInsurancePolicesAPI } from '@/libs/api'

export default {
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
      isLoading: true,
      insurancePolices: [],
      error: null,
    }
  },
  methods: {
    init () {
      this.initInsurancePolices()
    },
    async initInsurancePolices () {
      this.isLoading = true

      const params = {
        address: this.contractAddress,
        abi: this.abi,
        provider: this.provider,
        vin: this.vin.toUpperCase(),
      }

      try {
        const insurancePolicesArray = await getInsurancePolicesAPI(params)

        if (insurancePolicesArray.length === 0) {
          this.error = {
            type: 'info',
            text: 'Не найдено полисов по заданному VIN'
          }
        }

        insurancePolicesArray.forEach(insurancePolice => {
          this.insurancePolices.push({
            series: insurancePolice?.[0],
            number: insurancePolice?.[1],
          })
        });

      } catch (error) {
        console.error(error)

        this.error = {
          type: 'error',
          text: 'Не удалось получить запись',
        }
      } finally {
        this.isLoading = false
      }
    }
  },
  mounted () {
    this.init()
  }
}
</script>