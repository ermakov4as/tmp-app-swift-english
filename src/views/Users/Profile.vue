<template>
    <div v-if="user" class="select">
        <div class="text-center my-5">
            <h1>Одноразовый токен: <b style="color: green">{{user.unibot_token}}</b></h1>
        </div>

        <!--<div class="row mb-5">-->
        <!--<div class="col-6">-->
        <!--<div class="d-flex align-items-center justify-content-center flex-column" v-if="user.vk_id">-->
        <!--<div class="mb-2">-->
        <!--<img :src="icon_url('vk.png')" class="social-logo">-->
        <!--</div>-->
        <!--<div class="text-center social-title">-->
        <!--Подключен к <b>{{user.vk_id}}</b>-->
        <!--</div>-->
        <!--<div>-->
        <!--<div class="btn btn-sm btn-outline-primary" @click="disconnect_vk">Выйти</div>-->
        <!--</div>-->
        <!--</div>-->
        <!--<div class="d-flex align-items-center justify-content-center flex-column" v-else>-->
        <!--<div class="mb-2">-->
        <!--<img :src="icon_url('vk_disabled.png')" class="social-logo">-->
        <!--</div>-->
        <!--<div>-->
        <!--<div class="btn btn-sm btn-outline-primary" @click="connect_vk">Подключить</div>-->
        <!--</div>-->
        <!--</div>-->
        <!--</div>-->
        <!--<div class="col-6">-->
        <!--<div class="d-flex align-items-center justify-content-center flex-column" v-if="user.telegram_name">-->
        <!--<div class="mb-2">-->
        <!--<img :src="icon_url('telegram.png')" class="social-logo">-->
        <!--</div>-->
        <!--<div class="text-center social-title">-->
        <!--Подключен к <b>{{user.telegram_name}}</b>-->
        <!--</div>-->
        <!--<div>-->
        <!--<div class="btn btn-sm btn-outline-primary" @click="disconnect_telegram">Выйти</div>-->
        <!--</div>-->
        <!--</div>-->
        <!--<div class="d-flex align-items-center justify-content-center flex-column" v-else>-->
        <!--<div class="mb-2">-->
        <!--<img :src="icon_url('telegram_disabled.png')" class="social-logo">-->
        <!--</div>-->
        <!--<div v-if="telegram_key" class="text-center social-title">-->
        <!--<div>Отправьте в бот <a href="https://t.me/swiftrequestsbot">@SwiftYebatNazvaniyeBot</a>-->
        <!--сообщение с текстом:-->
        <!--</div>-->
        <!--<div class="code">-->
        <!--<code class="select">/start {{telegram_key}}</code>-->
        <!--</div>-->
        <!--</div>-->
        <!--<div v-else>-->
        <!--<div class="btn btn-sm btn-outline-primary" @click="connect_telegram">Подключить</div>-->
        <!--</div>-->
        <!--</div>-->
        <!--</div>-->
        <!--</div>-->
        <div class="row mb-5">
            <div class="col-sm-6 offset-sm-3">
                <h3>Изменение анкетных данных</h3>
                <div class="form-group" v-if="errors.non_field_errors">
                    <label class="input-label" v-for="error in errors.non_field_errors">{{error}}</label>
                </div>
                <div class="form-group">
                    <label for="nickname">Имя</label>
                    <label class="input-label" v-if="errors.nickname"
                           v-for="error in errors.nickname">{{error}}</label>
                    <input type="text" class="form-control" id="nickname" v-model="new_nickname">
                </div>
                <div class="form-group">
                    <label for="email">Email</label>
                    <label class="input-label" v-if="errors.email"
                           v-for="error in errors.email">{{error}}</label>
                    <input type="email" class="form-control" id="email"
                           v-model="new_email">
                </div>
                <div class="btn btn-primary" @click="save_credentials">Сохранить</div>
            </div>
        </div>
        <div class="row mb-5">
            <div class="col-sm-6 offset-sm-3">
                <h3>Смена пароля</h3>
                <div class="form-group" v-if="errors.non_field_errors">
                    <label class="input-label" v-for="error in errors.non_field_errors">{{error}}</label>
                </div>
                <div class="form-group">
                    <label for="old_password">Старый пароль</label>
                    <label class="input-label" v-if="errors.old_password"
                           v-for="error in errors.old_password">{{error}}</label>
                    <input type="password" class="form-control" id="old_password" v-model="old_password">
                </div>
                <div class="form-group">
                    <label for="new_password2">Новый пароль</label>
                    <label class="input-label" v-if="errors.new_password2"
                           v-for="error in errors.new_password2">{{error}}</label>
                    <label class="input-label" v-if="errors.new_password1"
                           v-for="error in errors.new_password1">{{error}}</label>
                    <input type="password" class="form-control" id="new_password2" v-model="new_password2">
                </div>
                <div class="form-group">
                    <label for="new_password1">Повторите новый пароль</label>
                    <label class="input-label" v-if="errors.new_password1"
                           v-for="error in errors.new_password1">{{error}}</label>
                    <input type="password" class="form-control" id="new_password1" v-model="new_password1">
                </div>
                <div class="btn btn-primary mb-5" @click="save_new_password">Сохранить</div>
            </div>
        </div>
    </div>
