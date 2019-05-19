<template>
    <div class="mb-4">
        <div class="light-card">
            <div class="mb-2">
                <sentence-area v-bind.sync="unit"></sentence-area>
            </div>
            <div class="mb-2">
                <settings v-bind.sync="unit"></settings>
            </div>
            <div class="d-flex justify-content-between">
                <router-link :to="{name: 'dictionary'}" class="btn bb-btn-outline-black" @click="save_unit">
                    Отмена
                </router-link>
                <div class="btn bb-btn btn-success" @click="save_unit">
                    Добавить
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { SERVpostSaveUnit } from "../../server/server"
    import SentenceArea from "../../components/Dictionary/SentenceArea"
    import Settings from "../../components/Dictionary/Settings"

    export default {
        name: "Edit",
        components: {
            SentenceArea,
            Settings
        },
        data() {
            return {
                unit: {
                    question: "",
                    answer: "",
                    learning_state: "text",
                    analysis_state: "none",
                    voice_state: "none",
                    access_days: 0
                }
            }
        },
        methods: {
            icon_url(icon) {
                return require(`@/assets/icons/${icon}`);
            },
            save_unit() {
                let reqSaveUnit = {
                    unit: this.unit
                }
                SERVpostSaveUnit(reqSaveUnit, (res) => {
                    this.unit = {
                        question: "",
                        answer: "",
                        learning_state: "none",
                        analysis_state: "none",
                        voice_state: "none"
                    }
                })
            }
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


    .bb-btn-outline-black {
        padding: 5px 15px;
        border-radius: 10px;
        border: 1px solid #0D2D44;
        color: #0D2D44;
    }

    .bb-btn-outline-black:hover {
        background-color: #0D2D44;
        color: #f2f4f7;
    }
</style>