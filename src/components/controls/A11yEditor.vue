<template>
    <v-container>
        <v-container v-if="loading" class="text-center"> 
            <v-progress-circular indeterminate size="100" width="10" color="#dddddd"/>
        </v-container>
        <v-container v-else>
            <v-row>
                <v-col md="6">
                    <v-text-field label="Title" v-model="title"/> 
                </v-col>
            </v-row>
            <v-row>
                <v-col md="12">
                    <html-editor label="Content" v-model="content"/>
                </v-col>
            </v-row>
            <v-row justify="center">
                <v-col>
                    <v-btn :loading="saving" @click="saveA11y" color="success">Save</v-btn>
                </v-col>
            </v-row>
        </v-container>
    </v-container>
</template>

<script>
import HTMLEditor from "./HTMLEditor"; 
import {playerEndpoint, editorEndpoint} from '@/utils/endpoints.js'
import {savePopup} from '@/utils/ui'

export default {
    name: "A11yEditor",
    created() {
        Promise.all([
            fetch(playerEndpoint + "/theme")
                .then((x) => x.json())
                .then((x) => {
                    this.appTitle = x.title;
                    this.appPrimary = x.primary;
                    this.appSecondary = x.secondary;
                }),
            fetch(editorEndpoint + "/content/a11y")
                .then((x) => (x.ok ? x.json() : Promise.reject(x)))
                .then((x) => {
                    this.title = x.title;
                    this.content = x.content;
                })
                .catch((err) => {
                    if (err.status === 404) {
                        this.method == "POST";
                        return;
                    }
                    console.log(err);
                }),
        ]).finally(() => {
            this.loading = false;
        });
    },
    components: {
        "html-editor": HTMLEditor,
    },
    data() {
        return {
            method: "PUT",
            appTitle: null,
            appPrimary: "#1F63A3",
            appSecondary: "#1F63A3",
            title: "",
            content: "",
            loading: true,
            saving: false
        };
    },
    methods: {
        saveA11y() {
            this.saving = true;

            fetch(editorEndpoint + "/content/a11y", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: this.title,
                    content: this.content,
                }),
            })
            .then((res) => {
                savePopup(res.status)
            })
            .catch((err) => {
                console.error(err)
                savePopup(false)
            })
            .finally(() => {
                this.saving = false
            })
        },
    }
};
</script>
<style scoped>
    #preview .v-card:hover {
        opacity: 0.5;
    }
    #preview {
        transform: matrix(0.75, 0, 0, 0.75, 0, 0);
        text-align: center;
        margin-top: 0px;
        margin-left: 20px;
        margin-right: 20px;
    }
</style>
