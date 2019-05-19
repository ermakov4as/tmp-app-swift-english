<template>
    <div v-if="answered_count<total_answers_count">
        <div class="row">
            <div class="col">
                <div class="d-flex justify-content-end">
                    <h5>{{answered_count+1}} / {{total_answers_count}}</h5>
                </div>
            </div>
        </div>
        <example-train-visual :question="current_question" :show_translate="show_translate"
                              @change_translate="show_translate=true"
                              v-if="question_type==='text'"></example-train-visual>
        <div v-else>
            <div class="card-body gr-card-body">
                <div class="img-wrapper mx-auto">
                    <img :src="current_question.url" class="img-fluid mx-auto">
                </div>
            </div>
        </div>
        <div class="text-center" :class="{'hide': !is_answered}">
            <div class="alert-box d-flex align-items-center"
                 :class="is_right_answer ? 'alert-success': 'alert-danger'">
                <div class="alert-img-wrapper mr-3">
                    <img src="@/assets/icons/ok.png" class="alert-img" v-if="is_right_answer">
                    <!-- <img src="@/assets/icons/wrong.png" class="alert-img" v-else> -->
                </div>
                <div class="mr-auto" v-if="is_right_answer">Верно!</div>
                <div class="mr-auto" v-else>Неверно</div>
                <div>
                    <div class="btn btn-success" @click="nextQuestion">Далее</div>
                </div>
            </div>
        </div>
        <transition-group name="list-item" tag='div' class="row" v-if="question_type==='text'">
            <div class="col-6" v-for="answer_item in answer_list" :key="answer_item.id">
                <div class="card mb-2 gr-card"
                     @click="answer(answer_item, $event)">
                    <div class="card-body gr-card-body"
                         :class="{'right-answer': answer_item.id === correct_answer_id,
                          'wrong-answer': answer_item.id === incorrect_answer_id}">
                        <div class="img-wrapper mx-auto">
                            <img :src="answer_item.url" class="answer-img img-fluid mx-auto">
                        </div>
                    </div>
                </div>
            </div>
        </transition-group>
        <transition-group name="list-item" tag='div' class="row" v-else>
            <div class="col-12" v-for="answer_item in answer_list" :key="answer_item.id">
                <div class="card mb-2 cursor_pointer" @click="answer(answer_item, $event)">
                    <div class="card-body"
                         :class="{'right-answer': answer_item.id === correct_answer_id,
                         'wrong-answer': answer_item.id === incorrect_answer_id}">
                        <div class="d-flex h100">
                            <div class="flex-grow-1 text-center"
                                 v-html="answer_item.answer">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </transition-group>
    </div>
</template>

