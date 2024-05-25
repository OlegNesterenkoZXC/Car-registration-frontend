<template>
  <PanelTemplate
    title="Паспорта транспортного средства"
    :error="error"
    :loading="isLoading"
  >
    <ListItems
      title="Паспорт"
      :items="vehiclePassportsListItems"
      @edit="editHandler"
      @remove="removeHandler"
    >
      <template #actions>
        <v-btn
          fab
          small
          class="ma-4" 
          color="primary"
          @click="addHandler"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </template>
    </ListItems>
  </PanelTemplate>
</template>

<script>
import ListItems from '@/components/elements/ListItems.vue'
import PanelTemplate from '@/components/elements/PanelTemplate.vue'
import { getVehiclePassports as getVehiclePassportsAPI } from '@/libs/api'

export default {
  components: { PanelTemplate, ListItems },
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
      vehiclePassports: [],
      error: null,
    }
  },
  computed: {
    vehiclePassportsListItems () {
      return this.vehiclePassports.map((vehiclePassport) => {
        const items = []

        if(vehiclePassport.region) {
          items.push(`Регион: ${vehiclePassport.region}`)
        }
        if(vehiclePassport.series) {
          items.push(`Серия: ${vehiclePassport.series}`)
        }
        if(vehiclePassport.number) {
          items.push(`Номер: ${vehiclePassport.number}`)
        }

        return { subtitles: items }
      })
    }
  },
  methods: {
    init () {
      this.initVehiclePassports()
    },
    addHandler () {
      console.log('add event');
    },
    editHandler (index) {
      console.log('edit event', index);
    },
    removeHandler (index) {
      console.log('remove event', index);
    },
    async initVehiclePassports () {
      this.isLoading = true

      const params = {
        address: this.contractAddress,
        abi: this.abi,
        provider: this.provider,
        vin: this.vin,
      }

      try {
        const vehiclePassportsArray = await getVehiclePassportsAPI(params)

        if (vehiclePassportsArray.length === 0) {
          this.error = {
            type: 'info',
            text: 'Не найдено ПТС по заданному VIN'
          }
        }

        vehiclePassportsArray.forEach(vehiclePassport => {
          this.vehiclePassports.push({
            region: vehiclePassport?.[0],
            series: vehiclePassport?.[1],
            number: vehiclePassport?.[2],
          })
        });

      } catch (error) {
        console.error(error)

        this.error = {
          type: 'error',
          text: 'Не удалось получить запись',
        }
      } finally {
        this.isLoading = false
      }
    }
  },
  created () {
    this.init()
  }
}
</script>