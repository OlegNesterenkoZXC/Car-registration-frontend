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

        <EditVehiclePassport
          ref="editVehiclePassport"
          :mode="mode"
          :vin="vin"
          :vehiclePassport="selectedVehiclePassport"
          @success="refreshData"
        />
      </template>
    </ListItems>
  </PanelTemplate>
</template>

<script>
import ListItems from '@/components/elements/ListItems.vue'
import PanelTemplate from '@/components/elements/PanelTemplate.vue'
import EditVehiclePassport from '@/components/CarInfo/VehiclePassports/EditVehiclePassport.vue';

import { mapState } from 'vuex';
import { getVehiclePassports as getVehiclePassportsAPI } from '@/libs/api'
import { MODE } from '@/constants';

export default {
  components: { PanelTemplate, ListItems, EditVehiclePassport },
  props: {
    vin: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      isLoading: true,
      mode: MODE.ADD,
      vehiclePassports: [],
      selectedVehiclePassport: null,
      error: null,
    }
  },
  computed: {
    ...mapState({
      httpProvider: 'httpProvider',
      abi: 'abi',
      contractAddress: 'contractAddress'
    }),
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
    refreshData () {
      this.vehiclePassports = []

      this.init()
    },
    addHandler () {
      this.mode = MODE.ADD

      this.$refs.editVehiclePassport.openDialog()
    },
    editHandler (index) {
      this.mode = MODE.EDIT
      
      this.setSelectedPassport(index)
      
      this.$refs.editVehiclePassport.openDialog()
    },
    removeHandler (index) {
      this.mode = MODE.REMOVE

      this.setSelectedPassport(index)

      this.$refs.editVehiclePassport.openDialog()
    },
    setSelectedPassport (index) {
      this.selectedVehiclePassport = {
        ...this.vehiclePassports[index],
        index
      }
    },
    async initVehiclePassports () {
      this.isLoading = true

      const params = {
        address: this.contractAddress,
        abi: this.abi,
        provider: this.httpProvider,
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