<script>
    import ExampleTrainVisual from "./ExampleTrainVisual"
    import VueCircle from 'vue2-circle-progress/src/index.vue'
    import { SERVgetExamQuestion, SERVpostAnswerExamQuestion } from "../../server/server"

    export default {
        components: {
            ExampleTrainVisual,
            VueCircle,
        },
        name: "exam-component",
        props: ['exam'],
        data() {
            return {
                show_translate: false,
                is_answered: false,
                is_right_answer: false,
                answer_index: 0,
                answered_count: 0,
                is_finished: undefined,
                is_passed: undefined,
                total_answers_count: 0,
                answer_node: undefined,
                current_question: {
                    id: 0,
                    url: undefined
                },
                answer_list: undefined,
                correct_answer_id: undefined,
                incorrect_answer_id: undefined,
                question_type: undefined,
                snd: undefined,
            }
        },
        methods: {
            fetch_question() {
                this.answer_list = []
                if (this.exam) {
                    let reqExamQuestion = {
                        id_lesson: this.$route.params.id
                    }
                    SERVgetExamQuestion(reqExamQuestion, (res) => {
                        this.is_finished = res.data['finished']
                            if (this.is_finished) { // Экзамен закончен
                                this.$emit('finished')
                            } else {
                                this.current_question = res.data['detail']['question']
                                this.answer_list = res.data['detail']['answers']
                                this.question_type = res.data['detail']['question_type']
                            }
                    })
                }

            },
            answer(variant, event) {
                if (!this.is_answered) {
                    let reqAnswerExamQuestion = {
                        id_lesson: this.$route.params.id,
                        question: this.current_question['id'],
                        answer: variant.id
                    }
                    SERVpostAnswerExamQuestion(reqAnswerExamQuestion, (res) => {
                        this.showAnswersAndSoudRight()
                        this.is_right_answer = res.data['correct']
                        this.correct_answer_id = res.data['answer_id']
                        if (!this.is_right_answer) {
                            this.incorrect_answer_id = variant.id;
                        }
                        this.is_answered = true
                    })
                }
            },
            showAnswersAndSoudRight(){
                if(this.question_type == 'text'){
                    this.current_question.answer += "<br>" + this.current_question.question
                    this.playAudio(this.current_question.question_audio)
                }
                if(this.question_type == 'image'){
                    for (let answer of this.answer_list){
                        answer.answer += "<br>" + answer.question
                        if(answer.id == this.current_question.id)
                            this.playAudio(answer.question_audio)
                    }
                }
                
            },
            nextQuestion() {
                this.correct_answer_id = undefined;
                this.incorrect_answer_id = undefined;
                this.answered_count++;
                this.is_answered = false;
                this.show_translate = false;
                this.fetch_question();
            },

            install_metrics() {
                this.answered_count = this.exam['answers_count'];
                this.total_answers_count = this.exam['questions_count'];
            },
            playAudio(source) {
                if (this.snd)
                    this.snd.pause();
                this.snd = new Audio(source);
                this.snd.play();
            },
        },
        watch: {
            exam(to, from) {
                this.install_metrics();
                this.fetch_question();
            },
        },
        created() {
            this.install_metrics();
            this.fetch_question();
        }
    }
</script>

<style scoped>
    .circle-header {
        padding-right: 10px;
        font-size: 25px;
        font-weight: bold;
    }

    .circle-text {
        font-weight: bold;
        font-size: 16px;
        margin-bottom: 5px;
    }

    .gr-card {
        box-shadow: 1px 1px 4px #0d2d3fa8;
        border: none;
        cursor: pointer;
        /*max-width: 450px;*/
    }

    .gr-card:hover {
        box-shadow: 1px 1px 1px #0d2d3fa8;
    }

    .gr-card-body {
        /*height: 75px;*/
        padding: 5px;
    }

    .img-wrapper {
        max-width: 450px;
    }

    .answer-img {
        cursor: pointer;
        display: block;
        height: 130px;

    }

    .hide {
        opacity: 0;
    }

    .right-answer {
        border: 3px solid #4ca64c;
        border-radius: 5px;
    }

    .wrong-answer {
        border: 3px solid #c42432;
        border-radius: 5px;
    }

    .alert-box {
        background-size: auto 35px;
        background: rgba(0, 0, 0, 0) no-repeat 2% 7px;
        border: 0;
        min-width: auto !important;
        text-align: left;
        height: 50px;
    }

    .alert-img {
        width: 44px;
        height: 44px;
    }

    .cursor_pointer {
        cursor: pointer;
    }

    @media (max-width: 576px) {


        .answer-img {
            /*max-height: 100px;*/
            height: 100px;
        }

        .gr-card-body {
            /*height: 60px;*/
            padding: 5px;
        }

        .col-6 {
            padding: 5px;
        }
    }

    .list-item-enter-active, .list-item-leave-active {
        transition: opacity 0.3s, transform 0.3s;
        transform-origin: top center;
    }

    .list-item-enter, .list-item-leave-to, .list-item-move {
        opacity: 0;
        transform: scale(0.7);
    }
</style>