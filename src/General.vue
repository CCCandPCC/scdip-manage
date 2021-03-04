<template> 
  <div >
    <v-navigation-drawer app absolute permanent fixed disable-resize-watcher :clipped="true" color="blue--lighten-1">
      <v-list>
        <v-list-item color="primary" @click="changeView('introduction')">Introduction</v-list-item>
        <v-list-item color="primary" @click="changeView('theme')">Theme</v-list-item>
        <v-list-item color="primary" @click="changeView('landing')">Landing</v-list-item>
        <v-list-item color="primary" @click="changeView('completed')">Assessment completed</v-list-item>
        <v-list-item color="primary" @click="changeView('positive')">Default results</v-list-item>
        <v-list-item color="primary" @click="changeView('terms')">Terms and Conditions</v-list-item>
        <v-list-item color="primary" @click="changeView('a11y')">Accessibility statement</v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-icon large @click.stop="drawer = !drawer"> mdi-chevron-right </v-icon>
    <v-content>
      <component :is="interactionType"/>
    </v-content>
  </div>
</template>

<script>
import IntroductionEditor from './components/controls/IntroductionEditor.vue'
import ThemeEditor from './components/controls/ThemeEditor.vue'
import LandingEditor from './components/controls/LandingEditor.vue'
import PositiveEditor from './components/controls/PositiveEditor.vue'
import TermsEditor from './components/controls/TermsEditor.vue'
import CompletedEditor from './components/controls/CompletedEditor.vue'
import A11yEditor from './components/controls/A11yEditor.vue'

export default {
  components: {
    'introduction': IntroductionEditor,
    'theme': ThemeEditor,
    'terms': TermsEditor,
    'landing': LandingEditor,
    'positive': PositiveEditor,
    'completed': CompletedEditor,
    'a11y': A11yEditor
  },
  data() {
    return {
      interactionType: 'introduction',
      drawer: true,
    }
  },
  methods: {
    changeView(view) {
      this.interactionType = view;
    }
  }
}
</script>