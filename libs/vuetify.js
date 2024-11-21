import 'vuetify/dist/vuetify.min.css';
import '@mdi/font/css/materialdesignicons.css';
import 'vuetify/styles';

import { createVuetify } from 'vuetify';
import { aliases, mdi } from 'vuetify/iconsets/mdi';

import {
    VCard,
    VCardText,
    VCardTitle,
    VContainer,
    VRow,
    VCol,
    VTextField,
    VBtn,
    VForm,
    VTextarea,
    VPagination,
} from 'vuetify/components';

export default createVuetify({
    components: {
        VCard,
        VCardText,
        VCardTitle,
        VContainer,
        VRow,
        VCol,
        VTextField,
        VBtn,
        VForm,
        VTextarea,
        VPagination,
    },
    theme: {
        defaultTheme: 'dark',
    },
    icons: {
        defaultSet: 'mdi',
        aliases,
        sets: {
            mdi,
        },
    },
});
