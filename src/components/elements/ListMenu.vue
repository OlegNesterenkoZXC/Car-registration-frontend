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
        <v-list-item v-if="editable">
          <v-list-item-content>
            <v-list-item-title @click="$emit('edit')">
              Изменить
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item v-if="removable">
          <v-list-item-content>
            <v-list-item-title @click="$emit('remove')">
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
    }
  },
  data () {
    return {
      selectedItem: undefined
    }
  },
  computed: {
    isDisabled () {
      return !(this.editable && this.removable)
    }
  },
  methods: {
    openHandler () {
      this.selectedItem = undefined
    }
  }

}
</script>