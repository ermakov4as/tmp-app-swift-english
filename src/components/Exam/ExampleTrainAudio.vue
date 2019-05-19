<template>
    <div>
        <h5 class="my-2">Аудиальный тренажер-экзамен</h5>
        <div class="card mb-1">
            <div class="gr-card-body h100">
                <div class="d-flex h100">
                    <div class="d-flex align-items-center justify-content-center h100 flex-grow-1">
                        <div class="image-wrapper" @click="playAudio(question['question_audio'])">
                            <i class="material-icons">
                                volume_up
                            </i>
                        </div>
                    </div>
                    <div class="d-flex align-items-end h100" v-if="!show_en">
                        <span class="show_text" @click="show_en=true">
                            Text
                        </span>
                    </div>
                    <div v-else>
                        <div class="d-flex align-items-center justify-content-center h100 flex-grow-1">
                            {{current_example.en}}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="card">
            <div class="gr-card-body h100">
                <div class="d-flex h100">
                    <div class="d-flex align-items-center justify-content-center h100 flex-grow-1">
                        <div class="image-wrapper" @click="playAudio(question['answer_audio'])">
                            <i class="material-icons">
                                volume_up
                            </i>
                        </div>
                    </div>
                    <div class="d-flex align-items-end h100" v-if="!show_ru">
                        <span class="show_text" @click="show_ru=true">
                            Текст
                        </span>
                    </div>
                    <div v-else>
                        <div class="d-flex align-items-center justify-content-center h100 flex-grow-1">
                            {{current_example.ru}}
                        </div>
                    </div>
                </div>
            </div>
            <!--<div v-if="show_translate===false" class="card-body">-->
            <!--<div class="text-center">-->
            <!--<div class="text-underline" @click="show_translate=true">-->
            <!--Показать перевод-->
            <!--</div>-->
            <!--</div>-->
            <!--</div>-->
            <!--<div v-else class="card-body" @click="playAudio(current_example.id, 'ru', current_example.card)">-->
            <!--<div class="float-left">-->
            <!--<i class="material-icons">-->
            <!--volume_up-->
            <!--</i>-->
            <!--</div>-->
            <!--<div class="text-center">-->
            <!--{{current_example.ru}}-->
            <!--</div>-->
            <!--</div>-->
        </div>
    </div>
</template>

<script>
    export default {
        name: "example-train-audio",
        props: ['question', 'show_translate'],
        data() {
            return {
                base_url: process.env.BASE_URL,
                snd: "",
                show_en: false,
                show_ru: false,
            }
        },
        methods: {
            playAudio(source) {
                if (this.snd)
                    this.snd.pause();
                this.snd = new Audio(source);
                this.snd.play();
            },
        },
        watch: {
            question(to, from) {
                this.show_en = false;
                this.show_ru = false;
                this.playAudio(to['question_audio']);
            }
        }
    }
</script>

<style scoped>
    .text-underline {
        text-decoration: underline;
        cursor: pointer;
    }

    .image-wrapper {
        border-radius: 50%;
        border: 1px solid black;
        padding: 10px;
        cursor: pointer;
    }

    .show_text {
        text-decoration: underline;
        cursor: pointer;
        width: 75px;
    }

    .material-icons {
        font-size: 40px;
    }

    .card {
        height: 75px;
    }

    .h100 {
        height: 100%
    }

    .gr-card-body {
        padding: 10px;
    }

    .material-icons {
        display: block;
    }
</style>