<template>
    <textarea v-bind:value="value" ref="area"
              v-on:input="updateArea($event.target)" rows="1"
              :placeholder="custom_placeholder"></textarea>
</template>

<script>
    import autosize from "autosize"

    export default {
        name: "auto-textarea",
        props: ['value', 'custom_placeholder'],
        methods: {
            updateArea(target) {
                this.$emit('input', target.value);
                this.makeAutosize();

            },
            makeAutosize: async function () {
                await this.$nextTick();
                autosize($(this.$refs.area));

            }
        },
        watch: {
            value(val, oldVal) {
                if (val) {
                    this.$nextTick(this.makeAutosize);
                } else {
                    this.$emit('input', "");
                    this.$nextTick(this.makeAutosize);
                }

            }
        }
    }
</script>
<style scoped>
    textarea {
        resize: none;
        overflow: hidden;
        margin: 0;
        padding: 0;
        border: 0;
        width: 100%;
        text-align: center;
        background-color: transparent;
    }

    textarea::placeholder {
        color: #aaa;
        font-size: 14px;
    }
</style>

