<template>
    <div class="main-container mt-0 white-container">
        <router-view></router-view>
    </div>
</template>

<script>
    export default {
        name: "WhiteContainer"
    }
</script>

<style scoped>
    .white-container {
        background-color: #fff;
        padding: 10px;
    }
</style>