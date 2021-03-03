<template>
    <div class="html-editor">
        <v-label :v-if="label">{{label}}</v-label>
        <v-input :rules="internalRules" :error-messages="errorMessages">
            <div class="editor">
                <editor-menu-bar :editor="editor" v-slot="{ commands, isActive }">
                    <div class="menubar v-btn-toggle">
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn @click="commands.undo" v-bind="attrs" v-on="on">
                                    <v-icon>mdi-undo</v-icon>
                                </v-btn>
                            </template>
                            <span>undo</span>
                        </v-tooltip>
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn @click="commands.redo" v-bind="attrs" v-on="on">
                                    <v-icon>mdi-redo</v-icon>
                                </v-btn>
                            </template>
                            <span>redo</span>
                        </v-tooltip>
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn :class="{'v-btn--active': isActive.bold()}" @click="commands.bold" v-bind="attrs" v-on="on">
                                    <v-icon>mdi-format-bold</v-icon>
                                </v-btn>
                            </template>
                            <span>bold</span>
                        </v-tooltip>
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn v-show="false" :class="{'v-btn--active': isActive.italic()}" @click="commands.italic" v-bind="attrs" v-on="on">
                                    <v-icon>mdi-format-italic</v-icon>
                                </v-btn>
                            </template>
                            <span>italic</span>
                        </v-tooltip>
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn :class="{'v-btn--active': isActive.underline()}" @click="commands.underline" v-bind="attrs" v-on="on">
                                    <v-icon>mdi-format-underline</v-icon>
                                </v-btn>
                            </template>
                            <span>underline</span>
                        </v-tooltip>
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn @click="showImagePrompt(commands.caption_image)" v-bind="attrs" v-on="on">
                                    <v-icon>mdi-signature-image</v-icon>
                                </v-btn>
                            </template>
                            <span>insert image</span>
                        </v-tooltip>
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn @click="showVideoPrompt(commands.video)" v-bind="attrs" v-on="on">
                                    <v-icon>mdi-video</v-icon>
                                </v-btn>
                            </template>
                            <span>insert video</span>
                        </v-tooltip>
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn :class="{'v-btn--active': isActive.heading({ level: 1})}" @click="commands.heading({ level: 1})" v-bind="attrs" v-on="on">
                                    H1
                                </v-btn>
                            </template>
                            <span>heading1</span>
                        </v-tooltip>
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn :class="{'v-btn--active': isActive.heading({ level: 2})}" @click="commands.heading({ level: 2})" v-bind="attrs" v-on="on">
                                    H2
                                </v-btn>
                            </template>
                            <span>heading2</span>
                        </v-tooltip>
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn :class="{'v-btn--active': isActive.heading({ level: 3})}" @click="commands.heading({ level: 3})" v-bind="attrs" v-on="on">
                                    H3
                                </v-btn>
                            </template>
                            <span>heading3</span>
                        </v-tooltip>
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn :class="{'v-btn--active': isActive.bullet_list()}" @click="commands.bullet_list" v-bind="attrs" v-on="on">
                                    <v-icon>mdi-format-list-bulleted</v-icon>
                                </v-btn>
                            </template>
                            <span>bulleted list</span>
                        </v-tooltip>
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn :class="{'v-btn--active': isActive.ordered_list()}" @click="commands.ordered_list" v-bind="attrs" v-on="on">
                                    <v-icon>mdi-format-list-numbered</v-icon>
                                </v-btn>
                            </template>
                            <span>numbered list</span>
                        </v-tooltip>
                    </div>
                </editor-menu-bar>
                <v-card>
                    <editor-content class="editor__content" :editor="editor"/>
                </v-card>
            </div>
        </v-input>
    </div>
</template>

<script>
import { Editor, EditorContent, EditorMenuBar } from 'tiptap'
import {
  HardBreak,
  Heading,
  OrderedList,
  BulletList,
  ListItem,
  Bold,
  Italic,
  Link,
  Underline,
  History,
} from 'tiptap-extensions'
import CaptionImage from '@/plugins/caption-images-editor.js'
import Video from '@/plugins/video-editor.js'

export default {
    props: ['label', 'mandatory', 'rules', 'value'],
    data() { 
        return {
            editor: new Editor({
                extensions: [
                new BulletList(),
                new HardBreak(),
                new Heading({ levels: [1, 2, 3] }),
                new ListItem(),
                new OrderedList(),
                new Link(),
                new Bold(),
                new Italic(),
                new Underline(),
                new History(),
                new CaptionImage(),
                new Video()],
                onUpdate: ({getHTML}) => {
                    this.$emit('input', getHTML())
                },
                content: this.value
            }),
            intenralRules: this.rules,
            errorMessages: []
        }
    },
    created() {
        this.internalRules = this.internalRules || [];
        if (this.mandatory) {
            this.internalRules.push((v) => (!!v && v !='<p></p>') || "This field is required")
        }
    },
    components: {
         EditorContent, 
         EditorMenuBar 
    },
    methods: {
      showImagePrompt(command) {
        const src = prompt('Enter the url of your image here')
        if (src !== null) {
            command({ src })
        }
      },
      showVideoPrompt(command)  {
          const youtube_parser = (url) => {
            var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
            var match = url.match(regExp);
            return (match&&match[7].length==11)? match[7] : false;
          }
        const src = youtube_parser(prompt('Enter the url of your YouTube video here'))
        if (src) {
            command({src: `https://www.youtube.com/embed/${src}`})
        }
      }
    },
    watch: {
        value(newValue) {
            if (newValue === this.editor.getHTML()) return;
            
            this.editor.setContent(newValue)
        }
    }
}
</script>

<style scoped>
    .editor {
        width: 100%;
        height: 100%;
    }

    .ProseMirror {
        height: 100%;
        margin-top: 3px;
        padding: 10px;
    }

    .html-editor .v-messages {
        display: none;
    }

    .html-editor .v-input__slot {
        margin-bottom: 0;
    }
</style>