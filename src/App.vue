<template>
  <v-app>
    <v-app-bar app clipped-left
      max-height="112px"
      color="primary"
      dark
    >
      <v-toolbar-title>{{ appTitle }} editor</v-toolbar-title>

      <template v-slot:extension>
        <v-tabs grow v-model="selectedTab" @change="tabChange">
          <v-tab key="general">General</v-tab>
          <v-tab key="parents">Journey Categories</v-tab>
          <v-tab key="journeys">Journeys</v-tab>
          <v-tab key="resources">Resources</v-tab>
        </v-tabs>
      </template>

    </v-app-bar>
    <v-tabs-items v-model="activeTab" class="fill-height">
      <v-tab-item key="general">
        <General/>
      </v-tab-item>
      <v-tab-item key="parents">
          <parents/>
      </v-tab-item>
      <v-tab-item key="journeys">
          <Items/>
      </v-tab-item>
      <v-tab-item key="resources">
        <Resources/>
      </v-tab-item>
    </v-tabs-items>

    <v-snackbar v-model="showSnackbar" :timeout="snackbarTimeout" :color="snackbarColour"> 
      <v-icon class="mr-3" color="white">{{snackbarIcon}}</v-icon>
      <span>{{ snackbarText }}</span>
    </v-snackbar>
  </v-app>
</template>

<script>
import Parents from './Parents.vue';
import Items from './Items.vue';
import General from './General.vue';
import Resources from './Resources.vue';
import {mapGetters} from 'vuex'
import {abandonChanges} from '@/utils/ui.js'

export default {
  name: 'App',

  components: {
    General,
    Parents,
    Items,
    Resources
  },

  computed: {
    ...mapGetters([
      'snackbarText',
      'snackbarColour',
      'snackbarTimeout',
      'snackbarIcon',
      'unsaved'
    ]),
    showSnackbar: {
      get: function() {return this.$store.getters.showSnackbar},
      set: function(value) {this.$store.commit('setSnackbarVisible', value)}
    },
    appTitle() {return process.env.VUE_APP_TITLE}
  },

  data: () => ({
    selectedTab: 0,
    activeTab: 0
  }),

  methods: {
    tabChange: async function() {
      if (!this.unsaved || await abandonChanges(this.$dialog))
        this.activeTab = this.selectedTab
      else
        this.selectedTab = this.activeTab
    }
  }
};
</script>
