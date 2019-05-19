<template>
    <div class="row">
        <div class="col-lg-9 mx-auto">
            <content-viewer :blocks="lesson_content"></content-viewer>
        </div>
    </div>
</template>

<script>
    import ContentViewer from "../../components/Lesson/ContentViewer"

    export default {
        name: "home",
        props: ['lesson'],
        components: {
            ContentViewer,
        },
        data() {
            return {
                lesson_content: []
            }
        },
        created() {
            if (this.lesson.content) {
                this.lesson_content = JSON.parse(this.lesson.content);
            }
        },
        watch: {
            lesson(from, to) {
                this.lesson_content = JSON.parse(this.lesson.content);
            }
        }
    }
</script>

<style scoped>

</style>