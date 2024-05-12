<template>
  <v-expansion-panel>
    <v-expansion-panel-header>
      Даты регистраций
    </v-expansion-panel-header>
    <v-expansion-panel-content>
      <v-progress-linear 
        v-if="isLoading"
        indeterminate
      />
      <div
        v-else-if="registrationDates.length !== 0"
      >
        <v-list-item 
         v-for="registrationDate, index in registrationDates" :key="index"
          two-line
        >
          <v-list-item-content>
            <v-list-item-title>Регистрация</v-list-item-title>
            <v-list-item-subtitle 
              v-if="registrationDate.start" 
            >
              С: {{ registrationDate.start }}
            </v-list-item-subtitle>
            <v-list-item-subtitle
              v-if="registrationDate.end" 
            >
              По: {{ registrationDate.end }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </div>
      <v-alert
        v-if="error"
        prominent
        text
        :type="error.type"
      >
        {{ error.text }}
      </v-alert>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
import { getRegistrationDates as getRegistrationDatesAPI } from '@/libs/api'
import { formatDate } from '@/libs/utils';

export default {
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
      registrationDates: [],
      error: null,
    }
  },
  methods: {
    init () {
      this.initRegistrationDates()
    },
    async initRegistrationDates () {
      this.isLoading = true

      const params = {
        address: this.contractAddress,
        abi: this.abi,
        provider: this.provider,
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
          }

          const end = registrationDate?.[1];
          if (end && Number(end) !== 0) {
            date.end = formatDate(new Date(Number(end) * 1000))
          }

          this.registrationDates.push(date)
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
  mounted () {
    this.init()
  }
}
</script>