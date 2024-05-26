<template>
  <PanelTemplate
    title="Даты регистраций"
    :error="error"
    :loading="isLoading"
  >
    <ListItems
      title="Регистрация"
      :items="registrationDatesListItems"
      @edit="editHandler"
      @remove="removeHandler"
    >
      <template #actions>
        <EditRegistrationDate
          ref="editRegistrationDate"
          :registrationDate="selectedDate"
          :mode="mode"
          :vin="vin"
          @success="refreshData"
        />
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
import EditRegistrationDate from './EditRegistrationDate.vue'

import { getRegistrationDates as getRegistrationDatesAPI } from '@/libs/api'

import { MODE } from '@/constants'

import { formatDate } from '@/libs/utils'

import { mapState } from 'vuex';

export default {
  components: { PanelTemplate, ListItems, EditRegistrationDate },
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
      selectedDate: undefined,
      registrationsDates: [],
      error: null,
    }
  },
  computed: {
    ...mapState({
      httpProvider: 'httpProvider',
      abi: 'abi',
      contractAddress: 'contractAddress'
    }),
    registrationDatesListItems () {
      return this.registrationsDates.map((registrationDates) => {
        const listItems = []

        if (registrationDates.start) {
          listItems.push(`С: ${registrationDates.start}`)
        }
        if (registrationDates.end) {
          listItems.push(`По: ${registrationDates.end}`)
        }

        const item = {
          subtitles: listItems,
          editable: true,
          removable: true
        }
        
        return item
      })
    }
  },
  methods: {
    init () {
      this.initRegistrationDates()
    },
    addHandler () {
      this.mode = MODE.ADD

      this.$refs.editRegistrationDate.openDialog()
    },
    editHandler (index) {
      this.mode = MODE.EDIT

      this.initSelectedDate(index)

      this.$refs.editRegistrationDate.openDialog()
    },
    removeHandler (index) {
      this.mode = MODE.REMOVE

      this.initSelectedDate(index)

      this.$refs.editRegistrationDate.openDialog()
    },
    initSelectedDate (index) {
      this.selectedDate = {
        ...this.registrationsDates[index],
        index
      }
    },
    refreshData () {
      this.registrationsDates = []

      this.init ()
    },
    async initRegistrationDates () {
      this.isLoading = true

      const params = {
        address: this.contractAddress,
        abi: this.abi,
        provider: this.httpProvider,
        vin: this.vin.toUpperCase(),
      }

      try {
        const registrationDatesArray = await getRegistrationDatesAPI(params)

        if (registrationDatesArray.length === 0) {
          this.error = {
            type: 'info',
            text: 'Не найдено дат регистраций по заданному VIN'
          }
        }

        registrationDatesArray.forEach(registrationDate => {
          const date = {}

          const start = registrationDate?.[0];
          if (start && Number(start) !== 0) {
            date.start = formatDate(new Date(Number(start) * 1000))
          } else {
            date.start = ''
          }

          const end = registrationDate?.[1];
          if (end && Number(end) !== 0) {
            date.end = formatDate(new Date(Number(end) * 1000))
          } else {
            date.end = ''
          }

          this.registrationsDates.push(date)
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