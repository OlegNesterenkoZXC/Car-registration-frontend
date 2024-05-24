<template>
  <v-dialog 
    v-model="dialog"
    persistent
    width="500"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        color="primary"
        v-bind="attrs"
        v-on="on"
      >
        {{ modalButtonName }}
      </v-btn>
    </template>

    <v-card>
      <v-card-title>{{ title }}</v-card-title>

      <slot />

      <v-card-actions>
        <slot name="actions">
          <v-spacer />
          <v-btn
            color="primary"
            :loading="loading"
            :disabled="loading"
            @click="$emit('confirm')"
            text
          >
            {{ confirmButton }}
          </v-btn>
          <v-btn
            color="error"
            text
            :disabled="loading"
            @click="cancelHandler"
          >
            {{ cancelButton }}
          </v-btn>
        </slot>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
const BUTTONS_TEXT = {
  confirm: 'Подтвердить',
  cancel: 'Отмена'
}

export default {
  props: {
    modalButtonName: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    confirmButton: {
      type: String,
      default: BUTTONS_TEXT.confirm
    },
    cancelButton: {
      type: String,
      default: BUTTONS_TEXT.cancel
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      dialog: false
    }
  },
  computed: {
  },
  methods: {
    cancelHandler () {
      this.dialog = false
      this.$emit('cancel')
    }
  }
}
</script>

<style>

</style>