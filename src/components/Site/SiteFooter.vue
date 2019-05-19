<template>
    <section id="footer">
        <div class="container">
            <div class="d-flex flex-column flex-sm-row justify-content-center text-center">
                <div class="nav-item mr-md-3">
                    <router-link to="/lessons/"><span class="nav-link">Уроки</span></router-link>
                </div>
                <div  class="nav-item mr-md-3">
                    <router-link to="/dictionary/"><span class="nav-link">Cловарь</span></router-link>
                </div>
                
                <!-- <div class="nav-item mr-md-3">
                    <router-link to="/results/"><span class="nav-link">Результаты</span></router-link>
                </div> -->
                <!-- <div v-if="access_days >= 4" class="nav-item mr-md-3">
                    <router-link to="/simulator/"><span class="nav-link">Конспект</span></router-link>
                </div> -->
                <!--<div class="nav-item">-->
                    <!--<router-link to="№"><span class="nav-link">Как учиться?</span></router-link>-->
                <!--</div>-->
                <!--<li class="nav-item">-->
                <!--<router-link to="/ratings/"><span class="nav-link">Рейтинг</span></router-link>-->
                <!--</li>-->
            </div>
        </div>
    </section>
</template>

<script>
    export default {
        name: "SiteFooter",
        data() {
            return {
                access_days: 0
            }
        }
    }
</script>

<style scoped>
    /*@import url('https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css');*/
    #footer {
        background-color: #0D2D44;
        color: white;
    }

    .nav-link {
        color: white;
        padding: 15px;
    }

    .nav-item {
    }

    .nav-item a:hover {
        text-decoration: none;
    }

    .nav-link:hover {
        color: #D1DDE9;
        text-decoration: none;
    }

    @media (max-width: 556px) {
        .nav-link {
            padding: 5px;
        }
    }
</style>