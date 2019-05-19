<template>
    <div v-if="example_list.length">
        <!--статистка-->
        <div class="row">
            <div class="col-md-9">
                <span class="grammar-header" v-if="card">{{card.name}}</span>
            </div>
            <div class="col-md-3">
                <h3 class="text-right">{{current_index+1}}/{{example_list.length}}</h3>
            </div>
        </div>


        <!--картинка-->
        <div class="mb-1 sentence-img">
            <div class="img-wrapper">
                <img :src="example_list[current_index].image" class="img-fluid gt-img d-block mx-auto">
            </div>
        </div>

        <div class="d-flex justify-content-center">
            <div class="state_name">{{state_name}}</div>
        </div>
        <!--предложения-->
        <div style="position: relative">
            <div class="card mb-1" style="min-height: 75px" id="first_card">
                <div class="d-flex h100 gr-card-body flex-grow-1 align-items-center justify-content-between"

                     @click="playAudio(example_list[current_index], step[0])">
                    <div class="d-flex mr-2" v-if="example_list[current_index][step[0]+'_audio']">
                        <i class="material-icons">
                            volume_up
                        </i>
                    </div>
                    <div class="d-flex align-items-center justify-content-center h100 flex-grow-1"
                         v-if="(step_index >= 1 && !inverse) || (step_index>=0 && inverse)">
                        <div v-html="example_list[current_index][step[0]]"></div>
                    </div>
                </div>
            </div>
            <div class="float-btn-wrapper" ref="floatbtn">
                <div class="float-btn">
                    <div class="float-img-wrapper">
                        <img :src="icon_url('tuda-suda.png')" class="img-fluid" @click="change_inverse">
                    </div>
                </div>
            </div>
            <div class="card mb-1" style="min-height: 75px">
                <div class="d-flex h100 gr-card-body flex-grow-1 align-items-center justify-content-between"
                     v-if="step_index >= 2" @click="playAudio(example_list[current_index], step[1])">
                    <div class="d-flex mr-2" v-if="example_list[current_index][step[1]+'_audio']">
                        <i class="material-icons">
                            volume_up
                        </i>
                    </div>
                    <div class="d-flex align-items-center justify-content-center h100 flex-grow-1">
                        <div v-html="example_list[current_index][step[1]]"></div>
                    </div>
                </div>
            </div>
        </div>

        <!--стрелки-->
        <div class="row">
            <div class="col-3">
                <div class="img-row d-flex justify-content-center" @click="prevSentence()">
                    <div class="img-wrapper">
                        <img src="@/assets/icons/left.png" class="img-fluid">
                    </div>
                </div>
            </div>
            <div class="col-6">
                <div class="btn btn-success btn-block" @click="nextStep()">
                    Далее
                </div>
            </div>
            <div class="col-3">
                <div class="img-row d-flex justify-content-center" @click="nextSentence()">
                    <div class="img-wrapper">
                        <img src="@/assets/icons/right.png" class="img-fluid">
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { SERVgetPlayerCard } from "../server/server"

    export default {
        name: "grammar-component",
        props: ['card', 'examples'],
        data() {
            return {
                example_list: [],
                inverse: false,
                current_index: 0,
                step: ['question', 'answer'], // ['answer', 'question']
                step_index: -1,
                is_playing: false,
                snd: undefined,
            }
        },
        methods: {
            icon_url(icon) {
                return require(`@/assets/icons/${icon}`);
            },
            recalculate_float_btn_height() {
                if (this.$refs.floatbtn) {
                    this.$nextTick(() => {
                        let card = this.$el.querySelector("#first_card");
                        if (card) {
                            this.$refs.floatbtn.style.top = card.clientHeight - 25 + 'px';
                        }
                    });
                }
            },
            nextStep() {
                this.stopAudio();
                this.step_index++;
                if (this.step_index <= 0 && !this.inverse) {
                    this.playAudio(this.example_list[this.current_index], 'question');
                } else if (this.step_index === 1 && this.inverse) {
                    this.playAudio(this.example_list[this.current_index], 'question');
                    this.step_index++;
                }
                if (this.step_index >= 3) {
                    if (this.current_index < this.example_list.length - 1) {
                        this.nextSentence();
                    }
                }
            },
            nextSentence() {
                this.stopAudio();
                if (this.current_index < this.example_list.length - 1) {
                    this.step_index = -1;
                    this.current_index++;
                    this.nextStep()
                    // this.playAudio(this.example_list[this.current_index], this.step[this.step_index]);
                }
            },
            prevSentence() {
                this.stopAudio();
                if (this.current_index > 0) {
                    this.step_index = -1;
                    this.current_index--;
                    this.nextStep();
                    // this.playAudio(this.example_list[this.current_index], this.step[this.step_index]);
                }
            },
            shuffle(a) {
                for (let i = a.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [a[i], a[j]] = [a[j], a[i]];
                }
                return a;
            },
            stopAudio() {
                if (this.snd)
                    this.snd.pause();
            },
            playAudio(sentence, step) {
                let source = undefined;
                this.stopAudio();
                if (step === 'question') {
                    source = sentence['question_audio'];
                } else {
                    source = sentence['answer_audio'];
                }
                if (source) {
                    this.snd = new Audio(source);
                    let $app = this;
                    $app.snd.onended = function () {
                        if ($app.control_type === 'player' && $app.is_playing) {
                            $app.nextStep();
                        }
                    };
                    this.snd.play();
                } else {
                    this.step_index++;
                }
            },
            fetch_sentences() {
                if (this.examples) {
                    this.example_list = this.examples;
                } else {
                    if (this.card) {
                        let reqPlayerCard = {
                            id_card: this.card.id
                        }
                        SERVgetPlayerCard(reqPlayerCard, (res) => {
                            this.example_list = res.data['sentences']
                            this.example_list = this.shuffle(this.example_list)
                        })
                    }
                }
                this.recalculate_float_btn_height();
            },
            change_inverse() {
                this.inverse = !this.inverse;
                this.step_index = -1;
                if (!this.inverse) {
                    this.step = ['question', 'answer'];
                } else {
                    this.step = ['answer', 'question'];
                }
                this.recalculate_float_btn_height();
            }
        },
        computed: {
            state_name() {
                if (this.inverse) {
                    if (this.step_index === 0) return "Построение предложения";
                    if (this.step_index === 2) return "Проверка";
                } else {
                    if (this.step_index === 0) return "Восприяте на слух";
                    if (this.step_index === 1) return "Понимание текста";
                    if (this.step_index === 2) return "Проверка";
                }
            }
        },
        watch: {
            card() {
                this.current_index = 0;
                this.step_index = -1;
                this.is_playing = false;
                // this.generateExampleList();
                this.fetch_sentences();
            },
            step_index() {
                this.recalculate_float_btn_height();
            },
        },
        created() {
            this.fetch_sentences();
        },
        beforeDestroy() {
            if (this.snd)
                this.snd.pause();
            this.is_playing = false;
        }
    }
