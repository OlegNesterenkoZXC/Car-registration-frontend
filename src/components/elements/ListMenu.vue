<template>
  <v-menu :disabled="isDisabled">
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        icon
        v-bind="attrs" 
        v-on="on"
        @click="openHandler"
      >
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>
    </template>
    <v-list nav>
      <v-list-item-group v-model="selectedItem">
        <v-list-item 
          v-if="editable"
          @click="$emit('edit')"
        >
          <v-list-item-content>
            <v-list-item-title>
              Изменить
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item 
          v-if="removable"
          @click="$emit('remove')"
        >
          <v-list-item-content>
            <v-list-item-title>
              Удалить
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-menu>
</template>

<script>
export default {
  props: {
    editable: {
      type: Boolean,
      default: false
    },
    removable: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      selectedItem: undefined
    }
  },
  computed: {
    isDisabled () {
      return this.disabled || (!this.editable && !this.removable)
    }
  },
  methods: {
    openHandler () {
      this.selectedItem = undefined
      
      this.$emit('open')
    }
  }

}
</script>