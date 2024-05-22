<template>
  <PanelTemplate 
    v-if="true"
    title="Полисы обязательного страхования"
    :error="error"
    :loading="isLoading"
  >
    <ListItems
      title="Серия"
      :items="listItemsPolicies"
      @add="addHandler"
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
import ListMenu from '@/components/elements/ListMenu.vue'
import PanelTemplate from '@/components/elements/PanelTemplate.vue';
import { getInsurancePolicies as getInsurancePoliciesAPI } from '@/libs/api'

export default {
  components: { ListMenu, ListItems, PanelTemplate },
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
      insurancePolices: [],
      selectedItem: undefined,
      error: null,
    }
  },
  computed: {
    listItemsPolicies () {
      return this.insurancePolices.map((policy) => {
        const listItem = []
        if (policy.series) {
          listItem.push(`Серия: ${policy.series}`)
        }

        if (policy.number) {
          listItem.push(`Номер: ${policy.number}`)
        }

        return { subtitles: listItem }
      })
    }
  },
  methods: {
    init () {
      this.initInsurancePolices()
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
    async initInsurancePolices () {
      this.isLoading = true

      const params = {
        address: this.contractAddress,
        abi: this.abi,
        provider: this.provider,
        vin: this.vin.toUpperCase(),
      }

      try {
        const insurancePolicesArray = await getInsurancePoliciesAPI(params)

        if (insurancePolicesArray.length === 0) {
          this.error = {
            type: 'info',
            text: 'Не найдено полисов по заданному VIN'
          }
        }

        insurancePolicesArray.forEach(insurancePolice => {
          this.insurancePolices.push({
            series: insurancePolice?.[0],
            number: insurancePolice?.[1],
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