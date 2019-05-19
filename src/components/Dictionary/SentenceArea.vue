<template>
    <div>
        <div class="bb-input d-flex justify-content-between mb-1 bb-border-none">
            <div class="d-flex align-items-center">
                <div class="bb-emoji">
                    {{LANG_ICONS[rows_lang[0]]}}
                </div>
            </div>
            <div class="flex-grow-1 d-flex justify-content-center align-items-center">
                <textarea-autosize
                        placeholder="Введите новое предложение ( RU или EN )"
                        v-model="first_row"
                        rows="1"
                        class="form-control bb-form-control text-center"
                ></textarea-autosize>
            </div>
        </div>
        <div class="d-flex justify-content-center mb-1">
            <div class="bb-input d-flex flex-grow-1 justify-content-between bb-border-none">
                <div class="d-flex align-items-center">
                    <div class="bb-emoji">
                        {{LANG_ICONS[rows_lang[1]]}}
                    </div>
                </div>
                <div class="flex-grow-1 d-flex justify-content-center align-items-center">
                    <textarea-autosize
                            placeholder="Укажите перевод"
                            v-model="second_row"
                            :min-height="1"
                            :max-height="350"
                            v-if="translated"
                            rows="1"
                            class="form-control bb-form-control text-center"
                    ></textarea-autosize>
                    <div v-else>
                        <i class='fa fa-spinner fa-pulse fa-10x' style="font-size: 30px;"></i>
                    </div>
                </div>
            </div>
            <div class="d-flex align-items-center ml-2">
                <div class="bb-edit-icon" @click="get_translate">
                    <img class="bb-icon" :src="icon_url('translate.png')">
                </div>
            </div>
        </div>
    </div>

</template>

<script>
    import { SERVgetGoogleTranslateDuoClb } from "../../server/server"

    export default {
        name: "SentenceArea",
        props: ['question', 'answer'],
        data() {
            return {
                first_row: "",
                second_row: "",
                rows_lang: [
                    "en",
                    "ru"
                ],
                LANG_ICONS: {
                    "en": "🇺🇸",
                    "ru": "🇷🇺"
                },
                translated: true
            }
        },
        watch: {
            question: function (val) {
                if (this.rows_lang[0] === 'en') {
                    this.first_row = val;
                } else {
                    this.second_row = val;
                }

            },
            answer: function (val) {
                if (this.rows_lang[0] === 'ru') {
                    this.first_row = val;
                } else {
                    this.second_row = val;
                }
            },
            first_row: function (val) {
                let first_row_lang = this.detect_language(val);
                if (first_row_lang === 'en') {
                    this.rows_lang[0] = 'en';
                    this.rows_lang[1] = 'ru';
                    this.$emit('update:question', val);
                } else {
                    this.rows_lang[1] = 'en';
                    this.rows_lang[0] = 'ru';
                    this.$emit('update:answer', val)
                }
            },
            second_row: function (val) {
                if (this.rows_lang[0] === 'ru') {
                    this.$emit('update:question', val);
                } else {
                    this.$emit('update:answer', val)
                }
            },
        },
        methods: {
            detect_language(str) {
                let english_letters = 0;
                let russian_letters = 0;
                let english_alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
                let russian_alphabet = "йцукенгшщзхъёфывапролджэячсмитьбюЙЦУКЕНГШЩЗХЪЁФЫВАПРОЛДЖЭЯЧСМИТЬБЮ";
                let english_ar = english_alphabet.split("");
                let russian_ar = russian_alphabet.split("");
                for (var i = 0; i < str.length; i++) {
                    if (english_ar.indexOf(str[i]) > -1) {
                        english_letters = english_letters + 1;
                    } else {
                        if (russian_ar.indexOf(str[i]) > -1) {
                            russian_letters = russian_letters + 1;
                        }
                    }
                }
                if (russian_letters > english_letters) {
                    return 'ru'
                }
                return 'en'
            },
            icon_url(icon) {
                return require(`@/assets/icons/${icon}`);
            },
            get_translate() {
                this.translated = false
                let reqGoogleTranslate = {
                    params: {
                        "text": this.first_row,
                        "lang": this.rows_lang[1]
                    }
                }
                SERVgetGoogleTranslateDuoClb((res) => {
                    if (res.success) {
                        this.translated = true
                        this.second_row = res.response.data['text']
                    } else {
                        this.translated = true
                    }
                    
                })
            }
        },
    }
</script>

<style scoped>
    .bb-input {
        background-color: #fff;
        border-radius: 10px;
        /*border: 2px solid #0D2D44;*/
        padding: 10px;
    }

    .bb-edit-icon {
        padding: 10px;
        background-color: white;
        border-radius: 10px;
        cursor: pointer;
    }

    .bb-icon {
        max-height: 30px;
    }

    .bb-emoji {
        font-size: 22px;
    }

    .bb-form-control {
        width: 90%;
        padding: 0;
        height: auto;
    }

    .bb-border-none {
        border: 0;
        border-radius: 0;
    }

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