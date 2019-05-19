import { HTTP, USERS_HTTP } from './http-common'
import Vue from 'vue'

///////////////////////////////////////////////////////////////////////////
////////////////////       1. КОНКРЕТНЫЕ ЗАПРОСЫ       ////////////////////
///////////////////////////////////////////////////////////////////////////

// GET DATA DUO CLB
export function SERVgetUserDuoClb(callback) {
    getDataDuoClb('/users/user/', (res) => { callback(res) })
}
export function SERVgetPlaylistDuoClb(callback) {
    getDataDuoClb('/player/playlist/', (res) => { callback(res) })
}
export function SERVgetMainDuoClb(callback) {
    getDataDuoClb('learning/main/', (res) => { callback(res) })
}
export function SERVgetLearningRatingDupClb(callback) {
    getDataDuoClb('/learning/rating/', (res) => { callback(res) })
}
export function SERVgetLearningPracticeDuoClb(callback) {
    getDataDuoClb('/learning/practice/', (res) => { callback(res) })
}
export function SERVgetLearningLessonDupClb(data, callback) {
    getDataDuoClb(`learning/lessons/${ data.id_lesson }/`, (res) => { callback(res) })
}
export function SERVgetDictionaryRandomDuoClb(callback) {
    getDataDuoClb('dictionary/random/', (res) => { callback(res) })
}

// GET DATA
export function SERVgetLessons(callback) {
    getData('learning/lessons/', (res) => { callback(res) })
}
export function SERVgetUser(callback) {
    getData('/users/user/', (res) => { callback(res) })
}
export function SERVgetCardExamples(data, callback) {
    getData(`learning/lessons/${ data.id_lesson }/cards/${( data.id_card)}/examples/`, (res) => { callback(res) })
}
export function SERVgetDictionary(callback) {
    getData('/dictionary/', (res) => { callback(res) })
}
export function SERVgetFinishedLessons(callback) {
    getData('/dictionary/finished_lessons/', (res) => { callback(res) })
}
export function SERVgetUnit(data, callback) {
    getData(`/dictionary/unit/${ data.id_unit }/`, (res) => { callback(res) })
}
export function SERVgetPlayerCard(data, callback) {
    getData(`/player/card/${ data.id_card }/`, (res) => { callback(res) })
}
export function SERVgetLearningExamples(data, callback) {
    getData(`/learning/examples/${ data.id_example }`, (res) => { callback(res) })
}
export function SERVgetExamQuestion(data, callback) {
    getData(`/learning/lessons/${ data.id_lesson }/exam/question/`, (res) => { callback(res) })
}
export function SERVgetLessonExam(data, callback) {
    getData(`/learning/lessons/${ data.id_lesson }/exam/`, (res) => { callback(res) })
}

// GET CONNECT
export function SERVgetConnectTelegram(callback) {
    getConnect('/users/telegram/generate_token/', (res) => { callback(res) })
}

// POST DISCONNECT
export function SERVpostDisconnectVk(callback) {
    postDisconnect('/users/vk/disconnect/', 'Вконтакте', (res) => { callback(res) })
}
export function SERVpostDisconnectTelegram(callback) {
    postDisconnect('/users/telegram/disconnect/', 'Telegram', (res) => { callback(res) })
}

// POST START EXAM
export function SERVpostStartExam(data, callback) {
    emptyPost(`/learning/lessons/${ data.id_lesson }/exam/`, (res) => { callback(res) })
}

// CONNECT MESSEGER
export function SERVpostConnectVk(data, callback) {
    connectMesseger('users/vk/connect/', data.connectData, 'Вы успешно подключили аккаунт Вконтакте', (res) => { callback(res) })
}


// SAVE
export function SERVputSaveUnit(data, callback) { // +
    saveData(`/dictionary/unit/${ data.id_unit }/`, data.unit, 'Предложение успешно сохранено', (res) => { callback(res) })
}

