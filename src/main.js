import {createApp} from 'vue'
import App from './App.vue'
import router from "@/router/router";
import {createPinia} from 'pinia'
import {createVuetify} from "vuetify";
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import 'v-calendar/dist/style.css';
import VCalendar from 'v-calendar';
import Toaster from '@meforma/vue-toaster';

const vuetify = createVuetify({
    components,
    directives,
    theme: {
        defaultTheme: 'myCustomTheme',
        themes: {
            myCustomTheme: {
                colors: {
                    surface: '#E1E6F9',
                    background: '#ffffff',
                    element: '#ffffff',
                    light_item: '#eef0fb'
                }
            }
        }
    }
})

const app = createApp(App)
    .use(createPinia())
    .use(router)
    .use(vuetify)
    .use(Toaster)
    .use(VCalendar, {});

app.mount('#app')
