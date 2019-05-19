<template>
    <div>
        <h3 v-if="!dict_unit_list.length">Обновление списка...</h3>
        <div v-for="(unit, index) in dict_unit_list" :key="unit.id" v-if="unit.learning_state !== LEARNING_STATES.DONE"
             class="mb-2">
            <div class="light-card">
                <div class="d-flex justify-content-between mb-1">
                    <div>
                        <div v-if="unit.comment">
                            {{unit.comment}}
                        </div>
                    </div>
                    <div class="btn bb-btn bg-red bb-close" @click="remove_units(unit)">
                        X
                    </div>
                </div>
                <!--Предложение на английском-->
                <div class="d-flex mb-2">
                    <div class="bb-input d-flex justify-content-between flex-grow-1"
                         :class="{'cursor_pointer': unit.question_audio}"
                         @click="playAudio(unit.question_audio)">
                        <div class="flex-grow-1 d-flex justify-content-center align-items-center">
                            {{unit.question}}
                        </div>
                        <div class="d-flex align-items-center">
                            <div v-if="unit.sent_to_voice">
                                <img class="bb-icon" :src="icon_url(ICONS.waiting)">
                            </div>
                            <div v-else-if="unit.question_audio">
                                <img class="bb-icon" :src="icon_url(ICONS.speaking)">
                            </div>
                            <div v-else>
                                <img class="bb-icon" :src="icon_url(ICONS.muted)">
                            </div>
                        </div>
                    </div>
                    <!-- <div class="d-flex align-items-center ml-2">
                        <router-link :to="{name: 'dict_edit', params: {id: unit.id}}" tag="div" class="bb-edit-icon">
                            <img class="bb-icon" :src="icon_url('edit.png')">
                        </router-link>
                    </div> -->
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
                                 :class="unit.learning_state===LEARNING_STATES.VOICE || unit.learning_state===LEARNING_STATES.REVERSED ? 'bg-red' : 'bg-black'"></div>
                            <div class="colored_dot"
                                 :class="unit.learning_state===LEARNING_STATES.REVERSED ? 'bg-red' : 'bg-black'"></div>
                        </div>
                    </div>
                    <div class="bb-small-input flex-grow-1 d-flex"
                         :class="{'cursor_pointer': unit.answer_audio}"
                         @click="playAudio(unit.answer_audio)">
                        <div class="flex-grow-1 d-flex justify-content-center align-items-center bb-gray-text">
                            {{unit.answer}}
                        </div>
                        <div class="d-flex align-items-center">
                            <div v-if="unit.sent_to_voice">
                                <img class="bb-icon" :src="icon_url(ICONS.waiting)">
                            </div>
                            <div v-else-if="unit.answer_audio">
                                <img class="bb-icon" :src="icon_url(ICONS.speaking)">
                            </div>
                            <div v-else>
                                <img class="bb-icon" :src="icon_url(ICONS.muted)">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <h3 v-if="dict_unit_list.length">Изученные</h3>
        <div v-for="(unit, index) in dict_unit_list" :key="unit.id" v-if="unit.learning_state === LEARNING_STATES.DONE"
             class="mb-2">
            <div class="light-card">
                <div class="d-flex justify-content-between mb-1">
                    <div>
                        <div v-if="unit.comment">
                            {{unit.comment}}
                        </div>
                    </div>
                    <div class="btn bb-btn bg-red bb-close" @click="remove_units(unit)">
                        X
                    </div>
                </div>
                <!--Предложение на английском-->
                <div class="d-flex mb-2">
                    <div class="bb-input d-flex justify-content-between flex-grow-1"
                         :class="{'cursor_pointer': unit.question_audio}"
                         @click="playAudio(unit.question_audio)">
                        <div class="flex-grow-1 d-flex justify-content-center align-items-center">
                            {{unit.question}}
                        </div>
                        <div class="d-flex align-items-center">
                            <div v-if="unit.sent_to_voice">
                                <img class="bb-icon" :src="icon_url(ICONS.waiting)">
                            </div>
                            <div v-else-if="unit.question_audio">
                                <img class="bb-icon" :src="icon_url(ICONS.speaking)">
                            </div>
                            <div v-else>
                                <img class="bb-icon" :src="icon_url(ICONS.muted)">
                            </div>
                        </div>
                    </div>
                    <!-- <div class="d-flex align-items-center ml-2">
                        <router-link :to="{name: 'dict_edit', params: {id: unit.id}}" tag="div" class="bb-edit-icon">
                            <img class="bb-icon" :src="icon_url('edit.png')">
                        </router-link>
                    </div> -->
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
                                 :class="unit.learning_state===LEARNING_STATES.VOICE || unit.learning_state===LEARNING_STATES.REVERSED ? 'bg-red' : 'bg-black'"></div>
                            <div class="colored_dot"
                                 :class="unit.learning_state===LEARNING_STATES.REVERSED ? 'bg-red' : 'bg-black'"></div>
                        </div>
                    </div>
                    <div class="bb-small-input flex-grow-1 d-flex"
                         :class="{'cursor_pointer': unit.answer_audio}"
                         @click="playAudio(unit.answer_audio)">
                        <div class="flex-grow-1 d-flex justify-content-center align-items-center bb-gray-text">
                            {{unit.answer}}
                        </div>
                        <div class="d-flex align-items-center">
                            <div v-if="unit.sent_to_voice">
                                <img class="bb-icon" :src="icon_url(ICONS.waiting)">
                            </div>
                            <div v-else-if="unit.answer_audio">
                                <img class="bb-icon" :src="icon_url(ICONS.speaking)">
                            </div>
                            <div v-else>
                                <img class="bb-icon" :src="icon_url(ICONS.muted)">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { SERVdeleteRemoveUnits, SERVgetDictionary } from "../../server/server"

    export default {
        name: "UnitsList",
        data() {
            return {
                LEARNING_STATES: {
                    TEXT: 'text',
                    VOICE: 'sound',
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
                dict_unit_list: [],
                show_done: false,
                snd: undefined,
                selected_units_id: [],
                show_unit: undefined,
                show_unit_field: undefined,
                ICONS: {
                    muted: "muted.png",
                    waiting: "rotating-arrows-circle.png",
                    speaking: "speaker2.png"
                },
                access_days: 0
            }

        },
        methods: {
            remove_units(unit) {
                this.selected_units_id = [unit.id]
                let $app = this
                let reqRemoveUnits = {
                    units_list: $app.selected_units_id
                }
                SERVdeleteRemoveUnits(reqRemoveUnits, (res) => {
                    for (let index = 0; index < this.selected_units_id.length; index++) {
                            let dict_index = this.dict_unit_list.findIndex((element) => {
                                return element.id === $app.selected_units_id[index]
                            })
                            $app.dict_unit_list.splice(dict_index, 1)
                        }
                        $app.selected_units_id = []
                })
            },
            icon_url(icon) {
                try {
                    return require(`@/assets/icons/${icon}`);
                } catch (e) {
                    console.log(e, icon)
                }

            },
            playAudio(source) {
                if (this.snd) {
                    this.snd.pause();
                }
                this.snd = new Audio(source);
                this.snd.play();
            }
        },
        computed: {
            learned_count() {
                let count = 0;
                if (this.dict_unit_list) {
                    for (let index = 0; index < this.dict_unit_list.length; index++) {
                        if (this.dict_unit_list[index].learned) {
                            count++;
                        }
                    }
                }
                return count
            },
            unknown_count() {
                if (this.dict_unit_list) {
                    return this.dict_unit_list.length - this.learned_count;
                }
                return 0
            }

        },
        created() {
            SERVgetDictionary((res) => {
                this.dict_unit_list = res.data
            })
        }
    }
</script>

<style scoped>
    .cursor_pointer {
        cursor: pointer;
    }

    .switcher_text {
        text-align: center;
        font-size: 20px;
        padding: 5px;
    }

    .gr-btn {
        cursor: pointer;
    }

    .gr-btn:hover {
        background-color: #D1DDE9;
    }

    .gr-active {
        background-color: #D1DDE9;
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

    .bb-close {
        height: 35px;
    }

    .bb-form-control {
        width: 90%;
        padding: 0;
        height: auto;
    }

    .bb-button-title {
        font-size: 18px;
    }

    .bb-border-none {
        border: 0;
        border-radius: 0;
    }
</style>