<template>
    <div>
        <div class="card br-0">
            <div class="card-body">
                <div>Пример {{example_index + 1}} из {{examples.length}}</div>
                <img :src="examples[example_index].image" alt="" class="img-fluid my-2">
                <div class="card bg-light mb-1 br-10">
                    <div class="card-body" @click="playAudio(examples[example_index].question_audio)">
                        <div class="d-flex align-items-center">
                            <div class="text-center flex-grow-1" v-html="examples[example_index].question">

                            </div>
                            <i class="material-icons">
                                volume_up
                            </i>
                        </div>
                    </div>
                </div>
                <div class="card bg-light mb-3 br-10">
                    <div class="card-body">
                        <div class="d-flex align-items-center">
                            <div class="text-center flex-grow-1" v-html="examples[example_index].answer">
                            </div>
                            <i class="material-icons">
                                volume_up
                            </i>
                        </div>
                    </div>
                </div>
                <div class="float-right">
                    <div class="btn btn-outline-danger mr-2 p-1" :class="{'disabled': this.example_index === 0}"
                         @click="prevSentence">
                        <div class="img-wrapper px-3">
                            <img src="@/assets/icons/left.png" class="img-fluid control-img">
                        </div>
                    </div>
                    <div class="btn btn-success p-1"
                         :class="{'disabled': this.example_index + 1 === this.examples.length}"
                         @click="nextSentence">
                        <div class="img-wrapper px-3">
                            <img src="@/assets/icons/right.png" class="img-fluid control-img">
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "examples-trainer",
        props: ['examples'],
        data() {
            return {
                example_index: 0,
                snd: undefined
            }
        },
        methods: {
            nextSentence() {
                if (this.snd) {
                    this.snd.pause();
                }
                if (this.example_index + 1 !== this.examples.length) {
                    this.example_index++;
                }
            },
            prevSentence() {
                if (this.snd) {
                    this.snd.pause();
                }
                if (this.example_index !== 0) {
                    this.example_index--;
                }
            },
            playAudio(source) {
                if (this.snd) {
                    this.snd.pause();
                }
                this.snd = new Audio(source);
                this.snd.play();
            }
        },
    }
</script>

<style scoped>
    i {
        font-size: 30px;
    }

    .br-0 {
        border-radius: 0;
    }

    .br-10 {
        border-radius: 10px;
    }

    .card-body {
        cursor: pointer;
    }

    .control-img {
        height: 30px;
    }
</style>