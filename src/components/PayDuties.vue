<template>
  <v-dialog 
    v-model="dialog"
    width="500"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        color="primary"
        v-bind="attrs"
        v-on="on"
      >
        Оплатить
      </v-btn>
    </template>

    <ConnectMetaMask
      @close="dialog = false"
    />

  </v-dialog>
</template>

<script>
import ConnectMetaMask from './ConnectMetaMask.vue';

export default {
  components: { ConnectMetaMask },
  data () {
    return {
      dialog: false,
      error: null,
    }
  },
  
}
</script>