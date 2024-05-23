<template>
  <div>
    <CarSearch 
      :abi="abi"
      :provider="provider"
      :contractAddress="contractAddress"
    />
  </div>
</template>

<script>
import CarSearch from '@/components/CarSearch.vue'

export default {
  components: { CarSearch },
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
  }
}
</script>
