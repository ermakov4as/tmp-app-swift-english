<template>
    <div>
        <!--<div class="title">
            Укажите источник:
        </div>
        <div class="d-flex justify-content-between align-items-center flex-wrap mb-3">
            <div class="btn-wrapper mr-2" data-toggle="modal" data-target="#finished_lessons_modal">
                <div class="bb-btn" @click="download_lessons">
                    Из пройденных уроков
                </div>
            </div>-->
            <!--<div class="btn-wrapper" data-toggle="modal" data-target="#file_lessons_modal">
                <div class="bb-btn">
                    Из файла txt
                </div>-->
            <!--<div v-if="access_days >= 9" class="btn-wrapper" data-toggle="modal" data-target="#input_lessons_modal">
                <div class="bb-btn">
                    Ввести вручную
                </div>
            </div>
        </div>-->
        <!--<div v-for="(unit) in dict_unit_list" :key="unit.id"
             class="mb-2">
            <div class="light-card">
                <div class="d-flex justify-content-between mb-1">

                </div>-->
                <!--Предложение на английском-->
                <!--<div class="d-flex mb-2 align-items-center">
                    <div class="bb-input d-flex justify-content-between flex-grow-1 mr-2">
                        <div class="flex-grow-1 d-flex justify-content-center align-items-center">
                            {{unit.question}}
                        </div>
                    </div>
                    <div class="btn bb-close-btn bg-red bb-close" @click="remove_unit(unit)">
                        X
                    </div>
                </div>-->
                <!--Предложение на русском-->
                <!--<div class="d-flex mb-2">
                    <div class="bb-small-input flex-grow-1 d-flex">
                        <div class="flex-grow-1 d-flex justify-content-center align-items-center bb-gray-text">
                            {{unit.answer}}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="mb-2 light-card" v-if="dict_unit_list.length">
            <settings v-bind.sync="settings"></settings>
            <div class="d-flex justify-content-between mt-2" v-if="!requested">
                <router-link :to="{name: 'dictionary'}" class="btn bb-btn-outline-black">
                    Отмена
                </router-link>
                <div class="btn bb-add-btn btn-success" @click="save_unit_list">
                    Добавить ({{dict_unit_list.length}})
                </div>
            </div>
            <div class="d-flex justify-content-between mt-2" v-else>
                <button type="button" class="btn bb-add-btn btn-success disabled">
                    Пожалуйста, подождите <i class='fa fa-spinner fa-pulse'></i>
                </button>
            </div>
        </div>-->
        <!--MODALS-->
        <div class=""  tabindex="-1" role="dialog"
             aria-labelledby="exampleModalLabel"
             aria-hidden="true">
            <div class="modal-dialog modal-lg" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Добавление из уроков</h5>
                        <!--<button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>-->
                    </div>
                    <div class="modal-body">
                        <ul class="lesson_list">
                            <li v-for="(lesson, index) in lessons" v-if="lesson.cards.length > 0" :key="index">
                                {{lesson.name}}
                                <ul class="card_list">
                                    <li v-for="(card, index) in lesson.cards" v-if="card.aams.length > 0" :key="index"
                                        class="d-flex align-items-center justify-content-between">
                                        <div class="name">
                                            <input type="checkbox" class="form-check-input mr-3" v-model="card.checked">
                                            {{card.name}}
                                        </div>
                                        <div class="counter">
                                            ({{card.aams.length}})
                                        </div>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn bb-btn-outline-black" data-dismiss="modal">Отмена</button>
                        <button type="button" class="btn bb-add-btn btn-success disabled" v-if="selected_count === 0">
                            Добавить
                        </button>
                        <button type="button" class="btn bb-add-btn btn-success" v-else data-dismiss="modal"
                                @click="add_from_lessons">Добавить ({{selected_count}})
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { SERVgetFinishedLessons, SERVpostSaveUnitListDuoClb } from "../../server/server"
    //import { USER_ACTION } from '../../server/http-requests.js'
    import Settings from "../../components/Dictionary/Settings"

    export default {
        name: "MultipleAdd",
        components: {
            Settings
        },
        data() {
            return {
                lessons: undefined,
                //user_action_flag: false,
                dict_unit_list: [],
                settings: {
                    learning_state: 'text',
                    voice_state: 'none',
                    analysis_state: 'none',
                },
                file_lines: {
                    en: [],
                    ru: []
                },
                manual_lines: {
                    en: '',
                    ru: ''
                },
                google_translate: {
                    en: false,
                    ru: false
                },
                requested: false,
                access_days: 0
            }
        },
        methods: {
            send_lesson_info() {
                let lessons_checking = [];
                //console.log(this.lessons);
                for (let lesson_index = 0; lesson_index < this.lessons.length; lesson_index++) {
                    let cards_checked = 0;
                    for (let card_index = 0; card_index < this.lessons[lesson_index].cards.length; card_index++) {
                        if (this.lessons[lesson_index].cards[card_index].checked) {
                            cards_checked ++;
                        }
                    }
                    let lesson_info = {
                        checked: cards_checked,
                        cards_number: this.lessons[lesson_index].cards.length,
                        name: this.lessons[lesson_index].name
                    }
                    //console.log(lesson_info);
                    lessons_checking.push(lesson_info);
                }
                console.log('ooo');
                let lessons_added = [];
                for (let checking_index = 0; checking_index < lessons_checking.length; checking_index++) {
                    if (lessons_checking[checking_index].checked) {
                        let lesson = lessons_checking[checking_index];
                        let lesson_data = `${lesson.name} (${lesson.checked}/${lesson.cards_number})`;
                        lessons_added.push(lesson_data);
                    }
                }
                console.log(lessons_added);
                //this.user_action_flag = false;
                //USER_ACTION('addedListFromLesson', lessons_added)
            },

            remove_unit(unit) {
                this.dict_unit_list.splice(this.dict_unit_list.indexOf(unit), 1);
            },
            add_from_lessons() {
                try {
                    for (let lesson_index = 0; lesson_index < this.lessons.length; lesson_index++) {
                        for (let card_index = 0; card_index < this.lessons[lesson_index].cards.length; card_index++) {
                            if (this.lessons[lesson_index].cards[card_index].checked) {
                                this.dict_unit_list.push(...this.lessons[lesson_index].cards[card_index].aams);
                            }
                        }
                    }
                    this.save_unit_list();
                } catch (e) {

                }
            },
            save_unit_list() {
                let aam_id_list = [];
                let units_list = [];
                for (let index = 0; index < this.dict_unit_list.length; index++) {
                    if (this.dict_unit_list[index].id) {
                        aam_id_list.push(this.dict_unit_list[index].id)
                    } else {
                        units_list.push(this.dict_unit_list[index])
                    }
                }             
                this.requested = true
                let reqSaveUnitList = {
                    aams: aam_id_list,
                    units: units_list,
                    settings: this.settings
                }
                SERVpostSaveUnitListDuoClb(reqSaveUnitList, (res) => {
                    if (res.success) {
                        this.dict_unit_list = []
                        this.requested = false
                        this.send_lesson_info()
                        //this.user_action_flag = true
                    } else {
                        this.requested = false
                    }
                })
            }
        },
        computed: {
            selected_count() {
                let res_sum = 0;
                try {
                    for (let lesson_index = 0; lesson_index < this.lessons.length; lesson_index++) {
                        for (let card_index = 0; card_index < this.lessons[lesson_index].cards.length; card_index++) {
                            if (this.lessons[lesson_index].cards[card_index].checked) {
                                res_sum += this.lessons[lesson_index].cards[card_index].aams.length;
                            }
                        }
                    }
                } catch (e) {

                }

                return res_sum;
            },
            add_manual() {
                if (this.manual_lines.en && (this.manual_lines.ru || this.google_translate.ru)) return true
                else if (this.manual_lines.ru && (this.manual_lines.en || this.google_translate.en)) return true
                else return false
            }
        },

        created() {
            SERVgetFinishedLessons((res) => {
                this.lessons = res.data["lessons"]
            })
        }
    }
