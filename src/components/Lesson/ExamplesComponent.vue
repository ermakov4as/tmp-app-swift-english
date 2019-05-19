<template>
    <div class="row">
        <div class="col-lg-8 offset-lg-2 col-md-10 offset-md-1">
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


                <!--предложения-->
                <div class="card mb-1" style="height: 75px">
                    <div class="d-flex h100 gr-card-body" @click="playAudio(example_list[current_index], step[0])">
                        <div class="d-flex align-items-center h100 mr-2">
                            <i class="material-icons">
                                volume_up
                            </i>
                        </div>
                        <div class="d-flex align-items-center justify-content-center h100 flex-grow-1">
                            <div v-html="example_list[current_index][step[0]]"></div>
                        </div>
                    </div>
                </div>
                <div class="card mb-1" style="height: 75px">
                    <div class="d-flex h100 gr-card-body" v-if="step_index === 1"
                         @click="playAudio(example_list[current_index], step[1])">
                        <div class="d-flex align-items-center h100 mr-2">
                            <!-- <i class="material-icons">
                                volume_up
                            </i> -->
                        </div>
                        <div class="d-flex align-items-center justify-content-center h100 flex-grow-1">
                            <div v-html="example_list[current_index][step[1]]"></div>
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
                        <div class="btn btn-success btn-block" @click="nextStep()" v-if="control_type==='simulator'">
                            Далее
                        </div>
                        <div class="btn btn-outline-success btn-block" v-else @click="autoSentencePlay">
                            <span v-if="is_playing">Pause</span>
                            <span v-else>Play</span>
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
        </div>
    </div>

</template>

<script>
    import { SERVgetPlayerCard } from "../../server/server"

    export default {
        name: "grammar-component",
        props: ['card', 'examples'],
        data() {
            return {
                example_list: [],
                order: "enru",
                current_index: 0,
                step: ['question', 'answer'],
                step_index: -1,
                is_playing: false,
                snd: undefined,
                control_type: 'simulator'
            }
        },
        methods: {
            autoSentencePlay() {
                if (!this.is_playing) {
                    this.is_playing = true;
                    if (this.snd) {
                        let $app = this;
                        $app.snd.onended = function () {
                            if ($app.control_type === 'player' && $app.is_playing) {
                                $app.nextStep();
                            }
                        };
                        this.snd.play();
                    } else {
                        this.nextStep();
                    }

                } else {
                    if (this.snd)
                        this.snd.pause();
                    this.is_playing = false;
                }
            },
            nextStep() {
                if (this.step_index < 1) {
                    this.step_index++;
                    this.playAudio(this.example_list[this.current_index], this.step[this.step_index]);
                } else {
                    if (this.current_index < this.example_list.length - 1) {
                        this.nextSentence();
                    }
                }
            },
            nextSentence() {
                if (this.current_index < this.example_list.length - 1) {
                    this.step_index = 0;
                    this.current_index++;
                    this.playAudio(this.example_list[this.current_index], this.step[this.step_index]);
                }
            },
            prevSentence() {
                if (this.current_index > 0) {
                    this.step_index = 0;
                    this.current_index--;
                    this.playAudio(this.example_list[this.current_index], this.step[this.step_index]);
                }
            },
            shuffle(a) {
                for (let i = a.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [a[i], a[j]] = [a[j], a[i]];
                }
                return a;
            },
            playAudio(sentence, step) {
                let source = undefined;
                if (step === 'question') {
                    source = sentence['question_audio'];
                } else 
                    return
                if (this.snd)
                    this.snd.pause();
                this.snd = new Audio(source);
                let $app = this;
                $app.snd.onended = function () {
                    if ($app.control_type === 'player' && $app.is_playing) {
                        $app.nextStep();
                    }
                };
                this.snd.play();

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
            }
        },
        watch: {
            card() {
                this.current_index = 0;
                this.step_index = -1;
                this.is_playing = false;
                // this.generateExampleList();
                this.fetch_sentences();
            }
        },
        created() {
            // this.generateExampleList()
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

    .img-btn .img-fluid {
        height: 100%;
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
        padding: 10px;
        cursor: pointer;
    }
</style>