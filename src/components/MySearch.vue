<template>
  <v-container>
    <v-row>
      <v-col cols="8">
        <v-text-field
          counter="17"
          hint="VIN"
          persistent-hint
          clearable
          outlined
          solo
          :disabled="isLoading"
        />
      </v-col>
      <v-col cols="4">
        <v-btn 
          color="primary" 
          x-large
          :loading="isLoading"
          :disabled="isLoading"
          @click="handler"
        >
          Найти
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { Contract, ethers, formatUnits } from 'ethers'
import { BrowserProvider, parseUnits } from 'ethers'

import { getDutiesSize } from '@/libs/api'

export default {
  props: {
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
      required: true
    },
  },
  data () {
    return {
      isLoading: false
    }
  },
  methods: {
    async handler () {
      const params = {
        address: this.contractAddress,
        abi: this.abi,
        provider: this.provider,
        vin: '1234'
      }

      console.log(Number(await getDutiesSize(params)));
    }
  }
}
</script>

<style lang="scss" scoped>

</style>