<template>
    <div v-if="user">
        <heading></heading>
        <router-view/>
        <footing></footing>
    </div>
    <div v-else class="cssload-thecube">
        <div class="cssload-cube cssload-c1"></div>
        <div class="cssload-cube cssload-c2"></div>
        <div class="cssload-cube cssload-c4"></div>
        <div class="cssload-cube cssload-c3"></div>
    </div>
</template>

<script>
    import './assets/style/spinner.css'
    import Heading from './components/Site/SiteHeader.vue'
    import Footing from './components/Site/SiteFooter.vue'

    import { SERVgetUserDuoClb } from './server/server'

    export default {
        name: "BaseContainer",
        data: () => {
            return {
                user: false
            }
        },
        components: {
            Heading,
            Footing
        },
        created() { 
            SERVgetUserDuoClb((user) => this.user = user)
        }
    }
</script>

<style scope lang="stylus">
.logo
    background-color    : rgba(255,255,255,0.0);
    top                 : 20px;
    height              : 30px;
    margin              : 0;
    left                : 18px;
</style>