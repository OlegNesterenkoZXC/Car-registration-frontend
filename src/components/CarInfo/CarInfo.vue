<template>
  <CarCard
    :vin="vin"
    :loading="isLoading"
    :error="error"
  >
    <VinInfo :vin="vin" />
    <InsurancePolicies :vin="vin" />
    <VehiclePassports :vin="vin" />
    <RegistrationDates :vin="vin" />
    <DutiesInfo :vin="vin" />
  </CarCard>
</template>

<script>
import { isExistCar as isExistsCarAPI } from '@/libs/api'
import { mapState } from 'vuex'

import CarCard from "@/components/elements/CarCard.vue"
import VinInfo from '@/components/CarInfo/VinInfo/VinInfo.vue'
import InsurancePolicies from "@/components/CarInfo/InsurancePolicies/InsurancePolicies.vue"
import VehiclePassports from "@/components/CarInfo/VehiclePassports/VehiclePassports.vue"
import RegistrationDates from "@/components/CarInfo/RegistrationDates/RegistrationDates.vue"
import DutiesInfo from "@/components/CarInfo/DutiesInfo/DutiesInfo.vue"

export default {
  components: { 
    CarCard,
    VinInfo,
    DutiesInfo, 
    InsurancePolicies, 
    VehiclePassports, 
    RegistrationDates 
  },
  props: {
    vin: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      isLoading: true,
      carInfo: null,
      error: null
    }
  },
  computed: {
    ...mapState({
      httpProvider: 'httpProvider',
      abi: 'abi',
      contractAddress: 'contractAddress'
    })
  },
  methods: {
    async init () {
      this.isLoading = true

      try {
        const isExistCar = await this.isExistsCar()

        if (!isExistCar) {
          this.error = {
            type: 'info',
            text: 'Не найдено записей по этому VIN',
          }
        }
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
    async isExistsCar () {
      const params = {
        address: this.contractAddress,
        abi: this.abi,
        provider: this.httpProvider,
        vin: this.vin,
      }

      return isExistsCarAPI(params)
    }
  },
  created () {
    this.init()
  }
}
</script>