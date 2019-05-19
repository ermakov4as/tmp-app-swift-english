<template>
    <div>
        <div class="title">Озвучивание:</div>
        <div class="d-flex flex-wrap justify-content-between">
            <div class="state-btn d-flex align-items-center flex-grow-1 mr-2 mb-2 justify-content-center"
                 :class="{'selected': voice_state === VOICE_STATES.SELF}"
                 @click="change_voice_state(VOICE_STATES.SELF)">
                Самостоятельно
            </div>
            <!--<div class="state-btn flex-grow-1 mr-2 mb-2 justify-content-center"
                 :class="{'selected': voice_state === VOICE_STATES.GOOGLE}"
                 @click="change_voice_state(VOICE_STATES.GOOGLE)">
                <div>
                    <img :src="icon_url('google.png')" class="state-img">
                </div>
            </div>-->   

            <div class="state-btn d-flex align-items-center flex-grow-1 mr-2 mb-2 justify-content-center"
                 :class="{'selected': voice_state === VOICE_STATES.REQUESTED}"
                 @click="change_voice_state(VOICE_STATES.REQUESTED)">
                <div class="mr-2">
                    <img :src="icon_url('curator.png')" class="state-img">
                </div>
                <div>
                    Куратор
                </div>
            </div>
            <div class="state-btn d-flex align-items-center flex-grow-1 mb-2 justify-content-center"
                 :class="{'selected': voice_state === VOICE_STATES.NONE}"
                 @click="change_voice_state(VOICE_STATES.NONE)">
                <div class="mr-2">
                    <img :src="icon_url('none.png')" class="state-img">
                </div>
                <div>
                    Без озвучки
                </div>
            </div>
        </div>
        <div class="title">Разбор предложения:</div>
        <div class="d-flex flex-wrap" v-if="analysis_state !==  ANALYSIS_STATES.DONE">
            <div class="state-btn d-flex align-items-center mr-2 mb-2 justify-content-center"
                 :class="{'selected': analysis_state === ANALYSIS_STATES.REQUESTED}"
                 @click="change_analysis_state(ANALYSIS_STATES.REQUESTED)">
                <div class="mr-2">
                    <img :src="icon_url('edit.png')" class="state-img">
                </div>
                <div>
                    Заказать разбор
                </div>
            </div>
            <div class="state-btn d-flex align-items-center mr-2 mb-2 justify-content-center"
                 :class="{'selected': analysis_state === ANALYSIS_STATES.NONE}"
                 @click="change_analysis_state(ANALYSIS_STATES.NONE)">
                <div>
                    Без разбора
                </div>
            </div>
        </div>
        <div v-else class="d-flex">
            <div class="text">
                Разбор выполнен
            </div>
        </div>

    </div>
</template>

<script>
    export default {
        name: "Settings",
        props: ['voice_state', 'analysis_state', 'learning_state'],
        data() {
            return {
                LEARNING_STATES: {
                    TEXT: 'text',
                    VOICE: 'sound',
                    REVERSED: 'reversed',
                    DONE: 'done',
                },
                LEARNING_STATES_ICONS: {
                    text: 'text-document.png',
                    voice: 'headphones.png',
                    reversed: 'russia.png',
                    done: 'done.png',
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
            }
        },
        methods: {
            change_voice_state(state) {
                this.$emit('update:voice_state', state);
            },
            change_analysis_state(state) {
                this.$emit('update:analysis_state', state);
            },
            /*change_learning_state(state) {
                this.$emit('update:learning_state', state);
            },*/
            icon_url(icon) {
                return require(`@/assets/icons/${icon}`);
            },
        }
    }
</script>

<style scoped>
    .state-btn {
        padding: 10px 15px;
        border-radius: 15px;
        background-color: #fff;
        min-width: 100px;
        text-align: center;
        border: 1px solid white;
        cursor: pointer;
    }

    .state-img {
        height: 30px;
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

    .learning-state-btn {
        padding: 5px 15px;
        border-radius: 15px;
        background-color: #fff;
        text-align: center;
        border: 1px solid white;
        cursor: pointer;
    }

    .selected {
        border: 2px solid #28a745;
    }

    .text {
        background-color: #28a745;
        color: white;
        padding: 15px;
    }

</style>