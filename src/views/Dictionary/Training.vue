<template>
    <div v-if="downloaded">
        <div class="light-card" v-if="!error">
            <div class="d-flex mb-2">
                <!--ОПИСЫВАЕМ СОСТОЯНИЯ ВЕРХНЕЙ СТРОЧКИ-->
                <div class="bb-input d-flex justify-content-between flex-grow-1"
                     :class="{'cursor_pointer': unit.question_audio}"
                     @click="playAudio(unit.question_audio)"
                     v-if="unit.learning_state === LEARNING_STATES.TEXT || clicked">
                    <div class="d-flex justify-content-center align-items-center flex-grow-1">
                        {{unit.question}}
                    </div>
                    <div class="d-flex align-items-center">
                        <div v-if="unit.question_audio">
                            <img class="bb-icon" :src="icon_url(ICONS.speaking)">
                        </div>
                        <div v-else>
                            <img class="bb-icon" :src="icon_url(ICONS.muted)">
                        </div>
                    </div>
                </div>
                <div v-else-if="unit.learning_state === LEARNING_STATES.SOUND"
                     class="bb-input d-flex justify-content-center flex-grow-1"
                     :class="{'cursor_pointer': unit.question_audio}"
                     @click="playAudio(unit.question_audio)"
                >
                    <div class="d-flex align-items-center">
                        <div v-if="unit.question_audio">
                            <img class="bb-icon" :src="icon_url(ICONS.speaking)">
                        </div>
                        <div v-else>
                            <img class="bb-icon" :src="icon_url(ICONS.muted)">
                        </div>
                    </div>
                </div>
                <div v-else
                     class="bb-input d-flex justify-content-center flex-grow-1">
                    <div class="d-flex align-items-center">
                        <div class="bb-green-text">
                            Можешь построить английское предложение?
                        </div>
                    </div>
                </div>

                <div v-if="access_days >= 9" class="d-flex align-items-center ml-2">
                    <router-link :to="{name: 'dict_edit', params: {id: unit.id}}" tag="div" class="bb-edit-icon">
                        <img class="bb-icon" :src="icon_url('edit.png')">
                    </router-link>
                </div>
            </div>
            <!--Предложение на русском-->
            <div class="d-flex mb-2">
                <div class="d-flex align-items-center mr-2 flex-column">
                    <div class="bb-state-icon">
                        <img class="bb-icon" :src="icon_url(LEARNING_STATES_ICONS[unit.learning_state])">
                    </div>
                    <div class="d-flex align-items-center" v-if="unit.learning_state !== LEARNING_STATES.DONE">
                        <div class="colored_dot bg-red"></div>
                        <div class="colored_dot"
                             :class="unit.learning_state===LEARNING_STATES.SOUND||
                              unit.learning_state===LEARNING_STATES.REVERSED ? 'bg-red' : 'bg-black'"></div>
                        <div class="colored_dot"
                             :class="unit.learning_state===LEARNING_STATES.REVERSED ? 'bg-red' : 'bg-black'"></div>
                    </div>
                </div>
                <!--ОПИСЫВАЕМ СОСТОЯНИЯ НИЖНЕЙ СТРОЧКИ-->
                <div class="bb-small-input flex-grow-1 d-flex">
                    <div class="flex-grow-1 d-flex justify-content-center align-items-center">
                        <div class="bb-gray-text" v-if="clicked || unit.learning_state === LEARNING_STATES.REVERSED">
                            {{unit.answer}}
                        </div>
                        <div class="bb-green-text"
                             v-else-if="unit.learning_state === LEARNING_STATES.TEXT ||
                              unit.learning_state === LEARNING_STATES.SOUND">
                            Помнишь перевод?
                        </div>

                    </div>
                </div>
            </div>
            <div class="d-flex justify-content-between" v-if="!clicked">
                <div class="btn bb-btn-lg btn-danger" @click="remember">
                    Напомнить
                </div>
                <div class="btn bb-btn-lg btn-success" @click="forward">
                    Да
                </div>
            </div>
            <div class="d-flex justify-content-end" v-else>
                <div class="btn bb-btn-lg btn-success" @click="go_next">
                    Далее
                </div>
            </div>
        </div>
        <div v-else>
            Нет неизученных фраз
        </div>
    </div>
    <div v-else>
        Загрузка...
    </div>
