<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card :loading="loading">
          <v-card-title>{{ title }}</v-card-title>
          <v-card-subtitle>VIN: {{ vin }}</v-card-subtitle>
          <v-card-text v-if="!loading">
            <v-card>
              <v-alert
                v-if="error"
                text
                prominent
                :type="error.type"
              >
                {{ error.text }}
              </v-alert>
              <v-list
                v-else
                nav
              >
                <slot />
              </v-list>
            </v-card>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>

</template>

<script>
export default {
  props: {
    vin: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true
    },
    loading: {
      type: Boolean,
      default: true
    },
    error: {
      type: Object,
      default: null,
    },
  },
}
</script>