import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VTooltip from 'v-tooltip'
import vClickOutside from 'v-click-outside'
import VueMatchHeights from 'vue-match-heights'
import Notifications from 'vue-notification'
import velocity from 'velocity-animate'
import VueTextareaAutosize from 'vue-textarea-autosize'

Vue.use(VueTextareaAutosize);
Vue.use(VueMatchHeights, {
    disabled: [768], // Optional: default viewports widths to disabled resizing on. Can be overridden per usage
});
Vue.use(VTooltip);
Vue.use(vClickOutside);
Vue.use(Notifications, {velocity});
Vue.config.productionTip = false;

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');
