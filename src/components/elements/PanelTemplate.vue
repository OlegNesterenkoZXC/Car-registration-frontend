<template>
  <v-list-group>
    <template v-slot:activator>
      <v-list-item-content>
        <v-list-item-title>{{ title }}</v-list-item-title>
      </v-list-item-content>
    </template>

    <v-progress-linear 
      v-if="loading"
      indeterminate
    />

    <slot name="alert" v-else />

    <v-alert
      v-if="error"
      prominent
      text
      :type="error.type"
    >
      {{ error.text }}
    </v-alert>

    <slot v-if="!loading" />
  </v-list-group>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true
    },
    error: {
      type: Object,
      default: null
    },
    loading: {
      type: Boolean,
      default: true,
    },
  },
  data () {
    return {
      selectedItem: undefined,
    }
  },
}
</script>