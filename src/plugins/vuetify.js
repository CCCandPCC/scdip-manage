import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

import 'vuetify/dist/vuetify.min.css';
import colors from 'vuetify/lib/util/colors';
import Dialog from '@/components/dialog.js';

let vuetify = new Vuetify({
    theme: {
        base: colors.cyan.base
    }
});

Vue.use(Dialog, vuetify)

export default vuetify