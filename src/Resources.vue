<template>
  <div>
    <v-navigation-drawer app  clipped permanent color="blue--lighten-1" :value="false" disable-resize-watcher>
      <v-text-field v-if="!loading" v-model="searchText" filled label="Search" clearable ></v-text-field>
      <v-list>
        <div v-if="loading">
          <v-skeleton-loader type="list-item"/>
          <v-skeleton-loader type="list-item"/>
          <v-divider/>
          <v-skeleton-loader v-for="n in 5" :key="n" type="list-item-avatar"/>
        </div>
        <div v-else>
          <v-list-item color="primary" @click="newResource">
            <v-list-item-icon>
              <v-icon>mdi-plus</v-icon>
            </v-list-item-icon>New Resource
          </v-list-item>
          <v-divider/>
          <v-list-item-group v-if="resources.length" v-model="resourceIndex" color="primary">
            <v-list-item v-for="(resource) in filteredResourceList" :key="resource.id">
              <v-list-item-content>
                <v-list-item-title v-if="resource.doc" v-html="resource.doc.name">Hello</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </div>
      </v-list>
    </v-navigation-drawer>
    <v-main style="padding-left:256px">
      <v-container fluid class="fill-height" v-if="currentResource">
        <component ref="resourceComponent" :is="component" v-model="currentResource.doc"/>
        <v-container>
            <v-btn class="mr-5" :disabled="deleting" :loading="saving" @click="saveResource">Save</v-btn>
            <v-btn :disabled="saving" :loading="deleting" @click="confirmDelete">Delete resource</v-btn>
        </v-container>
      </v-container>
    </v-main>
  </div>
</template>


<script>
  import ResourceEditor from './components/controls/ResourceEditor'
  import {editorEndpoint} from '@/utils/endpoints.js'
  import {v4 as uuidv4} from 'uuid'
  import {savePopup} from '@/utils/ui'
  
  export default {
    components :{
      'resource-editor': ResourceEditor
    },
    data: () => ({
      resources: [],
      resourceIndex: -1,
      component: "resource-editor",
      endpoint: process.env.VUE_APP_API_ENDPOINT,
      searchText: "",
      saving: false,
      deleting: false,
      loading: true
    }),
    created() {
      fetch(editorEndpoint + '/resources')
      .then(res => res.json())
      .then(res => { this.resources = res })
      .finally(() => {this.loading = false})
    },
    computed: {
      currentResource() {
        return this.filteredResourceList.length && this.resourceIndex > -1 ? this.filteredResourceList[this.resourceIndex] : null
      },
      filteredResourceList() {
        if (!this.searchText) return this.resources;
        else
          return this.resources.filter((r) =>
            r.doc.name.toLowerCase().includes(this.searchText.toLowerCase())
          );
      }
    },
    methods: {
      saveResource() {
        this.saving = true;
        this.$set(this.currentResource, "id", this.currentResource.id || uuidv4())
        let putReq = {
          method: 'PUT',
          body:JSON.stringify(this.currentResource.doc)
        }
        fetch(`${editorEndpoint}/resources/${this.currentResource.id}`, putReq )
          .then((res) => {
            savePopup(res.status)
          })
          .catch((err) => {
            console.error(err)
            savePopup(false)
          })
          .finally(() => {
            this.saving = false;
          })
      },
      confirmDelete() {
        this.$dialog
            .display(
                "Delete Resource",
                "Are you sure you want to delete this resource? This action cannot be undone",
                [{text:'No', color:''}, {text:'Yes, Delete', color:''}]
            )
            .then((result) => {
                if (result === 1) {
                  this.deleting = true;
                  this.deleteResource();
                }
            });
        },
      deleteResource() {
        if (!this.currentResource.id) {
          this.removeResUi()
          return
        }

        this.deleting = true
        let delReq = {
          method: "DELETE"
        }
        fetch(`${editorEndpoint}/resources/${this.currentResource.id}`, delReq)
        .then(() => this.removeResUi)
        .finally(() => {this.deleting = false})
      },
      removeResUi() {
          this.resources.splice(this.resourceIndex,1);
          this.resourceIndex = null;
          this.deleteConfirmation = false
      },
      newResource() {
        let item = {
          type: "resource",
          doc : {
            name: "New resource",
            content: "",
            includeTags: [],
            excludeTags: [],
            img: {}
          }
        }
        this.resources.push(item);
        this.resourceIndex = this.resources.length - 1
      }
    }
  }
  
</script>