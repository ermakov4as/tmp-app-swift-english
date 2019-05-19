<template>
    <div v-if="question">
        <!--<h5 class="my-2">Визуальный тренажер-экзамен</h5>-->
        <div class="card mb-1 ">
            <!-- <div class="card-body .gr-card-body" @click="playAudio(question['question_audio'])"> -->
            <div class="card-body .gr-card-body">
                <div class="d-flex h100 text-center">
                    <!-- <div class="d-flex align-items-center h100 mr-2">
                        <i class="material-icons">
                            volume_up
                        </i>
                    </div> -->
                    <div class="d-flex align-items-center justify-content-center h100 flex-grow-1">
                         <span v-html="question.answer"></span>
                    </div>
                </div>

            </div>
        </div>
        <!-- <div class="card question-card">
            <div v-if="show_translate===false" class="card-body">
                <div class="d-flex h100">
                    <div class="d-flex align-items-center justify-content-center h100 flex-grow-1">
                        <div class="text-underline" @click="change_show_trans_val">
                            Показать перевод
                        </div>
                    </div>
                </div>
            </div>
            <div v-else class="card-body" @click="playAudio(question['answer_audio'])">
                <div class="d-flex h100">
                    <div class="d-flex align-items-center h100 mr-2">
                        <i class="material-icons">
                            volume_up
                        </i>
                    </div>
                    <div class="d-flex align-items-center justify-content-center h100 flex-grow-1">
                        <span v-html="question.answer"></span>
                    </div>
                </div>
            </div>
        </div> -->
    </div>
</template>

<script>
    export default {
        name: "example-train-visual",
        props: ['question', 'show_translate'],
        data() {
            return {
                base_url: process.env.BASE_URL,
                snd: undefined
            }
        },
        methods: {
            playAudio(source) {
                if (this.snd)
                    this.snd.pause();
                this.snd = new Audio(source);
                this.snd.play();
            },
            change_show_trans_val() {
                this.$emit('change_translate');
            }
        }
        // ,
        // watch: {
        //     question(to, from) {
        //         this.playAudio(to['question_audio']);
        //     }
        // }
    }
</script>

<style scoped>
    .text-underline {
        text-decoration: underline;
        cursor: pointer;
    }

    .h100 {
        height: 100%;
    }

    .card-body {
        /* cursor: pointer; */
        height: 80px;
    }

    .gr-card-body {
        padding: 0;
    }
    span {
        margin-left: 5px;
    }
</style>