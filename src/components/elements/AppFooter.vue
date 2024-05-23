<template>
  <div>
    <v-app-bar 
      color="deep-purple" 
      dark 
      app
    >
			<v-app-bar-nav-icon @click="drawer = true"/>

			<v-toolbar-title>{{ title }}</v-toolbar-title>
			<v-spacer></v-spacer>
		</v-app-bar>

		<v-navigation-drawer 
      v-model="drawer" 
      absolute 
      temporary 
      app
    >
			<v-list 
        nav 
        dense
      >
				<v-list-item-group 
          v-model="group" 
          active-class="deep-purple--text text--accent-4"
        >
					<v-list-item to="/">
						<v-list-item-icon>
							<v-icon>mdi-home</v-icon>
						</v-list-item-icon>
						<v-list-item-title>Домой</v-list-item-title>
					</v-list-item>
				</v-list-item-group>
			</v-list>
		</v-navigation-drawer>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      drawer: false,
      group: null
    }
  }
}
</script>



