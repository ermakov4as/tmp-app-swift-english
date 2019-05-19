<template>
    <div class="h-100">
        <img src="@/assets/img/logo.png" class="logo"/>
        <div class="h-100 row align-items-center justify-content-center">
            <div class="col plashka">
                <h2>Вход</h2>
                <div class="form-group" v-if="errors.non_field_errors">
                    <label class="input-label" v-for="(error, index) in errors.non_field_errors" :key="`error-other-${index}`">{{error}}</label>
                </div>
                <div class="form-group">
                    <label class="input-label">e-mail</label>
                    <input v-model="email" @change="clear_errors('email')" type="email" class="form-control" :class="{'error-input': errors.email.length}" >
                </div>
                <div class="form-group">
                    <label class="input-label">пароль</label>
                    <input v-model="password" @change="clear_errors('password')" type="password" class="form-control" :class="{'error-input': errors.password.length}">
                </div>
                <div class="text-center">
                    <div class="btn btn-primary" @click="login">
                        <template v-if="!in_process">
                            войти
                        </template>
                        <i v-else class='fa fa-spinner fa-pulse'></i>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { SERVlogin, SERVgetUser } from '../../server/server'
    export default {
        name: "Login",
        data() {
            return {
                email: "",
                password: "",
                errors: {
                    email: [],
                    password: [],
                    non_field_errors: []
                },
                in_process: false
            }
        },
        methods: {
            login(event) {
                for (let field_name in this.errors)
                    if (this.errors.hasOwnProperty(field_name))
                        this.clear_errors(field_name)
                
                if (this.email !== "" && this.password !== "") {
                    this.in_process = true
                    let reqLogin = {
                        email: this.email,
                        password: this.password
                    }
                    SERVlogin(reqLogin, (res) => {
                        if (res.success) {
                            console.log(res)
                            this.$store.commit('token', res.response.data['key'])
                            SERVgetUser((response) => {
                                this.$store.commit('user', response.data)
                                this.$router.push('/')
                            })
                        } else {
                            this.set_errors(res.error.response.data)
                            this.password = ""
                            this.in_process = false
                        }
                    })
                }
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
                            for (let index = 0; index < errors_dict[field_name].length; index++) {
                                this.errors[field_name].push(errors_dict[field_name][index]);
                            }
                        }
                    }
                }
            }
        },
        mounted() {
            if (this.$store.getters.user) {
                this.$router.push('/');
            }
        }
    }
</script>

<style lang="stylus">

@import '~@/assets/style/main';

.logo
    background-color    : rgba(255,255,255,0.0);
    top                 : 20px;
    height              : 36px;
    width               : 209px;
    position            : absolute;
    margin              : 0;
    left                : 18px;

.plashka
    flex-width(100%)
    radius()
    padding 30px
    @media (min-width: 375px)
        flex-width(370px)
    @media (min-width: 576px)
        flex-width(450px)


</style>