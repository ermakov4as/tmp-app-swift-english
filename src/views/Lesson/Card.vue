<template>
    <div class="row">
        <div class="col-lg-10 offset-lg-1">
            <content-viewer :blocks="card_content"></content-viewer>
            <div v-if="examples.length">
                <examples-component :examples="examples"></examples-component>
            </div>
        </div>
    </div>
</template>
<script>
    import ContentViewer from '../../components/Lesson/ContentViewer.vue'
    import ExamplesComponent from "../../components/Lesson/ExamplesComponent"
    import { SERVgetCardExamples } from "../../server/server"


    export default {
        name: "card-item",
        props: ['lesson'],
        components: {
            ContentViewer,
            ExamplesComponent,
        },
        data() {
            return {
                card_content: [],
                examples: [],
            }
        },
        methods: {
            install_content() {
                this.card_content = JSON.parse(this.lesson.cards[this.$route.params.number - 1].content)
                while (this.examples.length > 0) this.examples.pop()
                let reqCardExamples = {
                    id_lesson: this.$route.params.id,
                    id_card: this.$route.params.number
                }
                SERVgetCardExamples(reqCardExamples, (res) => {
                    this.examples = res.data
                    this.shuffle_examples()
                })
            },
            shuffle_examples() {
                for (let i = this.examples.length - 1; i > 0; i--) {
                    let randomIndex = Math.floor(Math.random() * i);
                    let temp = this.examples[i];
                    this.$set(this.examples, i, this.examples[randomIndex]);
                    this.$set(this.examples, randomIndex, temp);

                }
            }
        },
        watch: {
            $route(from, to) {
                this.install_content()
            }
        },
        created() {
            this.install_content()
        }
    }
</script>

<style scoped>
</style>