////////////////////////////////////////////////////////////////////////////
//////////////////       2. ПОЛНЫЕ ФУНКЦИИ ЗАПРОСОВ       //////////////////
////////////////////////////////////////////////////////////////////////////
export function SERVgetGoogleTranslateDuoClb(data, callback) {
    HTTP.get('/dictionary/google_translate/', data)
        .then((res) => {
            let clb_data = {
                success: true,
                response: res
            }
            callback(clb_data)
        })
        .catch((error) => {
            let clb_data = {
                success: false,
                response: error
            }
            callback(clb_data)
            console.log(error);
            Vue.notify({
                group: 'foo',
                type: "error",
                title: 'Произошла ошибка',
                text: 'Sorry'
            })
        })
}

export function SERVpostAnswerExamQuestion(data, callback) {
    HTTP.post(`/learning/lessons/${ data.id_lesson }/exam/question/`, {
            "question": data.question,
            "answer": data.answer
        })
        .then((res) => {
            callback(res)
        })
        .catch(error => {
            console.log(error);
            Vue.notify({
                group: 'foo',
                type: "error",
                title: 'Произошла ошибка',
                text: 'Sorry'
            })
        })
}

export function SERVlogout(callback) {
    USERS_HTTP.post('/logout/')
        .then(res => {
            callback(res)
            Vue.notify({
                group: 'foo',
                type: "success",
                title: 'Выход',
                text: 'Вы успешно вышли из аккаунта'
            })
        })
        .catch(error => {
            console.log(error);
            Vue.notify({
                group: 'foo',
                type: "error",
                title: 'Произошла ошибка',
                text: 'Sorry'
            })
        })
}

export function SERVpostVkDuoClb(data, callback) {
    USERS_HTTP.post('vk/', server_request_data)
        .then((res) => {
            let clb_data = {
                success: true,
                response: res
            }
            callback(clb_data)
        })
        .catch((error) => {
            let clb_data = {
                success: false,
                response: error
            }
            callback(clb_data)
            Vue.notify({
                group: 'auth',
                type: 'error',
                title: 'Ошибка входа',
                text: 'У вас не привязан аккаунт Вконтакте'
            })
        })
}

export function SERVpostSaveUnit(data, callback) {
    HTTP.post(`/dictionary/`, data.unit)
        .then((res) => {
            callback(res)
            Vue.notify({
                group: 'foo',
                type: "success",
                title: 'Предложение успешно добавлено'
            })
        })
        .catch((error) => {
            console.log(error)
            Vue.notify({
                group: 'foo',
                type: "error",
                title: 'Произошла ошибка',
                text: 'Sorry'
            })
        })
}

export function SERVpostSaveUnitListDuoClb(data, callback) {
    HTTP.post('/dictionary/multiple/', {
            "aams": data.aams,
            "units": data.units,
            "settings": data.settings
        })
        .then((res) => {
            let clb_data = {
                success: true,
                response: res
            }
            callback(clb_data)
            Vue.notify({
                group: 'auth',
                type: 'success',
                title: 'Предложения успешно загружены на словарь'
            })
        })
        .catch(() => {
            Vue.notify({
                group: 'auth',
                type: 'error',
                title: 'Произошла ошибка'
            })
        })
}

export function SERVputDictionaryForward(data, callback) {
    HTTP.put('dictionary/forward/', {
            id: data.id
        })
        .then((res) => {
            callback(res)
        })
}

export function SERVdeleteRemoveUnits(data, callback) {
    HTTP.delete('/dictionary/', { // TODO: надо бы с сервера вид поправить. сейчас бред
            data: {
                units_list: data.units_list,
            }
        })
        .then((res) => {
            callback(res)
        })
        .catch((error) => {
            let clb_data = {
                success: false,
                response: error
            }
            callback(clb_data)
            Vue.notify({
                group: 'foo',
                type: "error",
                title: 'Ошибка операции'
            })
        })
}