</script>

<style scoped>
    .material-icons {
        cursor: pointer;
    }

    .grammar-header {
        font-size: 25px;
    }

    .gr-btn {
        cursor: pointer;
        border: 1px solid #0D2D44;
        text-align: center;
        color: #0D2D44;
        padding: 5px 15px;
        border-radius: 5px;
        display: inline-block;
        height: 36px;
    }

    .img-btn {
        padding: 5px 30px !important;
    }

    .img-btn .img-fluid {
        height: 100%;
    }

    .gr-btn:hover {
        background-color: #D1DDE9;
    }

    .gr-active {
        background-color: #D1DDE9;
    }

    .img-wrapper {
        height: 100%;
    }

    .img-row {
        height: 38px;
        cursor: pointer;
    }

    .img-row .img-fluid {
        height: 100%;
    }

    .sentence-img {
        border: none;
    }

    .h100 {
        height: 100%;
    }

    .gr-card-body {
        padding: 15px 10px;
        cursor: pointer;
    }

    .float-btn-wrapper {
        position: absolute;
        right: 10px;
        z-index: 2;
        top: 52px;
        cursor: pointer;

    }

    .float-btn {
        background-color: #0D2D44;
        border-radius: 100%;
        width: 50px;
        height: 50px;
        padding: 5px;
    }

    .state_name {
        color: green;
        font-size: 23px;
    }
</style>