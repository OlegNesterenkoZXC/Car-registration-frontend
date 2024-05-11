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
        <v-col>
          <CarCard>
            <MyDuties :vin="vin" :abi="abi" :provider="provider" :contractAddress="contractAddress" />
            <MyDuties :vin="vin" :abi="abi" :provider="provider" :contractAddress="contractAddress" />
          </CarCard>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import CarCard from "@/elements/CarCard.vue";
import MyDuties from "@/components/MyDuties.vue";

import { isExistsCar as isExistsCarAPI, getDuties as getDutiesAPI } from '@/libs/api'

export default {
  components: { CarCard, MyDuties },
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
      error: null
    }
  },
  computed: {
    isValidProps () {
      return this.contractAddress && this.provider && this.abi
    }
  },
  watch: {
    isValidProps: {
      immediate: true,
      handler (value) {
        if (value) {
          this.fetchExistingCar()
        }
      }
    }
  },
  methods: {
    async fetchExistingCar () {
      this.isLoading = true

      const params = {
        address: this.contractAddress,
        abi: this.abi,
        provider: this.provider,
        vin: this.vin.toUpperCase(),
      }

      try {
        const isExistsCar = await isExistsCarAPI(params)

        if (!isExistsCar) {
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
  },
}
</script>