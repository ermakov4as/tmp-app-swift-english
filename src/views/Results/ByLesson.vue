<template>
    <div v-if="loading_data">
        <div class="text-center mt-5">
            <i class='fa fa-spinner fa-pulse fa-10x' style="font-size: 50px;"></i>
        </div>
    </div>
    <div v-else>
        <div v-for="(lesson, index) in lessons_data" class="row">
            <div class="col-12 col-lg-8 offset-lg-2">
                <h2>
                    {{lesson.lesson_name}}
                    <span v-if="lesson.payment">
                    (<span class="text-green">+{{lesson.payment}}₽</span>)
                </span>
                </h2>
                <div class="d-flex justify-content-between align-items-baseline mb-1">
                    <div class="uppercase">
                        Теория
                    </div>
                    <div class="border_dotted flex-grow-1"></div>
                    <div>
                        {{lesson.statistics.exam.passed}}/{{lesson.statistics.exam.total}}
                        ({{lesson.statistics.exam.result}} баллов)
                    </div>
                </div>
                <div class="d-flex justify-content-between align-items-baseline mb-2">
                    <div class="uppercase">
                        Практика
                    </div>
                    <div class="border_dotted flex-grow-1"></div>
                    <div>
                        {{lesson.statistics.homework.passed}}/{{lesson.statistics.homework.total}}
                        ({{lesson.statistics.homework.result}} баллов)
                    </div>
                </div>
                <div class="d-flex align-items-center justify-content-between" v-if="lesson.practice_sentences.length">
                    <div class="mr-3">
                        <h4 v-if="!lesson.hide">Результаты практической работы</h4>
                    </div>
                    <div class="hide_btn" @click="toggle_results(index)">
                        <span v-if="!lesson.hide">(cкрыть)</span>
                        <span v-else class="show_btn">(показать результаты)</span>
                    </div>
                </div>
                <div v-if="!lesson.hide">
                    <div v-for="sentence in lesson.practice_sentences" class="sentence_container mb-2">
                        <div class="row">
                            <div class="col-12 mb-2">
                                <div class="bb-small-input d-flex"
                                     :class="{'cursor_pointer': sentence.question_audio}"
                                     @click="playAudio(sentence.question_audio)">
                                    <div class="flex-grow-1 d-flex justify-content-center align-items-center">
                                        <b>{{sentence.question}}</b>
                                    </div>
                                    <div class="d-flex align-items-center">
                                        <div v-if="sentence.question_audio">
                                            <img class="bb-icon" :src="icon_url('speaker.png')">
                                        </div>
                                        <div v-else>
                                            <img class="bb-icon" :src="icon_url('muted.png')">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row mb-2">
                            <div class="col-sm-4">
                                <div v-if="sentence.task">
                                    <img class="img-fluid" :src="sentence.task.image">
                                </div>
                            </div>
                            <div class="col-sm-6 col-8">
                                <div>
                                    <b>Задание:</b> {{sentence.task.description}}
                                </div>
                                <div v-if="sentence.comment">
                                    <b>Комментарий куратора:</b> {{sentence.comment}}
                                </div>
                            </div>
                            <div class="col-sm-2 col-4">
                                <div class="d-flex flex-column align-items-center">
                                    <div>
                                        <b>Оценка</b>
                                    </div>
                                    <div class="result text-center">
                                        {{sentence.result}}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>

<script>
    import { SERVgetLearningPracticeDuoClb } from "../../server/server"

    export default {
        name: 'practice',
        props: ['cards'],
        data() {
            return {
                lessons_data: [],
                loading_data: true,
                snd: undefined
            }
        },
        methods: {
            icon_url(icon) {
                return require(`@/assets/icons/${icon}`);
            },
            toggle_results(index) {
                this.lessons_data[index].hide = !this.lessons_data[index].hide;
            },
            get_datetime(json_datetime) {
                let datetime = new Date(json_datetime);
                return datetime.getDate() + "/" + (datetime.getMonth() + 1) + "/" + datetime.getFullYear();
            },
            playAudio(source) {
                if (this.snd) {
                    this.snd.pause();
                }
                this.snd = new Audio(source);
                this.snd.play();
            }
        },

        created() {
            SERVgetLearningPracticeDuoClb((res) => {
                this.loading_data = false
                if (res.success) {
                    this.lessons_data = res.response.data
                    for (let index = 0; index < this.lessons_data.length; index++) {
                        this.$set(this.lessons_data[index], 'hide', true)
                    }
                }
            })
        }
    }
</script>
<style scoped>
    .text-green {
        color: #00b800;
    }

    .sentence_container {
        background-color: #D1DDE9;
        padding: 15px;
    }

    .result {
        color: #00b800;
        font-size: 60px;
        font-weight: bold;
    }

    .hide_btn {
        color: gray;
        cursor: pointer;
    }

    .bb-small-input {
        background-color: #fff;
        border-radius: 10px;
        /*border: 2px solid #0D2D44;*/
        padding: 10px;
    }

    .bb-icon {
        height: 30px;
    }

    .bb-gray-text {
        color: gray;
        font-size: 16px;
    }

    .cursor_pointer {
        cursor: pointer;
    }

    .hidden {
        opacity: 0;
    }

    .uppercase {
        text-transform: uppercase;
    }

    .border_dotted {
        border-bottom: 2px dotted black;
        margin-left: 5px;
        margin-right: 5px;
    }

    .show_btn {
        color: dodgerblue;
        font-size: 18px;
    }

    .show_btn:hover {
        color: #1459a6;
    }
</style>
