<template>
  <v-container fill-height fluid>
    <v-row 
      justify="center"
    >
      <v-col 
        xs="12" 
        sm="10"
        md="6"
        lg="4" 
      >
        <v-card
          :loading="isLoading"
        >
          <v-card-title>Поиск по VIN</v-card-title>
          <v-card-text>
            <v-alert
              v-if="alert"
              text
              :type="alert.type"
            >
              {{ alert.text }}
            </v-alert>
            <v-form 
              ref="form" 
              v-model="isValidForm"
              :disabled="isLoading"
              @submit.prevent="submitHandler"
            >
              <v-text-field
                v-model="formVin"
                counter="17"
                label="VIN"
                clearable
                :rules="textFieldRules"
              />
            </v-form>
          </v-card-text>

          <v-divider />

          <v-card-actions>
            <v-btn
              color="primary"
              text
              :loading="isLoading"
              :disabled="isLoading || !isValidForm"
              @click="submitHandler"
            >
              Найти
            </v-btn>
            <v-btn
              text
              color="error"
              @click="$refs.form.reset()"
            >
              Сбросить
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>  
  </v-container>
</template>

<script>
import { isExistCar as isExistCarAPI } from '@/libs/api'
import { VIN_REGEXP } from '@/constants'

import { mapState } from 'vuex';

const VIN_RULES = {
  required: (v) => !!v || 'VIN обязательное поле',
  length: (v) => !v || v.length === 17 || 'Неправильная длина',
  isVin: (v) => VIN_REGEXP.test(v) || 'Неправильный формат VIN',
}

export default {
  data() {
    return {
      isValidForm: false,
      isLoading: false,
      formVin: '',
      alert: null,
    }
  },
  computed: {
    ...mapState({
      httpProvider: 'httpProvider',
      abi: 'abi',
      contractAddress: 'contractAddress'
    }),
    textFieldRules () {
      return [VIN_RULES.required, VIN_RULES.length, VIN_RULES.isVin]
    },
    vin () {
      return this.formVin?.toUpperCase()
    }
  },
  methods: {
    submitHandler () {
      if(this.$refs.form.validate()) {
        this.toCarInfo()
      }
    },
    async isExistCar () {
      const params = {
        address: this.contractAddress,
        abi: this.abi,
        provider: this.httpProvider,
        vin: this.vin
      }

      return isExistCarAPI(params)
    },
    async toCarInfo () {
      this.isLoading = true

      try {
        const isExistsCar = await this.isExistCar()

        if (!isExistsCar) {
          this.alert = {
            type: 'info',
            text: 'Не найдено записей по этому VIN',
          }

          return
        }

        this.$router.push({
          path: `/car/${this.vin}`
        })
      } catch (error) {
        console.error(error)

        this.alert = {
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