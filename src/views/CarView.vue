<template>
  <div>
    <CarInfo 
      :vin="carVin"
      :abi="abi"
      :provider="provider"
      :contractAddress="contractAddress"
    />
  </div>
</template>

<script>
import CarInfo from '@/components/CarInfo/CarInfo.vue';

export default {
  components: { CarInfo },
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
      required: true,
    },
  },
  computed: {
    carVin () {
      return this.$route.params?.vin
    }
  }
}
</script>

<style>

</style>