<template>
  <div>
    <v-navigation-drawer app absolute permanent fixed disable-resize-watcher :clipped="true" color="blue--lighten-1" >
      <v-list>
        <div v-if="loading">
          <v-skeleton-loader type="list-item"/>
          <v-divider/>
          <v-skeleton-loader v-for="n in 5" :key="n" type="list-item-avatar"/>
        </div>
        <div v-else>
          <v-list-item color="primary" @click="newParent">
            <v-list-item-icon>
              <v-icon>mdi-plus</v-icon>
            </v-list-item-icon>New Category
          </v-list-item>
           <v-divider/>
          <v-list-item-group v-if="parents.length" v-model="parentIndex" color="primary">
            <v-list-item v-for="(parent, i) in parents" :key="i">
              <v-list-item-content>
                <v-list-item-title v-if="parent.label" v-html="parent.label">Hello</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </div>
      </v-list>
    </v-navigation-drawer>
    <v-icon large @click.stop="drawer = !drawer"> mdi-chevron-right </v-icon>
    <v-content>
      <v-container fluid class="fill-height" v-if="currentParent">
        <parent ref="parentComponent" v-model="currentParent"/>
        <v-container>
            <v-btn class="mr-4" :disabled="deleteLoading" :loading="updateLoading" @click="putParent">Save</v-btn>
            <v-btn :disabled="updateLoading" :loading="deleteLoading" @click="confirmDeleteParent">Delete category</v-btn>
        </v-container>
      </v-container>
    </v-content>
  </div>
</template>


<script>
  import ParentEditor from './components/controls/ParentEditor.vue'
  import {playerEndpoint, editorEndpoint} from '@/utils/endpoints.js'
  import {v4 as uuidv4} from 'uuid'
  import {savePopup} from '@/utils/ui'
  
  export default {
    components :{
      'parent': ParentEditor
    },
    data: () => ({
      parents: [],
      parentIndex: -1,
      drawer: true,
      loading: true,
      updateLoading: false,
      deleteLoading: false
    }),
    created() {
      fetch(playerEndpoint + '/journey-parents')
      .then(res => res.json())
      .then(res => { this.parents = res })
      .finally(() => {
        this.loading = false
      })
    },
    computed: {
      currentParent() {
        return this.parents.length && this.parentIndex > -1 ? this.parents[this.parentIndex] : null
      }
    },
    methods: {
      validate() {
        return this.$refs.parentComponent.validate()
      },
      putParent() {
        const parent = this.parents[this.parentIndex]
        const id = parent.id || uuidv4()
        let req = {
          method: "PUT",
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(parent)
        }
        this.updateLoading = true;

        fetch(`${editorEndpoint}/journey-parent/${id}`, req)
        .then((res)=>{
          parent.id = id

          savePopup(res.status)
        })
        .finally(() => {this.updateLoading = false})
        .catch((err) => {
          savePopup(false)
          console.error(err)
        })
      },
      confirmDeleteParent() {
        this.$dialog
          .display(
              "Delete Category",
              "Are you sure you want to delete this category? This action cannot be undone",
              [{text:'No', color:''}, {text:'Yes, Delete', color:''}]
          )
          .then((result) => {
              if (result === 1) {
                this.deleting = true;
                this.deleteParent();
              }
          });
      },
      deleteParent() {
        if (!this.currentParent.id) {
          this.parents.splice(this.parentIndex,1);
          return
        }

        this.deleteLoading = true
        let delReq = {
          method: "DELETE"
        }
        fetch(`${editorEndpoint}/journey-parent/${this.currentParent.id}`, delReq)
        .then(()=>{
          this.parents.splice(this.parentIndex,1);
          this.parentIndex = null;
        })
        .finally(() => {
          this.deleteLoading = false
        })
      },
      newParent() {
        let item = {
          label: "New parent",
          img: {},
          journeys:[],
          type: "parent"
        }
        this.parents.push(item);
        this.parentIndex = this.parents.length - 1
      }
    }
  }
  
</script>