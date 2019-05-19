<template>
  <div v-if="connected">
    <div v-if="errors">
      <h1>{{errors}}</h1>
    </div>
    <div class="row my-2" v-else>
      <div class="col-md-6 mb-2">
        <div class="lesson-header bg-black">{{lesson.name}}</div>
      </div>
    </div>
    <div class="app">
      <div class="row" v-if="steps.length">
        <step-progress :steps="steps" :current-step="currentStep" icon-class="fa fa-check"></step-progress>
      </div>
    </div>
    <div class="row mb-5 mt-1">
      <div class="col-md-12">
        <!--<div class="card">-->
        <div v-if="steps.length">
          <router-view :lesson="lesson"></router-view>
          <div class="row my-5">
            <div class="col-lg-10 offset-lg-1 mt-3">
              <div
                v-if="steps[currentStep].router.name!=='exam'"
                class="d-flex justify-content-end"
              >
                <!--<div class="d-flex justify-content-end ">-->
                <div v-if="currentStep > 0">
                  <router-link :to="steps[currentStep-1].router">
                    <div class="btn btn-lg btn-outline-primary mr-2">Назад</div>
                  </router-link>
                </div>
                <div v-if="currentStep < steps.length - 1">
                  <!--<div v-if="steps[currentStep].router.name!=='exam' && currentStep < steps.length - 1">-->
                  <router-link :to="steps[currentStep+1].router">
                    <div class="btn btn-lg btn-primary mr-2">Понятно</div>
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!--</div>-->
      </div>
    </div>
  </div>
  <div v-else>
    <div class="text-center mt-5">
      <i class="fa fa-spinner fa-pulse fa-10x" style="font-size: 50px;"></i>
    </div>
  </div>
</template>

<script>

    import ContentViewer from "../../components/Lesson/ContentViewer";
    import StepProgress from "../../components/Lesson/StepProgress"
    import { SERVgetLearningLessonDupClb, SERVgetLessons } from "../../server/server";

    export default {
        name: "lesson-item",
        components: {
            ContentViewer,
            StepProgress
        },
        data() {
            return {
                lesson: undefined,
                connected: false,
                errors: undefined,
                lesson_content: [],
                steps: [],
                currentStep: 0
            }
        },
        methods: {
            installStep() {
                let $app = this;
                this.currentStep = this.steps.findIndex(obj => {
                    // всю эту хуйню я делал для приведения всего к строке, чтобы и параметры и роутер были одного типа
                    let new_obj = {};
                    for (let k in obj.router.params) {
                        if (obj.router.params.hasOwnProperty(k)) {
                            new_obj[k] = String(obj.router.params[k]);
                        }
                    }
                    let route_params_str = {};
                    for (let k in $app.$route.params) {
                        if ($app.$route.params.hasOwnProperty(k)) {
                            route_params_str[k] = String($app.$route.params[k]);
                        }
                    }
                    return JSON.stringify({
                        name: obj.router.name,
                        params: new_obj
                    }) === JSON.stringify({
                        name: $app.$route.name,
                        params: route_params_str
                    })
                })
            },
            createSteps() {
                this.steps.push({
                    name: 'Введение',
                    icon: {
                        before: 'rocket.png',
                        after: 'rocket_light.png'
                    },
                    router: {name: 'lesson_intro', params: {id: this.$route.params.id}}
                });
                for (let index = 0; index < this.lesson.cards.length; index++) {
                    this.steps.push(
                        {
                            name: (index + 1).toString(),
                            router: {name: 'card', params: {id: this.$route.params.id, number: index + 1}}
                        })
                }
                this.steps.push(
                    {
                        name: 'Visual',
                        icon: {
                            before: 'document.png',
                            after: 'document_light.png'
                        },
                        router: {name: 'exam', params: {id: this.$route.params.id}}
                    },
                    // {
                    //     name: 'Audio',
                    //     icon: {
                    //         before: 'speaker.png',
                    //         after: 'speaker_light.png'
                    //     },
                    //     router: {name: 'exam', params: {id: this.$route.params.id, type: 'audio'}}
                    // }
                )
            }
        },
        watch: {
            '$route'(to, from) {
                if (this.steps.length > 0) {
                    this.installStep();
                }
            }
        },
        mounted() {
            if (this.steps.length > 0) {
                this.installStep();
            }
        },
        created() {
            let reqLearningLesson = {
                id_lesson: this.$route.params.id
            }
            SERVgetLearningLessonDupClb(reqLearningLesson, (res) => {
                if(res.success) {
                    SERVgetLessons((response) => {
                        this.connected = true
                        res.response.data.added_to_dictionary = response.data[this.$route.params.id-1].added_to_dictionary
                        this.lesson = res.response.data
                        this.createSteps()
                        if (this.steps.length > 0) {
                            this.installStep()
                        }
                    })
                } else {
                    this.connected = true
                    if (res.error.response.status === 403) {
                        this.errors = "Доступ к уроку заблокирован"
                    } else {
                        this.errors = 'Неизвестная ошибка'
                    }
                }
            })
        }

    }
</script>

<style scoped>
.stats-icon {
  width: 3.5vw;
  max-width: 40px;
}

.stats-text {
  text-transform: uppercase;
  /*padding-left: 1vw;*/
  font-size: 1rem;
}

.lesson-info {
  color: #0d2d44;
}

.btn-go {
  background-color: #0d2d44;
  color: white;
}

.btn-go:hover {
  background-color: #1f6da5;
}

.gr-lesson-content >>> p {
  color: #d10000;
  margin-bottom: 0;
}

.gr-lesson-content >>> ol {
  padding-left: 1rem;
  margin-bottom: 0;
}

.gr-card {
  border: 1px solid gray;
  padding: 10px 5px;
  text-align: center;
  border-radius: 0.25rem;

  text-transform: uppercase;
  font-size: 0.85rem;
}

@media (max-width: 576px) {
  .card,
  .card-body {
    padding-left: 0;
    padding-right: 0;
    font-size: 16px;
    line-height: 22px;
  }
}
</style>