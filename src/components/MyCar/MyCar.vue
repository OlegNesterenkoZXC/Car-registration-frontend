<template>
  <div>
    <v-overlay v-if="isLoading">
      <v-progress-circular indeterminate size="64" />
    </v-overlay>
    <v-container v-else>
      <v-row>
        <v-col v-if="error" cols="12">
          <v-alert text prominent :type="error.type">
            {{ error.text }}
          </v-alert>
        </v-col>
        <v-col v-else>
          <CarCard
            :carInfo="carInfo"
            :vin="vin"
          >
            <InsurancePolices
              :vin="vin" 
              :abi="abi" 
              :provider="provider" 
              :contractAddress="contractAddress" 
            />
            <VehiclePassports
              :vin="vin" 
              :abi="abi" 
              :provider="provider" 
              :contractAddress="contractAddress" 
            />
            <RegistrationDates
              :vin="vin" 
              :abi="abi" 
              :provider="provider" 
              :contractAddress="contractAddress" 
            />
            <MyDuties 
              :vin="vin" 
              :abi="abi" 
              :provider="provider" 
              :contractAddress="contractAddress" 
            />
          </CarCard>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import CarCard from "@/elements/CarCard.vue";
import MyDuties from "./MyDuties/MyDuties.vue"

import { isExistsCar as isExistsCarAPI, getVinInfo as getVinInfoAPI } from '@/libs/api'
import InsurancePolices from "./InsurancePolices/InsurancePolices.vue";
import VehiclePassports from "./VehiclePassports/VehiclePassports.vue";
import RegistrationDates from "./RegistrationDates/RegistrationDates.vue";

export default {
  components: { CarCard, MyDuties, InsurancePolices, VehiclePassports, RegistrationDates },
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
      carInfo: null,
      error: null
    }
  },
  computed: {
    isValidProps () {
      return this.contractAddress && this.provider && this.abi
    },
  },
  watch: {
    isValidProps: {
      immediate: true,
      handler (value) {

        if (value) {
          this.init()
        }
      }
    }
  },
  methods: {
    async init() {
      const isExistsCar = await this.fetchExistingCar()


      if (!isExistsCar) {
        this.error = {
          type: 'info',
          text: 'Не найдено записей по этому VIN',
        }

        this.isLoading = false
        return
      }

      //await this.initVinInfo()
      
    },
    async fetchExistingCar () {
      this.isLoading = true

      const params = {
        address: this.contractAddress,
        abi: this.abi,
        provider: this.provider,
        vin: this.vin.toUpperCase(),
      }

      try {
        return isExistsCarAPI(params)
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
    async initVinInfo() {
      try {
        this.carInfo = await getVinInfoAPI(this.vin)
      } catch (error) {
        
      }
    }
  },
}
</script>