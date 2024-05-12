<template>
  <v-card>
    <v-card-title>Информация об автомобиле</v-card-title>
    <v-card-subtitle>VIN: {{ vin }}</v-card-subtitle>
    <v-card-text v-if="carInfo">
      <div>Модель: {{ carName }} {{ modelName }}</div>
      <div>Тип: {{ carType }}</div>
      <div>Мощность: {{ carHorsePower }} л.с.</div>
      <div>Объём: {{ carEngineSize }} л.</div>
      <div>Трансмиссия: {{ carTransmission }}</div>
    </v-card-text>
    <v-card-text v-else>
      <v-progress-linear indeterminate />
    </v-card-text>
    <v-card-text>
      <v-expansion-panels>
        <slot>

        </slot>
      </v-expansion-panels>
    </v-card-text>
  </v-card>

</template>

<script>
export default {
  props: {
    carInfo: {
      type: Object,
      default: null
    },
    vin: {
      type: String,
      default: ''
    }
  },
  computed: {
    carName () {
      return this.carInfo?.make?.name ?? 'Автомобиль'
    },
    modelName () {
      return this.carInfo?.model?.name ?? ''
    },
    carHorsePower () {
      return this.carInfo?.engine?.horsepower ?? ''
    },
    carEngineSize () {
      return this.carInfo?.engine?.size
    },
    carType () {
      return this.carInfo?.categories?.market ?? ''
    },
    carTransmission () {
      return this.carInfo?.transmission?.transmissionType ?? ''
    }
  }
}
</script>