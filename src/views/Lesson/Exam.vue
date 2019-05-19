<template>
  <div>
    <div class="row" v-if="downloaded">
      <div class="col-lg-8 mb-lg-0 mb-4 offset-lg-2">
        <div class="text-center" v-if="!exam || (exam && exam.finished)">
          <h3 class="mb-3">Урок пройден!</h3>
          <template v-if="!lesson.added_to_dictionary">
            <div
              class="text mb-3"
            >Добавьте фразы урока в личный словарь для регулярного повторения пройденного материала</div>
            <div class="d-flex justify-content-center mb-3">
              <div class="add-prhases-btn" @click="add_phrases()">Добавить 50 фраз</div>
            </div>
          </template>
          <template v-else>
            <div class="text mb-3">
              <b>Фразы добавлены.</b>
              Предложения урока доступны в боте.
            </div>
          </template>
        </div>

        <div class="text-center" v-if="!exam">
          <div
            class="text mb-3"
          >Так же мы рекомендуем пройти тест для закрепления пройденного материала</div>
          <div class="d-flex justify-content-center mb-3">
            <div class="btn-blue" @click="start_exam">Начать</div>
          </div>
        </div>
        <div class="text-center" v-else-if="exam.finished">
          <div class="text mb-3">
            <b>Тест завершен.</b>
            Вы ответили правильно на <b>{{exam.correct_answers_count}}</b>/{{exam.answers_count}} вопросов.
          </div>
        </div>
        <div v-else>
          <exam-component :exam="exam" v-on:finished="fetch_exam"></exam-component>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ExamComponent from "../../components/Exam/ExamComponent.vue"
import { SERVpostStartExam, SERVgetLessonExam } from "../../server/server"
//import { USER_ACTION } from "../../server/http-requests.js"
const request = require("request")

const c = console.log

export default {
  name: "exam-view",
  props: ['lesson'],
  components: {
    ExamComponent
  },
  data() {
    return {
      downloaded: false,
      exam: undefined,
      current_question: undefined,
      can_get_points: false,
      errors: {
        message: "",
        show_redirect: false
      }
    };
  },
  methods: {
    start_exam() {
        let reqStartExam = {
            id_lesson: this.$route.params.id
        }
        SERVpostStartExam(reqStartExam, (res) => {
            this.exam = res.data
        })
    },
    add_phrases() {
      if(!this.pushed_btn_add_to_dict)
        this.pushed_btn_add_to_dict = true
      else
        return
      let lesson_num = this.$route.params.id;
      let option = {
        auth: { bearer: this.$store.getters.token },
        json: { lesson_num: Number(lesson_num) }
      };
      request.post(//TO DO сделать норм
        `https://api.swift-english.com/api/v1/dictionary/add_from_lesson/`,
        option,
        (error, response, body) => {
          if (body == "OK") {
            this.lesson.added_to_dictionary = true;
          }
        }
      );
    },
    fetch_exam() {
        let reqLessonExam = {
            id_lesson: this.$route.params.id
        }
        SERVgetLessonExam(reqLessonExam, (res) => {
            this.exam = res.data["exam"]
            this.can_get_points = res.data["points"]
            this.downloaded = true
            /*if (this.exam.finished) {
                USER_ACTION("passedExam", null)
            }*/
        })
    },
    next_page() {
      this.$router.push({ name: "grammar-tren" })
    }
  },
  created() {
    this.fetch_exam();
  }
};
</script>

<style scoped>
.text {
  font-size: 1rem;
}

.add-prhases-btn {
  padding: 10px 40px;
  background-color: #28a745;
  color: white;
  border-radius: 10px;
  cursor: pointer;
}

.add-prhases-btn:hover {
  background-color: #49c065;
}

.btn-blue {
  cursor: pointer;
  font-size: 16px;
  padding: 10px;
  width: 220px;
  text-align: center;
  border-radius: 8px;
  background-color: #00a1e7;
  color: white;
}
.btn-blue:hover {
  background-color: #59c0ed;
}

.btn-blue-noactive {
  font-size: 16px;
  padding: 10px;
  width: 220px;
  text-align: center;
  border-radius: 8px;
  background-color: #76c2e2;
  color: white;
}

a {
  text-decoration: none;
}

.info {
  width: 300px;
}

.refer {
  text-decoration: underline;
  cursor: pointer;
}
</style>