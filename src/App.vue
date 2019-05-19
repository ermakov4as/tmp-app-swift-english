<template>
    <div id="app">
        <router-view></router-view>
        <div class="blue-line"></div>
        <notifications group="auth" 
            position="top center"
            classes="auth-notification"
            animation-type="velocity"
            :width="500"
        ></notifications>
    </div>
</template>
<script>
    import './assets/style/main.styl'
    export default {
        created() {
            if (this.$route.query.auth) {
                this.$store.commit('token', this.$route.query.auth);
                this.$router.replace({'query': null});
            }
        }
    }
</script>

<style scope lang="stylus">
    @import '~@/assets/style/main';
    $part-blue-line = 33%
    .blue-line
        background-color $blue
        bottom 0px
        height 100%
        width $part-blue-line
        position absolute
        margin 0
        right 0px
        z-index -1
        @media (min-width 576px)
            width 100%
            height $part-blue-line
</style>
