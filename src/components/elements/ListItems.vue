<template>
  <v-list-item-group>
    <v-list-item
      v-for="item, index in items"
      :key="index"
      color="primary"
    >
      <v-list-item-content>
        <v-list-item-title>{{ title }}</v-list-item-title>
        <v-list-item-subtitle
          v-for="subtitle, index in item.subtitles"
          :key="index"
        >
          {{ subtitle }}
        </v-list-item-subtitle>
      </v-list-item-content>

      <v-spacer></v-spacer>

      <v-list-item-action>
        <ListMenu
          editable
          removable
          @edit="$emit('edit', index)"
          @remove="$emit('remove', index)"
        />
      </v-list-item-action>
    </v-list-item>
    <div class="text-end">
      <slot name="actions">
        
      </slot>
    </div>
  </v-list-item-group>
</template>

<script>
import ListMenu from "@/components/elements/ListMenu.vue";

export default {
  components: { ListMenu },
  props: {
    title: {
      type: String,
      required: true
    },
    items: {
      type: Array,
      required: true
    }
  }
}
</script>