</template>

<script>
    import { icon_url } from '../../utils'
    import { SERVpostDisconnectVk, SERVgetConnectTelegram, SERVpostDisconnectTelegram,
        SERVputSaveCredentials, SERVpostSaveNewPassword, SERVgetUser } from '../../server/server'

    export default {
        name: "Profile",
        data() {
            return {
                telegram_key: undefined,
                new_nickname: "",
                new_email: "",
                errors: {
                    email: [],
                    nickname: [],
                    non_field_errors: [],
                    old_password: [],
                    new_password1: [],
                    new_password2: []
                },
                old_password: "",
                new_password1: "",
                new_password2: ""
            }
        },
        methods: {
            icon_url(url) {
                return icon_url(url)
            },
            connect_vk() {
                let client_id = '6847880';
                let redirect_uri = window.location.origin + this.$router.resolve({name: 'callback_vk'}).href;
                let scope = '4259840';
                let response_type = 'code';
                let api_v = '5.92';
                window.location = `https://oauth.vk.com/authorize?client_id=${client_id}`
                    + `&display=page`
                    + `&redirect_uri=${redirect_uri}`
                    + `&scope=${scope}`
                    + `&response_type=${response_type}`
                    + `&v=${api_v}`
                    + '&state=connect';
            },
            disconnect_vk() {
                SERVpostDisconnectVk((res) => {
                    let new_user = this.user
                    new_user.vk_id = undefined
                    this.$store.commit('user', new_user)
                })
            },
            connect_telegram() {
                SERVgetConnectTelegram((res) => {
                    this.telegram_key = res.data
                })
            },
            disconnect_telegram() {
                SERVpostDisconnectTelegram((res) => {
                    let new_user = this.user
                    new_user.telegram_name = undefined
                    this.$store.commit('user', new_user)
                })
            },
            save_credentials() {
                let reqSaveCredentials = {
                    email: this.new_email,
                    nickname: this.new_nickname
                }
                SERVputSaveCredentials(reqSaveCredentials, (res) => {
                    if (res.success) {
                        this.$store.commit('user', res.response.data)
                        this.$notify({
                            group: 'auth',
                            type: 'success',
                            title: 'Данные успешно изменены',
                        })
                    } else {
                        this.set_errors(res.error.response.data)
                    }
                })
            },
            save_new_password() {
                let reqSaveNewPassword = {
                    old_password: this.old_password,
                    new_password1: this.new_password1,
                    new_password2: this.new_password2
                }
                SERVpostSaveNewPassword(reqSaveNewPassword, (res) => {
                    if (res.success) {
                        this.$store.commit('user', res.response.data)
                        this.$notify({
                            group: 'auth',
                            type: 'success',
                            title: 'Данные успешно изменены'
                        })
                        this.old_password = ""
                        this.new_password1 = ""
                        this.new_password2 = ""
                        for (let field_name in this.errors) {
                            if (this.errors.hasOwnProperty(field_name)) {
                                this.clear_errors(field_name);
                            }
                        }
                    } else {
                        this.set_errors(res.error.response.data)
                    }
                })
            },
            clear_errors(field_name) {
                if (this.errors.hasOwnProperty(field_name)) {
                    while (this.errors[field_name].length > 0) {
                        this.errors[field_name].pop();
                    }
                }
            },
            set_errors(errors_dict) {
                for (let field_name in this.errors) {
                    if (this.errors.hasOwnProperty(field_name)) {
                        this.clear_errors(field_name);
                        if (errors_dict.hasOwnProperty(field_name)) {
                            console.log(field_name);
                            for (let index = 0; index < errors_dict[field_name].length; index++) {
                                this.errors[field_name].push(errors_dict[field_name][index]);
                            }
                        }
                    }
                }
            }
        },
        computed: {
            user() {
                return this.$store.getters.user
            }
        },
        created() {
            SERVgetUser((res) => {
                this.$store.commit('user', res.data)
                this.new_nickname = res.data.nickname
                this.new_email = res.data.email
            })
        }
    }
</script>

<style scoped>
    .social-logo {
        width: 100px;
    }

    .social-title {
        font-size: .875rem;
    }

    .input-label {
        color: #c42432;
        font-size: 13px;
        padding-left: 5px;
    }

    .select {
        user-select: text;
        -o-user-select: text;
        -moz-user-select: text;
        -khtml-user-select: text;
        -webkit-user-select: text;
    }

</style>