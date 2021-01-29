<template>
    <v-container>
        <v-form ref="form" model="valid">
            <v-row>
                <v-col>
                    Resource name or title
                    <info>Will help user identify the resource</info>
                    <v-text-field
                        v-model="value.name"
                        :rules="rules.name"
                        :mandatory="true"
                    />
                </v-col>
                <v-col>
                    Resource category
                    <info>Will help user identify what situation the resource can help them in</info>
                    <v-combobox
                        label=""
                        v-model="value.categories"
                        :rules="rules.categories"
                        chips
                        deletable-chips
                        clearable
                        multiple
                        hint="Group matching resources by category. Resources with multiple categories will appear in each group."
                    />
                </v-col>
            </v-row>
            
            Resource description
            <html-editor
                label="A brief description of what the resource does and what it should help the user with"
                v-model="value.content"
            />
            <v-row>
                <v-col>
                    Resource logo
                    <info>Helps user identify the resource</info>
                    <file-upload 
                        label=""
                        ref="fileUpload" 
                        v-model="value.img"
                    />
                </v-col>
                <v-col>
                    Resource link
                    <info>The link is displayed as a button which when clicked will open a new tab</info>
                    <v-text-field
                        v-model="value.moreInfoUrl"
                        :rules="rules.url"
                    />
                </v-col>
            </v-row>
            <v-row>
                <info>Tags are how we link an answer to a resource. Include tags when matched with tags 
                    in questions will make the resource appear. Exclude tags will do the opposite</info>
            </v-row>
            <v-row>
                <v-col>
                    Include tags                 
                    <v-combobox
                        label=""
                        v-model="value.includeTags"
                        :rules="rules.includeTags"
                        chips
                        clearable
                        multiple
                        solo
                        hint="Include the resource in results if any of these tags have been collected during the assessment."
                    />
                </v-col>
                <v-col>
                    Exclude tags
                    <v-combobox
                        label=""
                        v-model="value.excludeTags"
                        :rules="rules.excludeTags"
                        chips
                        clearable
                        multiple
                        solo
                        hint="Exclude the resource from results if any of these tags have been collected during the assessment."
                    />
                </v-col>
            </v-row>
        </v-form>
    </v-container>
</template>

<script>
import HTMLEditor from "./HTMLEditor";
import FileUpload from "./FileUpload";
import Vue from 'vue';
import Info from '@/components/controls/Info'

export default {
    name: "ResourceEditor",
    data: () => ({
      valid: true,
      rules: {
          name : [
              v => (!!v && v != "New resource") || 'Name is required',
              v => (v && v.length <= 200) || 'Name must be less than 200 characters',
              v => !(/^[ \t]+/.test(v)) || 'Name must not begin with an empty space'
          ],
          content: [
            //   v => (!!v || v=="<p></p>") || 'Content is required',
              v => !(/^[ \t]+/.test(v)) || 'Content must not begin with an empty space',
          ],
          url: [],
          includeTags:[
              v => (!!v && v.length > 0) || 'At least one tag is required'
          ],
          excludeTags:[],
          categories: [
            (v) => (!!v && v.length > 0) || "At least one category is required"
          ],
        },
    }),
    props: ["value"],
    watch: {
        value: {
            deep: true,
            handler: function() {
                if (!this.value.img)
                    Vue.set(this.value, 'img', {})

                this.$emit('input', this.value)
            }
        }
    },
    methods: {
        validate() {
            return this.$refs.form.validate();
        }
    },
    components: {
        "html-editor": HTMLEditor,
        "file-upload": FileUpload,
        Info
    },
}
</script>
