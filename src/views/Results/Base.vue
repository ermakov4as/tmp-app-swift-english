<template>
    <div class="col-12 mt-4 small-p0">
        <div v-if="access_days >= 4">
            <div>
                <div class="top-row d-flex align-items-center justify-content-between">
                    <div class="tab-container align-self-end d-flex">
                        <router-link :to="{name: 'results'}" tag="div" class="tab mr-2"
                                    :class="$route.name==='results' ? 'active': 'deactive'">
                            По урокам
                        </router-link>
                        <router-link :to="{name: 'rating'}" tag="div" class="tab"
                                    :class="$route.name==='rating' ? 'active': 'deactive'">
                            Общий рейтинг
                        </router-link>
                    </div>
                </div>
            </div>
            <div class="white_container">
                <div class="small-p0">
                    <router-view></router-view>
                </div>
            </div>
        </div>
        <div v-else>
            <h3>Результаты будут доступны с 4-го дня обучения</h3>
            <p>Дней осталось: {{ 4 - access_days }}</p>
        </div>
    </div>

</template>

<script>
    export default {
        name: "DictionaryView",
        data() {
            return {
                access_days: 0
            }
        },
        methods: {
            icon_url(icon) {
                return require(`@/assets/icons/${icon}`);
            },
        }
    }
</script>

<style scoped>
    .tab {
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
        padding: 10px 15px;
        cursor: pointer;
    }

    .active {
        background-color: #fff;
    }

    .deactive {
        background-color: #d8d8d8;
    }


    .add-btn {
        background-color: #00a100;
        border-radius: 100%;
        padding: 10px;
        cursor: pointer;
    }

    .add-document-btn {
        background-color: #00a100;
        border-radius: 15px;
        padding: 5px;
        cursor: pointer;
    }

    .tab-icon {
        height: 30px;
    }

    .add-icon {
        height: 40px;
    }

    .add-document-icon {
        height: 30px;
    }

    .ref-btn {
        padding: 5px 10px;
        background-color: #fff;
        border-radius: 10px;
    }

    .ref-icon {
        height: 30px;
    }

    .white_container {
        background-color: #fff;
        padding: 10px;
    }

    @media (max-width: 576px) {
        .small-p0 {
            padding-left: 0;
            padding-right: 0;
        }

        .tab {
            padding: 5px;
        }

        .ref-btn {
            font-size: 12px;
        }

        .ref-icon {
            height: 20px;
        }

        .add-icon {
            height: 20px;
        }

        .add-btn {
            padding-top: 8px;
            height: 40px;
        }

    }
</style>