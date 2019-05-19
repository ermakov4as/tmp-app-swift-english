<template>
    <div class="step-progress__wrapper">
        <div class="step-progress__wrapper-before"></div>
        <div class="step-progress__bar">
            <div class="step-progress__step" v-for="(step, index) in steps"
                 :class="{'step-progress__step--valid': index <= currentStep}" @click="changeStep(step, index)">
                <div class="step-progress__step_wrapper d-flex align-items-center justify-content-center">
                    <div v-if="step.icon" class="img-wrapper">
                        <img :src="icon_url(step.icon.after)" class="img-fluid" v-if="index <= currentStep">
                        <img :src="icon_url(step.icon.before)" class="img-fluid" v-else>
                    </div>
                    <div v-else>{{ step.name }}</div>
                </div>
            </div>
        </div>
        <div class="step-progress__wrapper-after"
             :style="{transform: 'scaleX(' + scaleX + ') translateY(-50%) perspective(1000px)'}"></div>
    </div>
</template>

<script>

    export default {
        name: 'StepProgress',
        props: {
            steps: {
                type: Array,
                default() {
                    return [];
                },
                validator(val) {
                    return val && val.length > 0;
                }
            },
            currentStep: {
                type: Number,
                default: 0
            },
        },
        computed: {
            scaleX() {
                let step = this.currentStep;
                if (step < 0) {
                    step = 0;
                } else if (step >= this.steps.length) {
                    step = this.steps.length - 1;
                }
                return step / (this.steps.length - 1);
            }
        },
        methods: {
            changeStep(step, index) {
                this.$router.push(step.router)
            },
            icon_url(icon) {
                return require(`@/assets/icons/${icon}`);
            }
        }
    };
</script>

<style scoped>
    .step-progress__wrapper {
        width: 90%;
        margin: 0 auto;
        position: relative;
    }

    .step-progress__wrapper-before {
        content: "";
        position: absolute;
        left: 0;
        top: 50%;
        height: 5px;
        width: 100%;
        background-color: #D1DDE9;
        transform: translateY(-50%) perspective(1000px);
    }

    .step-progress__wrapper-after {
        content: "";
        position: absolute;
        left: 0;
        top: 50%;
        height: 5px;
        width: 100%;
        background-color: #0D2D44;
        transform: scaleX(0) translateY(-50%) perspective(1000px);
        transform-origin: left center;
        transition: transform 0.5s ease;
    }

    .step-progress__bar {
        width: 100%;
        display: flex;
        height: 100px;
        justify-content: space-between;
        align-items: center;
    }

    .step-progress__step {
        z-index: 2;
        position: relative;
        padding: 10px;
    }

    .step-progress__step span {
        /*transition: 0.3s ease;*/
        /*display: block;*/
        transform: translate3d(0, 0, 0) scale(1) perspective(1000px);
        /*opacity: 1;*/
        font-size: 1rem;
    }

    .step-progress__step_wrapper {
        content: "";
        position: absolute;
        z-index: -1;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%) perspective(1000px);
        min-width: 45px;
        min-height: 45px;
        padding: 10px;
        border-radius: 50px;
        transition: 0.3s ease;
        background-color: #D1DDE9;
        color: #0D2D44;
        cursor: pointer;

    }

    .step-progress__step--valid .step-progress__step_wrapper {
        background-color: #0D2D44;
        color: #D1DDE9;
    }

    @media (max-width: 767px) {
        .step-progress__step:after {
            width: 40px;
            height: 40px;
        }

        .step-progress__bar {
            height: 60px;
        }

        .step-progress__step_wrapper {
            padding: 0;
            min-width: 30px;
            min-height: 30px;
            font-size: 0.8rem;
        }

        .img-wrapper {
            width: 50%;
        }
    }
</style>