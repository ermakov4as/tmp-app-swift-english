<template>
    <div class="mb-4">
        <div v-if="access_days >= 9">
            <div class="light-card">
                <div class="mb-2">
                    <sentence-area v-bind.sync="unit"></sentence-area>
                </div>
                <div class="mb-2">
                    <settings v-bind.sync="unit"></settings>
                </div>
                <div class="d-flex justify-content-between">
                    <router-link :to="{name: 'dictionary'}" class="btn bb-btn-outline-black">
                        Отмена
                    </router-link>
                    <div class="btn bb-btn btn-success" @click="save_unit">
                        Сохранить
                    </div>
                </div>
            </div>
        </div>
        <div v-else>
            <h3>Редактирование словаря будет доступно с 9-го дня обучения</h3>
            <p>Дней осталось: {{ 9 - access_days }}</p>
        </div>
    </div>
</template>

<script>
    import { SERVgetUnit, SERVputSaveUnit } from "../../server/server"
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
                    answer: ""
                },
                access_days: 0
            }
        },
        methods: {
            icon_url(icon) {
                return require(`@/assets/icons/${icon}`);
            },
            save_unit() {
                let reqSaveUnit = {
                    id_unit: this.$route.params.id,
                    unit: this.unit
                }
                SERVputSaveUnit(reqSaveUnit, (res) => {
                    this.unit = res.data
                })
            }
        },
        created() {
            let reqUnit = {
                id_unit: this.$route.params.id
            }
            SERVgetUnit(reqUnit, (res) => {
                this.unit = res.data
            })
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