</template>

<script>
    import { SERVgetDictionaryRandomDuoClb, SERVputDictionaryForward } from "../../server/server"

    export default {
        name: "Training",
        data() {
            return {
                LEARNING_STATES: {
                    TEXT: 'text',
                    SOUND: 'sound',
                    REVERSED: 'reversed',
                    DONE: 'done',
                },
                LEARNING_STATES_ICONS: {
                    'text': 'text-document.png',
                    'sound': 'headphones.png',
                    'reversed': 'russia.png',
                    'done': 'done.png',
                },
                VOICE_STATES: {
                    NONE: 'none',
                    SELF: 'self',
                    GOOGLE: 'google',
                    GOOGLE_PRO: 'google_pro',
                    REQUESTED: 'requested',
                    DONE: 'done'
                },
                ANALYSIS_STATES: {
                    NONE: 'none',
                    REQUESTED: 'requested',
                    DONE: 'done'
                },
                downloaded: false,
                snd: undefined,
                selected_units_id: [],
                show_unit: undefined,
                show_unit_field: undefined,
                ICONS: {
                    muted: "muted.png",
                    waiting: "rotating-arrows-circle.png",
                    speaking: "speaker2.png"
                },
                clicked: false,
                unit: {
                    id: 0,
                    question_audio: undefined,
                    answer_audio: undefined,
                    answer: undefined,
                    question: undefined,
                    learning_state: 'text'
                },
                error: false,
                access_days: 0
            }

        },
        methods: {
            icon_url(icon) {
                return require(`@/assets/icons/${icon}`);
            },
            playAudio(source) {
                if (this.snd) {
                    this.snd.pause();
                }
                this.snd = new Audio(source);
                this.snd.play();
            },
            fetch_data() {
                SERVgetDictionaryRandomDuoClb((res) => {
                    if (res.success) {
                        this.downloaded = true
                        this.unit = res.response.data
                        this.clicked = false
                        if (this.unit.question_audio) {
                            this.snd = new Audio(this.unit.question_audio)
                        }
                    }else {
                        this.downloaded = true
                        this.error = true
                    }
                })
            },
            remember() {
                this.clicked = true;
                if (this.unit.question_audio) {
                    this.playAudio(this.unit.question_audio)
                }

            },
            forward() {
                if (this.unit.question_audio) {
                    this.playAudio(this.unit.question_audio)
                }
                this.clicked = true
                let reqDictionaryForward = {
                    id: this.unit.id
                }
                SERVputDictionaryForward(reqDictionaryForward, (res) => {
                    this.clicked = true
                })
            },
            go_next() {
                if (this.snd) {
                    this.snd.pause();
                }
                this.fetch_data();
            }
        },
        created() {
            this.fetch_data();
        }
    }
</script>

<style scoped>
    .cursor_pointer {
        cursor: pointer;
    }

    .light-card {
        background-color: #D1DDE9;
        padding: 15px;
    }

    .bb-btn {
        padding: 5px 15px;
        border-radius: 10px;
    }

    .bb-input {
        background-color: #fff;
        border-radius: 10px;
        /*border: 2px solid #0D2D44;*/
        padding: 10px;
    }

    .bb-small-input {
        background-color: #fff;
        border-radius: 10px;
        /*border: 2px solid #0D2D44;*/
        padding: 5px;
    }

    .bb-emoji {
        font-size: 22px;
    }

    .bb-edit-icon {
        padding: 10px;
        background-color: rgba(31, 109, 165, 0.3);
        border-radius: 10px;
        cursor: pointer;
    }

    .colored_dot {
        border-radius: 100%;
        height: 6px;
        width: 6px;
        margin: 2px;
    }

    .bb-icon {
        max-height: 30px;
    }

    .bb-state-icon {
        padding-top: 5px;
    }

    .bb-gray-text {
        color: gray;
        font-size: 16px;
    }

    .bb-green-text {
        color: #00a100;
    }

    .bb-btn-lg {
        width: 150px;
        padding: 10px;
    }
</style>