export function SERVputSaveCredentials(data, callback) {
    HTTP.put('/users/user/', {
            "email": data.email,
            "nickname": data.nickname
        })
        .then((res) => {
            let clb_data = {
                success: true,
                response: res
            }
            callback(clb_data)
            Vue.notify({
                group: 'auth',
                type: 'success',
                title: 'Данные успешно изменены'
            })
        })
        .catch((error) => {
            let clb_data = {
                success: false,
                response: error
            }
            callback(clb_data)
        })
}

export function SERVpostSaveNewPassword(data, callback) {
    HTTP.post('/users/password/change/', {
            old_password: data.old_password,
            new_password1: data.new_password1,
            new_password2: data.new_password2
        })
        .then((res) => {
            let clb_data = {
                success: true,
                response: res
            }
            callback(clb_data)
            Vue.notify({
                group: 'auth',
                type: 'success',
                title: 'Данные успешно изменены'
            })
        })
        .catch((error) => {
            let clb_data = {
                success: false,
                response: error
            }
            callback(clb_data)
        })
}

export function SERVlogin(data, callback) {
    USERS_HTTP.post('login/', {
            "email": data.email,
            "password": data.password
        })
        .then((res) => {
            let clb_data = {
                success: true,
                response: res
            }
            callback(clb_data)
        })
        .catch((error) => {
            let clb_data = {
                success: false,
                response: error
            }
            callback(clb_data)
        })
}

export function SERVcreateNewElement(data, callback) {
    HTTP.post(data.url, data.id_elem)
        .then(res => {
            callback(res)
        })
        .catch(error => {
            console.log(error);
            Vue.notify({
                group: 'foo',
                type: "error",
                title: 'Произошла ошибка',
                text: 'Sorry'
            })
        })
}

///////////////////////////////////////////////////////////////////////////
//////////////////       3. ОБЩИЕ ФУНКЦИИ ЗАПРОСОВ       //////////////////
///////////////////////////////////////////////////////////////////////////
function connectMesseger(path, data, msg, callback) {
    HTTP.post(path, data)
        .then((res) => {
            callback(res)
            Vue.notify({
                group: 'auth',
                type: 'success',
                title: msg
            })
        })
        .catch(error => {
            console.log(error);
            Vue.notify({
                group: "foo",
                type: "error",
                title: "Произошла ошибка",
                text: "Sorry"
            })
        })
}

function getData(path, callback) {
    HTTP.get(path)
        .then(res => {
            callback(res)
        })
        .catch(error => {
            console.log(error)
            Vue.notify({
                group: 'foo',
                type: "error",
                title: 'Произошла ошибка',
                text: 'Sorry'
            })
        })
}

function getDataDuoClb(path, callback) {
    HTTP.get(path)
        .then((response) => {
            let clb_data = {
                success: true,
                response
            }
            callback(clb_data)
        })
        .catch((error) => {
            let clb_data = {
                success: false,
                error
            }
            callback(clb_data)
        })
}

function getConnect(path, callback) {
    HTTP.get(path)
        .then((res) => {
            callback(res)
        })
        .catch((error) => {
            Vue.notify({
                group: 'auth',
                type: 'error',
                title: 'Аккаунт Telegram уже подключен',
            });
        })
}

function postDisconnect(path, messager_name, callback) {
    HTTP.post(path)
        .then((res) => {
            callback(res)
            Vue.notify({
                group: 'auth',
                type: 'warn',
                title: 'Вы отключили аккаунт ' + messager_name
            })
        })
}

function emptyPost(path, callback) {
    HTTP.post(path)
        .then(res => {
            callback(res)
        })
        .catch(error => {
            console.log(error)
            Vue.notify({
                group: "auth",
                type: "error",
                title: "Произошла ошибка"
            })
        })
}

function saveData(path, data, msg, callback) {
    HTTP.put(path, data)
        .then(res => {
            callback(res)
            Vue.notify({
                group: 'foo',
                type: "success",
                title: 'Успешно сохранено',
                text: msg
            })
        })
        .catch(error => {
            console.log(error)
            Vue.notify({
                group: 'foo',
                type: "error",
                title: 'Произошла ошибка',
                text: 'Sorry'
            })
        })
}