import Vue from 'vue'
import Router from 'vue-router'
import AutorizedBlock from './AutorizedBlock.vue'

Vue.use(Router);

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [{
            path: '/profile',
            name: 'profile',
            component: () => import ('./views/Users/Profile.vue')
        },
        {
            path: '/login',
            name: 'login',
            component: () =>
                import ('./views/Users/Login.vue')
        },
        {
            path: '/',
            component: AutorizedBlock,
            children: [{
                    path: 'dictionary/',
                    component: () =>
                        import ('./views/Dictionary/Base.vue'),
                    children: [{
                            path: '',
                            name: 'dictionary',
                            component: () =>
                                import ('./views/Dictionary/UnitsList.vue')
                        },
                        {
                            path: 'add/',
                            name: 'dict_add',
                            component: () =>
                                import ('./views/Dictionary/Add.vue')
                        },
                        {
                            path: 'multiple_add/',
                            name: 'dict_multiple_add',
                            component: () =>
                                import ('./views/Dictionary/MultipleAdd.vue')
                        },
                        {
                            path: 'edit/:id/',
                            name: 'dict_edit',
                            component: () =>
                                import ('./views/Dictionary/Edit.vue')
                        },
                        {
                            path: 'training/',
                            name: 'dict_training',
                            component: () =>
                                import ('./views/Dictionary/Training.vue')
                        },

                    ]
                },
                {
                    path: 'results/',
                    component: () =>
                        import ('./views/Results/Base.vue'),
                    children: [{
                            path: '',
                            name: 'results',
                            component: () =>
                                import ('./views/Results/ByLesson.vue')
                        },
                        {
                            path: 'rating/',
                            name: 'rating',
                            component: () =>
                                import ('./views/Results/Rating.vue')
                        },
                    ]
                },
                {
                    path: '',
                    component: () =>
                        import ('./components/WhiteContainer.vue'),
                    children: [{
                            path: '',
                            name: 'main',
                            component: () =>
                                import ('./views/LessonList.vue')
                        },
                        {
                            path: 'lessons/',
                            name: 'lessons',
                            component: () =>
                                import ('./views/LessonList.vue')
                        },
                        {
                            path: 'lessons/:id/',
                            component: () =>
                                import ('./views/Lesson/Base.vue'),
                            children: [{
                                    path: '',
                                    name: 'lesson_intro',
                                    component: () =>
                                        import ('./views/Lesson/Intro.vue'),
                                    props: true,
                                },
                                {
                                    path: 'cards/:number/',
                                    name: 'card',
                                    component: () =>
                                        import ('./views/Lesson/Card.vue')
                                },
                                {
                                    path: 'exam/',
                                    name: 'exam',
                                    component: () =>
                                        import ('./views/Lesson/Exam.vue')
                                },
                            ]
                        },
                        {
                            path: 'simulator/:lesson_number/:card_number/',
                            name: 'sumulator_letete',
                            component: () =>
                                import ('./views/Training.vue')
                        },
                        {
                            path: 'simulator/:lesson_number/',
                            name: 'sumulator_letete2',
                            component: () =>
                                import ('./views/Training.vue')
                        },
                        {
                            path: 'simulator/',
                            name: 'sumulator',
                            component: () =>
                                import ('./views/Training.vue')
                        },
                        {
                            path: '*',
                            component: () =>
                                import ('./components/Site/404.vue')
                        }
                    ]
                },
            ]
        }
    ],
    scrollBehavior(to, from, savedPosition) {
        return { x: 0, y: 0 }
    }
})