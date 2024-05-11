<template>
  <div>
    <MyCar 
      :vin="carVin"
      :abi="abi"
      :provider="provider"
      :contractAddress="contractAddress"
    />
  </div>
</template>

<script>
import MyCar from '@/components/MyCar.vue';


export default {
  components: { MyCar },
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