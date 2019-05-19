<template>
    <div v-if="loading_data">
        <div class="text-center mt-5">
            <i class='fa fa-spinner fa-pulse fa-10x' style="font-size: 50px;"></i>
        </div>
    </div>
    <div v-else-if="lessons_data.length">
        <div class="row">
            <div class="col-lg-8 offset-lg-2">
                <grammar-component :card="current_card"></grammar-component>
            </div>
        </div>
        <div class="row mt-5">
            <div class="col-lg-8 offset-lg-2">
                <div v-for="lesson in lessons_data">
                    <div class="lesson-header">{{lesson.name}}</div>
                    <div class="card mb-2" :class="{active: current_card===card}" v-for="card in lesson['cards']">
                        <div class="gt-card-body" @click="current_card=card">
                            <div class="row">
                                <div class="col-sm-6 mb-2 mb-sm-0 col-xl-8">
                                    <div class="card-text">
                                        <span class="gt-card-title">{{card.name}}</span>
                                    </div>
                                </div>
                                <!--<div class="col-6 col-sm-3 col-xl-2">-->
                                <!--<div class="d-flex align-items-center">-->
                                <!--<img src="https://cdn0.iconfinder.com/data/icons/everyday-objects-line-art-1/128/stopwatch-512.png"-->
                                <!--class="stats-img mr-2">-->
                                <!--<div>{{Math.round(card.play_time / 60)}} MIN</div>-->
                                <!--</div>-->
                                <!--</div>-->
                                <div class="col-6 col-sm-3 col-xl-2 offset-12 offset-sm-3 offset-xl-2">
                                    <div class="d-flex align-items-center mr-2">
                                        <img src="https://cdn2.iconfinder.com/data/icons/simple-medical/256/Dr._Slip-512.png"
                                            class="stats-img mr-2">
                                        <div>{{card.sentence_count}}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div v-else>
        <h3>Нет доступных тем для тренировки.</h3>
        <p>Они будут доступны после прохождения экзаменов урока</p>
    </div>
</template>

<script>
    import GrammarComponent from '../components/GrammarComponent.vue'
    import { SERVgetPlaylistDuoClb } from '../server/server'

    export default {
        name: 'home',
        props: ['cards'],
        data() {
            return {
                control_type: 'simulator',
                lessons_data: [],
                current_card: undefined,
                loading_data: true
            }
        },
        methods: {
            changeType(type) {
                this.control_type = type;
            },
            find_current_lesson(element, index, array) {
                if (this.$route.params.lesson_number) {
                    if (element.order === this.$route.params.lesson_number) {
                        return element;
                    }
                }
                return array[0]
            },
            find_current_card(element, index, array) {
                if (this.$route.params.card_number) {
                    if (element.order === this.$route.params.card_number) {
                        return element;
                    }
                }
                return array[0]
            },
            choose_card() {
                if (this.$route.params.lesson_number) {
                    let lesson = this.lessons_data.find(x => x.order == this.$route.params.lesson_number-1);
                    if (lesson) {
                        if (this.$route.params.card_number) {
                            let card = lesson.cards.find(x => x.order == this.$route.params.card_number-1);
                            if (card) {
                                this.current_card = card;
                                return;
                            }
                        }
                        if (lesson.cards.length) {
                            this.current_card = lesson.cards[0];
                            return;
                        }
                    }

                }
                if (this.lessons_data.length) {
                    if (this.lessons_data[0]['cards'].length) {
                        this.current_card = this.lessons_data[0].cards[0];
                    }
                }

            }

        },
        components: {
            GrammarComponent
        },
        created() {
            SERVgetPlaylistDuoClb((res) => {
                if (res.success) {
                    this.loading_data = false;
                    this.lessons_data = res.response.data['lessons']
                    if (this.lessons_data.length) {
                        if (this.lessons_data[0]['cards'].length) {
                            this.choose_card();
                        }
                    }
                } else {
                    this.loading_data = false
                }
            })
        },
        watch: {
            $route: function () {
                this.choose_card()
            }
        }
    }
</script>
<style scoped>
    .active {
        background-color: #d1dde9;
    }

    .gt-card-body {
        margin: 15px;
        cursor: pointer;
    }

    .gt-card-title {
        font-size: 16px;
    }

    .gt-img {
        max-height: 100px;
        cursor: pointer;
    }

    p {
        margin-bottom: 0;
    }

    .stats-img {
        height: 30px;
    }
</style>
