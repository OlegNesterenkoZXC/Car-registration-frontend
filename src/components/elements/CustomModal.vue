<template>
  <v-dialog 
    v-model="dialog"
    persistent
    width="500"
  >
    <template 
      v-if="!disabled" 
      v-slot:activator="{ on, attrs }"
    >
      <v-btn
        color="primary"
        v-bind="attrs"
        v-on="on"
        @click="openHandler"
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
            :disabled="loading || disabledConfirmButton"
            @click="$emit('confirm')"
            text
          >
            {{ confirmButtonText }}
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
const BUTTON_TEXT = {
  confirm: 'Подтвердить',
  cancel: 'Отмена'
}

export default {
  props: {
    modalButtonName: {
      type: String,
      default: 'Открыть'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      required: true
    },
    confirmButtonText: {
      type: String,
      default: BUTTON_TEXT.confirm
    },
    disabledConfirmButton : {
      type: Boolean,
      default: false
    },
    cancelButton: {
      type: String,
      default: BUTTON_TEXT.cancel
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
  watch: {
    dialog (value) {
      this.$emit('change', value)
    }
  },
  methods: {
    openHandler () {
      this.$emit('activator')
    },
    openDialog () {
      this.dialog = true
    },
    cancelHandler () {
      this.dialog = false
      this.$emit('cancel')
    }
  }
}
</script>

<style>

</style>