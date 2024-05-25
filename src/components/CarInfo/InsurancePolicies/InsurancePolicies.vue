<template>
  <PanelTemplate
    title="Полисы обязательного страхования"
    :error="error"
    :loading="isLoading"
  >
    <ListItems
      title="Полис"
      :items="listItemsPolicies"
      @edit="editHandler"
      @remove="removeHandler"
    >
      <template #actions>
        <EditInsurancePolicy
          ref="editInsurancePolice"
          :insurancePolicy="selectedPolicy"
          :mode="mode"
          :vin="vin"
          :abi="abi"
          :provider="provider"
          :contractAddress="contractAddress"
          @add="addHandler"
          @success="refreshData"
        />
      </template>
    </ListItems>
  </PanelTemplate>
</template>

<script>
import ListItems from '@/components/elements/ListItems.vue'
import ListMenu from '@/components/elements/ListMenu.vue'
import EditInsurancePolicy from "@/components/CarInfo/InsurancePolicies/EditInsurancePolicy.vue";
import PanelTemplate from '@/components/elements/PanelTemplate.vue'

import { getInsurancePolicies as getInsurancePoliciesAPI } from '@/libs/api'
import { MODE } from '@/constants'

export default {
  components: { ListMenu, ListItems, PanelTemplate, EditInsurancePolicy },
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
      mode: MODE.ADD,
      selectedPolicy: undefined,
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
    refreshData () {
      this.insurancePolices = []

      this.init()
    },
    addHandler () {
      this.mode = MODE.ADD
    },
    editHandler (index) {
      this.mode = MODE.EDIT

      this.initEditDialog(index)
    },
    removeHandler (index) {
      this.mode = MODE.REMOVE

      this.initEditDialog(index)
    },
    initEditDialog (index) {
      this.selectedPolicy = {
        ...this.insurancePolices[index],
        index
      }

      this.$refs.editInsurancePolice.openDialog()
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