</script>

<style scoped>
    .btn-wrapper {
        min-width: 140px;
        width: 40%;
    }

    .lesson_list {
        padding-left: 10px;
    }

    .light-card {
        background-color: #D1DDE9;
        padding: 15px;
    }

    .card_list {
        padding-left: 40px;
    }

    li {
        list-style-type: none;
    }

    .bb-btn {
        padding: 5px;
        border: 1px solid #00a100;
        text-align: center;
        border-radius: 5px;
        color: #00a100;
        cursor: pointer;

    }

    .bb-btn:hover {
        background-color: #00a100;
        color: white;
    }

    .light-card {
        background-color: #D1DDE9;
        padding: 15px;
    }

    .bb-input {
        background-color: #fff;
        border-radius: 10px;
        padding: 10px;
    }

    .bb-small-input {
        background-color: #fff;
        border-radius: 10px;
        padding: 5px;
    }

    .bb-gray-text {
        color: gray;
        font-size: 16px;
    }

    .bb-close {
        height: 35px;
        padding: 5px 15px;
        border-radius: 10px;
    }

    .bb-small-close {
        padding: 2px 10px;
        border-radius: 10px;
    }

    .bb-add-btn {
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

    .wide-btn {
        padding-left: 40px;
        padding-right: 40px;
    }

    .title-text {
        font-size: 20px;
    }

    .unvisible {
        visibility: hidden;
    }

    @media (max-width: 576px) {
        .bb-btn {
            font-size: 12px;
            padding-right: 2px;
            padding-left: 2px;
        }

    }
</style>