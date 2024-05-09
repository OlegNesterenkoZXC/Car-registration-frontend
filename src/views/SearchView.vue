<template>
  <div>
    <MySearch 
      :abi="abi"
      :provider="provider"
      :contractAddress="contractAddress"
    />
  </div>
</template>

<script>
import MySearch from '@/components/MySearch.vue'

export default {
  components: { MySearch },
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

<style lang="scss" scoped>

</style>
