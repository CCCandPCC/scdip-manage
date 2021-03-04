<template>
  <div>
    <v-navigation-drawer app absolute permanent fixed disable-resize-watcher :clipped="true" color="blue--lighten-1">
      <v-list>
        <div v-if="loading">
          <v-skeleton-loader type="list-item"/>
          <v-divider/>
          <v-skeleton-loader v-for="n in 5" :key="n" type="list-item-avatar"/>
        </div>
        <div v-else>
          <v-list-item color="primary" @click="newJourney">
            <v-list-item-icon>
                <v-icon>mdi-plus</v-icon>
            </v-list-item-icon>
            New journey
          </v-list-item>
           <v-divider/>
          <div v-for="(journey, index) in journeys" :key="'j' + index">
            <v-list-group @click="loadJourney(journey)" prepend-icon="mdi-transit-connection-variant">
              <template v-slot:activator>
                <v-list-item-title >{{journey.label}}</v-list-item-title>
              </template>
              <div v-for="(page, index) in journey.doc.pages" :key="index" >
                <v-list-group sub-group no-action append-icon="mdi-list-status" @click="loadEditor(page, 'page')">
                  <template v-slot:activator>
                    <v-list-item-title>{{index + 1}}. {{page.title}}</v-list-item-title>
                  </template>
                  <v-list-item @click="loadEditor(item)" link v-for="(item, itemIndex) in page.items" :key="itemIndex">
                    <v-list-item-title>{{itemType(item.fieldType)}}</v-list-item-title>
                    <v-list-item-icon>
                      <v-icon>{{iconName(item.fieldType)}}</v-icon>
                    </v-list-item-icon>
                  </v-list-item>
                </v-list-group>
              </div>
            </v-list-group>
          </div>
        </div>
      </v-list>
    </v-navigation-drawer>
    <v-content>
      <v-container fluid class="fill-height">
          <div v-if="errorMessages.length > 0">
            <h2>There is a problem</h2>
            <ul>
              <li v-for="(error, index) in errorMessages" :key="index">
                {{error.message}}
              </li>
            </ul>
          </div>
        <journey v-if="interactionType === 'journey'" v-model="field" @delete="deleteJourney(field.id)"/>
        <component v-else :is="interactionType" v-model="field"/>
      </v-container>
    </v-content>
  </div>
</template>

<script>

import PageEditor from './components/controls/PageEditor.vue'
import JourneyEditor from './components/JourneyEditor.vue'
import { itemTypeName, itemIcon, components as itemComponents } from './utils/itemTypes'
import {playerEndpoint, editorEndpoint} from '@/utils/endpoints.js'

export default {
  components: {
    ...itemComponents,
    'page': PageEditor,
    'journey': JourneyEditor
  },
  data() {
    return {
      loading: true,
      currentJourney: null,
      journeys: [],
      item: 1,
      field: {fieldType: "div"},
      interactionType: '',
      errorMessages: [],
      updateLoading: false,
      saving: false
    }
  },
  created() {
    fetch(playerEndpoint + '/journeys')
      .then(reply => reply.json())
      .then(data => {
        this.journeys = data
      })
      .finally(() => this.loading = false)
  },
  methods: {
    itemType(typeName) {
      return itemTypeName(typeName)
    },
    iconName(typeName) {
      return itemIcon(typeName)
    },
    loadJourney(journey) {
      this.loadEditor(journey, 'journey')
    },
    loadEditor(obj, fieldType) {
      this.field = obj
      this.interactionType = fieldType || obj.fieldType
    },
    removeJourneyUi() {
      this.journeys.splice(this.resourceIndex,1);
      this.interactionType = ''
      this.field = null
    },
    newPage() {
      //this.currentJourney.doc.pages.push({title: "New page", items: []})
    },
    newJourney() {
      let journey = {
        label: "New Journey",
        img: {},
        doc: {
          pages: []
        }
      }
      this.journeys.splice(0, 0, journey)
      this.loadJourney(journey)
    },
    createJourney() {
      this.validateJourney()
      if(this.errorMessages.length) { return }
      fetch(editorEndpoint + '/journeys', {
        method:"POST",
        headers: { "content-type":"application/json"},
        //body: JSON.stringify(this.currentJourney)
      })
      .then(res=>res.json())
      .then(j => {
        let index = this.journeys.indexOf(0) //this.currentJourney);
        this.$set(this.journeys,index,j)
        //this.currentJourney = this.journeys[index]
      })
    },
    deleteJourney(id) {
      if (id) {
        fetch(`${editorEndpoint}/journeys/${id}`, {
          method: 'DELETE'
        })
        .then(() =>  {
          this.removeJourneyUi()
        })
        .catch((err)=>console.error(err))
      } else
        this.removeJourneyUi()
    },
    validateJourney() { 
      /*this.errorMessages = []  
      // validate journey
      //this.hasValue("journey id",this.currentJourney.id);
      this.hasValue("journey label",this.currentJourney.label);
      // validate pages 
      this.hasMinimum("journey pages",this.currentJourney.doc.pages, 1); // check there are pages
      this.currentJourney.doc.pages.forEach(page => {
        this.hasValue("page title", page.title);
        this.hasMinimum(page.title + " items",page.items, 1);
        // validate items
        page.items.forEach(item => {
          this.hasValue("item field type",item.fieldType);
          this.hasValue("item name",item.name);
          this.hasValue("item label",item.label);
          if(item.fieldType !== 'stimulus') {
              // validate choices
              this.hasMinimum("item choices",item.choices, 2);
              item.choices.forEach(choice => {
                this.hasValue("choice value",choice.value);
                //this.hasMinimum(item.name + " choice tags",choice.tags, 1);
            })
          }
        })
      })*/
    },
    hasValue(key,value) {
      if(!value){this.errorMessages.push({key:key, message:key + " cannot be empty"})}
    },
    hasMinimum(key,value,minLength) {
      if(value.length < minLength) {this.errorMessages.push({key:key, message:key + " require at least " + minLength + " value(s)"})}
    }
  }
}
</script>

<!-- this is a bit of hack but it fixes an issue where if you resize the viewport to a 
 width of less 1264px, it'll hide content behind the navigation drawer. I think it'<style scoped>
 a bug in Vuetify... -->
<style scoped>
  main {
    padding-left: 256px !important;
  }
</style>