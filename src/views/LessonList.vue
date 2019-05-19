<template>
    <div v-if="lesson_list.length">
        <div class="row mb-3" v-for="(lesson, index) in lesson_list" :key="index">
            <div class="col-md-12">
                <div class="card">
                    <div class="lesson-header bg-black">{{lesson.name}}</div>
                    <div class="card-body">
                        <div class="row mb-2">
                            <div class="col-sm-3 mb-1 mb-sm-0">
                                <img :src="lesson.image" class="img-fluid" v-if="lesson.image">
                                <img :src="placeholder_lesson()" class="img-fluid" v-else>
                                <!-- <div v-if="lesson.abstract && check_date(lesson.start_date)" class="text-center mt-3">
                                    <span @click="download_abstract(index)" class="download-href">Скачать конспект</span>
                                </div> -->
                            </div>
                            <div class="col-sm-9">
                                <div class="card-content">
                                    <div v-html="lesson.description"></div>
                                </div>
                            </div>
                        </div>
                        <div class="d-flex align-items-center mt-1">

                            <!--TODO: потом добавить-->
                            <div class="ml-auto d-flex flex-column align-items-end">
                                <div v-if="check_date(lesson.start_date)">
                                    <span v-if="lesson.added_to_dictionary" class="notice-phrases">Фразы добавлены</span>
                                    <router-link :to="{ name: 'lesson_intro', params: { id: index+1 }}">
                                        <div class="btn btn-success">Приступить</div>
                                    </router-link>
                                </div>
                                <div v-else>
                                    <div class="btn btn-secondary disabled">Приступить</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div v-else>
        <div class="text-center mt-5">
            <i class='fa fa-spinner fa-pulse fa-10x' style="font-size: 50px;"></i>
        </div>
    </div>
</template>

<script>
    import { SERVgetLessons } from '../server/server'
    import axios from "axios"

    export default {
        name: 'home',
        components: {},
        data() {
            let now = new Date()
            return {
                base_url: process.env.BASE_URL,
                lesson_list: [
                    // {
                    //     "number": 1,
                    //     "name": "Английский за 1 урок",
                    //     "description": '<div><p><strong style=\"backg-color: transparent;\">ЦЕЛИ: </strong></p><ol><li><span style=\"backg-color: transparent;\">Сруктура языка.</span></li><li><span style=\"backg-color: transparent;\">Основные элементы.</span></li><li><span style="backg-color: transparent;">Главный принцип строения предложений.</span></li></ol></div>',
                    //     "image": "https://alred-static.s3.amazonaws.com/media/public/media/Screen_Shot_2018-09-28_at_00.31.32.png",
                    //     "time": "26",
                    //     "card_count": 8,
                    //     "tren_count": 115
                    // }
                ],
                now_time: new Date(now.getTime() + now.getTimezoneOffset() * 60 * 1000)
            }
        },
        created() {
            SERVgetLessons((res) => {
                this.lesson_list = res.data
            })
            // this.lesson_list = lesson_list;
        },
        methods: {
            // get_datetime(json_datetime) {
            //     let monthes = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];
            //     let datetime = new Date(json_datetime);
            //     return datetime.getDate() + " " + monthes[datetime.getMonth()];
            // },
            check_date(date_str) {
                if (date_str) {
                    let start_time = new Date(date_str);
                    if (this.now_time > start_time) {
                        return true;
                    }
                }
                return false;
            },
            placeholder_lesson() {
                return this.base_url + 'images/placeholder_lesson.png'

            },
            download_abstract(index) {
                let extension = this.lesson_list[index].abstract.split('.').pop();
                axios({
                    url: this.lesson_list[index].abstract,
                    method: 'GET',
                    responseType: 'blob',
                }).then((response) => {
                    const url = window.URL.createObjectURL(new Blob([response.data]));
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', `abstract_${index + 1}.${extension}`);
                    document.body.appendChild(link);
                    link.click();
                });
            }
        }
    }
</script>
<style scoped>
    .lesson-header {
        text-transform: uppercase;
        padding: 15px
    }

    .lesson-info {
        color: #0D2D44
    }

    .sm-text {
        font-size: 12px;
    }

    .btn-go {
        background-color: #0D2D44;
        color: white;
    }

    .btn-go:hover {
        background-color: #1f6da5;
    }

    .stats-icon {
        width: 3.5vw;
        max-width: 40px;
    }

    .stats-text {
        text-transform: uppercase;
        /*padding-left: 1vw;*/
        font-size: 1rem;
    }

    .card-content {
        font-family: Roboto, sans-serif;
        background-color: #D1DDE9;
        padding: 10px;
        height: 100%;
    }

    .card-content >>> p {
        margin-bottom: 0;
        font-size: 1rem;
    }

    .card-content >>> ol, .card-content >>> ul {
        /*padding-left: 1rem;*/
        /*line-height: 1.3rem;*/
        margin-bottom: 0;
    }
    .download-href {
        color: grey;
        cursor: pointer;
    }

    .notice-phrases {
        color: #2b78fe;
        margin-right: 20px;
        font-size: 14px;
    }

    @media (max-width: 576px) {
        .stats-icon {
            width: 7vw;
        }

        .col-md-12, .col-sm-9, .col-sm-3 {
            padding-left: 0;
            padding-right: 0;
        }

        .card-content >>> ol, .card-content >>> ul {
            padding-left: 1rem;
        }
    }
</style>
