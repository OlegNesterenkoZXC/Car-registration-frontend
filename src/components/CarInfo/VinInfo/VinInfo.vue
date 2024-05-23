<template>
  <PanelTemplate 
    title="Об автомобиле"
    :error="error"
    :loading="isLoading"
  >
    <ListItems
      :items="vinInfoListItems"
    />
  </PanelTemplate>
</template>

<script>
import ListItems from '@/components/elements/ListItems.vue'
import PanelTemplate from '@/components/elements/PanelTemplate.vue'
import { getVinInfo as getVinInfoAPI } from '@/libs/api'

export default {
  components: { PanelTemplate, ListItems },
  props: {
    vin: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      isLoading: true,
      error: null,
      vinInfo: null
    }
  },
  computed: {
    vinInfoListItems () {
      const items = []

      const name = this.vinInfo?.make?.name
      const model = this.vinInfo?.model?.name
      if (model && name) {
        items.push({
          title: 'Модель',
          subtitles: [`${name} ${model}`],
          disabled: true
        })
      }

      const type = this.vinInfo?.categories?.market
      if (type) {
        items.push({
          title: 'Тип',
          subtitles: [type],
          disabled: true
        })
      }

      const horsepower = this.vinInfo?.engine?.horsepower
      if (horsepower) {
        items.push({
          title: 'Мощность',
          subtitles: [`${horsepower} л.с.`],
          disabled: true
        })
      }

      const engineSize = this.vinInfo?.engine?.size
      if (engineSize) {
        items.push({
          title: 'Объём двигателя',
          subtitles: [`${engineSize} л.`],
          disabled: true
        })
      }

      const transmission = this.vinInfo?.transmission?.transmissionType
      if (transmission) {
        items.push({
          title: 'Объём двигателя',
          subtitles: [transmission],
          disabled: true
        })
      }

      return items
    }
  },
  methods: {
    async init () {
      this.isLoading = true

      try {
        const carInfo = await this.getVinInfo()

        if (carInfo.error) {
          throw new Error(carInfo.error.message)
        }

        this.vinInfo = carInfo
      } catch (error) {
        console.error(error)

        this.error = {
          type: 'error',
          text: 'Не удалось получить информацию о VIN номере',
        }
      } finally {
        this.isLoading = false
      }
    },
    async getVinInfo () {
      return getVinInfoAPI(this.vin)
    }
  },
  created () {
    this.init()
  }
}
</script>

