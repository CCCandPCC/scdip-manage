<template>
    <v-form ref="form">
        <v-row>
            <v-col md="auto">
                <v-card width="116" class="pa-2">
                    <v-progress-circular :indeterminate="true" v-if="loading" />
                    <label class="upl" v-else >
                        <input title="upload a new image" v-show="false" 
                            @change="selectImage" accept="image/*" type="file"/>
                        <v-img max-height="100" max-width="100" :contain="true" :src="displayImage()"/>
                    </label>
                    <v-btn v-if="image.src" :loading="deleting" class="delete" top absolute small fab @click="remove()">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-card>
            </v-col>
            <v-col v-show="image.src">
                <v-text-field outlined label="Image description (alt text)" v-model="image.alt" />
                <v-text-field outlined label="Description of the image" v-model="image.title" />
            </v-col>
        </v-row>  
    </v-form>
</template>

<script>
// TODO: right now, this could leave dangling images in S3 in a variety of ways
// So, how to fix it? I'm inclined to think that marking the files as temporary 
// with a prefix, so that it has a TTL and then changing it to a permanent file
import {uploadImage, deleteFile} from '@/utils/file.js'
import {playerEndpoint} from '@/utils/endpoints.js'

export default {
    name: "file-upload",
    props: ["value"],
    data() {
        return {
            loading: false,
            deleting: false,
            internal_image: {
                src: '',
                alt: '',
                title: ''
            }
        }
    },
    computed: {
        image: {
            get: function() {return this.internal_image},
            set: function(newValue) {
                this.internal_image = newValue || {}
                return this.$emit('input', this.internal_image)
            }
        }
    },
    created() {
        this.image = this.value
    },
    methods: {
        displayImage() {
            if (this.internal_image && this.internal_image.src)
                return playerEndpoint + '/image/' + this.internal_image.src
            
            return "/img/image-placeholder.png"
        },
        selectImage(image) {
            this.loading = true
            uploadImage(image.target.files[0])
                .then(fn => {
                    // delete the prior image
                     if (this.image.src) 
                         this.remove(this.image.src)

                    this.$set(this.image, "src", fn)
                    return fn
                })
                .catch(err => {
                    console.log(err)
                    this.image.src = ''
                })
                .finally(() => {
                    this.loading = false
                })
        },
        remove(url) {
            this.deleting = true;

            return deleteFile(url || this.internal_image.src)
                .finally(() => {
                    if (!url)
                        this.$set(this.image, "src", null)
                    
                    this.deleting = false
                })
        },
    },
    watch: {
        value(newValue) {
            this.image = newValue
        }
    }
};
</script>

<style scoped>
  .upl {
      cursor: pointer;
  }

  .delete {
      right: -20px
  }
</style>