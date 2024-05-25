<template>
  <CarInfo :vin="carVin" />
</template>

<script>
import CarInfo from '@/components/CarInfo/CarInfo.vue';

export default {
  components: { CarInfo },
  computed: {
    carVin () {
      return this.$route.params?.vin
    }
  }
}
</script>
