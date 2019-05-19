<template>
    <div>
        <div v-if="loading_data">
            <div class="text-center mt-5">
                <i class='fa fa-spinner fa-pulse fa-10x' style="font-size: 50px;"></i>
            </div>
        </div>
        <div v-else>
            <div class="row mb-3">
                <div class="col-12">
                    <div class="table-responsive">
                        <table class="table table-bordered table-sm">
                            <thead>
                            <tr>
                                <th>#
                                </th>
                                <th>Имя</th>
                                <th v-for="(lesson, index) in rating_data[0].lessons" class="th_sort"
                                    :class="{'active': sort_index===index}"
                                    @click="sort_index = index">
                                    Цикл {{index+1}}
                                    <span class="fa fa-sort-down"></span>
                                </th>
                                <th class="th_sort"
                                    :class="{'active': sort_index===-1}"
                                    @click="sort_index = -1"
                                >
                                    Итого
                                    <span class="fa fa-sort-down"></span>
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for="(person, index) in sorted_persons" :key="person.id">
                                <td>{{index+1}}</td>
                                <td>{{person.name}}</td>
                                <td v-for="(lesson, index) in person.lessons">
                                    {{lesson.result}} <span class="success">{{lesson.payed?' +248₽':''}}</span>
                                </td>
                                <td>{{person.total}}</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { SERVgetLearningRatingDupClb } from "../../server/server"

    export default {
        name: 'practice',
        props: ['cards'],
        data() {
            return {
                rating_data: [],
                loading_data: true,
                sort_index: -1,
            }
        },
        computed: {
            sorted_persons() {
                let persons = this.rating_data;
                let sort_index = this.sort_index;
                if (this.sort_index >= 0) {
                    persons = persons.slice().sort(function (a, b) {
                        a = a.lessons[sort_index].result;
                        b = b.lessons[sort_index].result;
                        return (a === b ? 0 : a > b ? 1 : -1) * -1
                    })
                } else {
                    persons = persons.slice().sort(function (a, b) {
                        a = a.total;
                        b = b.total;
                        return (a === b ? 0 : a > b ? 1 : -1) * -1
                    })
                }
                return persons
            }
        },
        methods: {
            get_datetime(json_datetime) {
                let datetime = new Date(json_datetime);
                return datetime.getDate() + "/" + (datetime.getMonth() + 1) + "/" + datetime.getFullYear();
            },
            fetch_data() {
                SERVgetLearningRatingDupClb((res) => {
                    this.loading_data = false
                    if (res.success) {
                        this.rating_data = res.response.data
                    }
                })
            }
        },
        created() {
            this.fetch_data();
        }
    }
</script>
<style scoped>
    .switcher_text {
        text-align: center;
        font-size: 20px;
        padding: 5px;
    }
    .table-sm {
        text-align: center;
    }
    .th_sort {
        cursor: pointer;
    }

    .th_sort:hover {
        background-color: #D1DDE9;
    }

    .active {
        background-color: #D1DDE9;
    }

    .success {
        color: #00b800;
    }


    @media (max-width: 768px) {
        table {
            font-size: 8px;
        }

        td, th {
            padding: 2px;
        }
    }
</style>
