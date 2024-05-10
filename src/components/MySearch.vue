<template>
  <v-container>
    <v-form 
      ref="form" 
      v-model="isValidForm"
    >
      <v-row>
        <v-col cols="8">
          <v-text-field
            counter="17"
            hint="VIN"
            persistent-hint
            clearable
            outlined
            solo
            :rules="[textFieldRules.required, textFieldRules.length, textFieldRules.vin]"
            :disabled="isLoading"
            v-model="vinNumber"
          />
        </v-col>
        <v-col cols="4">
          <v-btn
            color="primary"
            x-large
            :loading="isLoading"
            :disabled="isLoading || !isValidForm"
            @click="handler"
          >
            Найти
          </v-btn>
        </v-col>
        <v-col
          v-if="error"
          cols="8"
        >
          <v-alert
            text
            prominent
            :type="error.type"
          >
            {{ error.text }}
          </v-alert>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>

<script>
import { isExistsCar as isExistsCarAPI } from '@/libs/api'
import { VIN_REGEXP } from '@/constants'

export default {
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
      required: true,
    },
  },
  data() {
    return {
      isValidForm: false,
      isLoading: false,
      vinNumber: '',
      error: null,
      textFieldRules: {
        required: (v) => !!v || 'VIN обязательное поле',
        length: (v) => !v || v.length === 17 || 'Неправильная длина',
        vin: (v) => VIN_REGEXP.test(v) || 'Неправильный формат VIN',
      },
    }
  },
  methods: {
     handler() {
      this.fetchExistingCar()
    },
    async fetchExistingCar () {
      if(!this.$refs.form.validate()) {
        return
      }

      this.isLoading = true

      const params = {
        address: this.contractAddress,
        abi: this.abi,
        provider: this.provider,
        vin: this.vinNumber.toUpperCase(),
      }

      try {
        const isExistsCar = await isExistsCarAPI(params)

        if (!isExistsCar) {
          this.error = {
            type: 'info',
            text: 'Не найдено записей по этому VIN',
          }
        }
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
}
</script>