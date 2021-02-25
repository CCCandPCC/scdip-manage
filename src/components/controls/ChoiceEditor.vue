<template>
  <v-container >
    <h3>{{typeName(value.fieldType)}}</h3>
    <v-row>
      <v-col cols="6">
        <label>Question picture</label>
        <info>This will display next to the Name to help user identify what it means</info>
        <file-upload v-model="value.img"/>
      </v-col>
      <v-col>
        <label>Question title</label>
        <info>What the question should be asking the user</info>
        <v-text-field ref="Label" v-model="value.label"
          :rules="[() => !!value.label || 'This field is required']"
          :error-messages="errorMessages"
          outlined required/>
        <label>Rubric</label>
        <info>This tells the user how to answer e.g. Please select one option</info>
        <v-text-field outlined ref="Example" v-model="value.example" />
        </v-col>
    </v-row>
    <v-switch
      v-model="value.isMandatory"
      label="A response will be required"
    ></v-switch>
    <label>Match tags</label>
    <info>Enter a word. If matched with an answer tag for another question this will show the question. Can be left blank.</info>
    <v-combobox
      v-model="value.includeTags"
      chips
      clearable
      multiple
      solo/>
    <label>Exclude tags</label>
    <info>Enter a word. If matched with an answer tag for another question this will hide this question. Can be left blank.</info>
    <v-combobox
      v-model="value.excludeTags"
      chips
      clearable
      label="Exclude tags"
      multiple
      solo/>
    <h3>Choices</h3>
    <v-expansion-panels accordion>
      <draggable v-model="choiceOrder" v-bind="dragOptions" @start="drag = true" @end="drag = false" handle=".handle">
        <transition-group type="transition" :name="!drag ? 'flip-list' : null">
          <v-expansion-panel v-for="(choice, index) in value.choices" :key="choice.id">
            <v-expansion-panel-header style="width: 100%">
              <template #default="{open}">
                <v-icon class="handle flex-grow-0" >mdi-drag</v-icon>
                <v-fade-transition leave-absolute >
                  <span v-if="!open">
                    {{choice.value}}
                  </span>
                </v-fade-transition>
                <v-spacer/>
              </template>
              <template #actions>
                <v-btn icon @click.stop="remove(index)">
                  <v-icon>mdi-close</v-icon>
                </v-btn>
                <v-icon color="primary">$vuetify.icons.expand</v-icon>
              </template>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <label>Choice label</label>
              <v-text-field outlined v-model="choice.value"/>
              <file-upload v-model="choice.img"/>
              <label>Choice tags</label>
              <v-combobox
                v-model="choice.tags"
                chips
                clearable
                label="Tags"
                multiple
                solo/>
              <v-expansion-panels>
                <v-expansion-panel :key="'c_'+choice.id" @click="expandDialog(index)">
                  <v-expansion-panel-header style="width: 100%">
                    <template>
                      <v-fade-transition leave >
                        <span>
                          Dialog
                        </span>
                      </v-fade-transition>
                      <v-spacer/>
                    </template>
                    <template #actions v-if="choice.dialog">
                      <v-btn icon @click.stop="removeDialog(index)">
                        <v-icon>mdi-close</v-icon>
                      </v-btn>
                      <v-icon color="primary">$vuetify.icons.expand</v-icon>
                    </template>
                  </v-expansion-panel-header>
                  <v-expansion-panel-content v-if="choice.dialog">
                    <info>If this filled in for a choice, it will be displayed when the user selects this choice</info>
                    <label>Title</label>
                    <v-text-field outlined v-model="choice.dialog.title"/>
                    <v-textarea outlined v-model="choice.dialog.content"/>
                    <v-switch outlined v-model="choice.dialog.fullscreen" label="Show fullscreen"/>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </transition-group>
      </draggable>
    </v-expansion-panels>
    <v-btn color="primary" @click="append">
      <v-icon>mdi-plus</v-icon>
    </v-btn>
  </v-container>
</template>

<script>
  import draggable from 'vuedraggable'
  import FileUpload from "./FileUpload";
  import {itemTypeName} from '@/utils/itemTypes.js'
  import Info from '@/components/controls/Info'

  export default {
    name: 'ChoiceEditor',
    components: {
      draggable,
      FileUpload,
      Info
    },
    data() {
      return {
        drag: false,
        errorMessages: ''
      }
    },
    watch: {
        value: function() {
            if (!this.value.choices)
                this.value.choices = []  
            else
              this.value.choices = this.value.choices.map(x => {x.id = this.uuidv4(); x.img = {}; return x})
        }
    },
    props: ['value'],
    computed: {
      dragOptions() {
        return {
          animation: 200,
          group: "description",
          disabled: false,
          ghostClass: "ghost"
        }
      },
      choiceOrder: {
        get: function() {
          return this.value.choices
        },
        set: function(value) {
          this.value.choices = value
        }
      }
    },
    methods: {
      uuidv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
      },
      typeName(typeId) {
        return itemTypeName(typeId)
      },
      append() {
        this.value.choices.push({
          value: "New choice",
          id: this.uuidv4(),
          img: {},
          choices: [],
          tags: []
        })
        this.$forceUpdate();  // temp fix as component doesn't 
                              // appear to be updating when data changes
      },
      remove(index) {
        this.value.choices.splice(index, 1)
        this.$forceUpdate();  // temp fix as component doesn't 
                              // appear to be updating when data changes
      },
      expandDialog(index) {
        if (!this.value.choices[index].dialog) {
          this.$set(this.value.choices[index], "dialog", {})
        }
      },
      removeDialog(index) {
        this.$delete(this.value.choices[index], "dialog")
      }
    }
  }
</script>

<style>
.v-expansion-panels > div {
  width: 100%
}

.flip-list-move {
  transition: transform 0.5s;
}
.no-move {
  transition: transform 0s;
}
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
.handle {
  cursor: move;
}
.list-group-item i {
  cursor: pointer;
}
</style>