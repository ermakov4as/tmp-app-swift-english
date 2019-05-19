<template>
    <div id="article">
        <div v-for="(block, index) in blocks">
            <div class="m-1">
                <div v-if="block.type===contentType.IMAGE">
                    <img v-if="block.content" class="mx-auto d-block" :src="block.content"/>
                    <img v-else class="img-fluid" :src="DEFAULT_IMAGE_URL"/>
                </div>
                <div v-else-if="block.type===contentType.YOUTUBE">
                    <div class="videoWrapper">
                        <div v-html="block.content" v-if="block.content"></div>
                        <div v-html="DEFAULT_YOUTUBE_URL" v-else></div>
                    </div>
                </div>
                <div v-else-if="block.type===contentType.LABELED_TEXT" :class="block.type">
                    <div class="d-flex align-items-center">
                        <div class="labeled_emoji mr-2" v-if="block.emoji">
                            <emoji :emoji="block.emoji" :size="40"></emoji>
                        </div>
                        <div class="labeled_content">
                            <div v-html="block.content"></div>
                        </div>
                    </div>
                </div>
                <div v-else-if="block.type===contentType.EXAMPLE">
                    <internal-examples-component :scheme_id="block.content.id"
                                                 :scheme_url="block.content.url"></internal-examples-component>
                </div>
                <div class="post" :class="block.type" v-else>
                    <div v-html="block.content"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { Emoji } from 'emoji-mart-vue'
    import InternalExamplesComponent from './InterntalExamplesComponent'

    export default {
        name: "content-viewer",
        components: {
            Emoji,
            InternalExamplesComponent,
        },
        props: ['blocks'],
        data() {
            return {
                DEFAULT_IMAGE_URL: "http://www.independentmediators.co.uk/wp-content/uploads/2016/02/placeholder-image.jpg",
                DEFAULT_YOUTUBE_URL: "<iframe width=\"560\" height=\"315\" src=\"https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0&amp;showinfo=0\" frameborder=\"0\" allow=\"autoplay; encrypted-media\" allowfullscreen></iframe>",
                contentType: {
                    "IMAGE": "image",
                    "GOALS": "goals",
                    "EXAMPLE": "example",
                    "TEXT": "text",
                    "LABELED_TEXT": "labeled_text",
                    "YOUTUBE": "youtube"
                },
            }
        },
    }
</script>

<style scoped>
    .goals {
        border-radius: .25rem;
        background-color: #D1DDE9;
        border: 1px solid rgba(0, 0, 0, .125);
        margin: 10px 0px;
        padding: 10px;
    }

    .example {
        border-radius: .25rem;
        background: #f5f5f5;
        border: 1px solid rgba(0, 0, 0, .125);
        margin: 10px 0px;
        padding: 5px;
    }

    .labeled_text {
        border-radius: .25rem;
        border: 1px solid rgba(255, 21, 31, 0.75);
        margin: 10px 0;
        padding: 5px;
    }


    .post {
        font-size: 18px;
        line-height: 1.5;
        margin: 20px 0;
    }

    #article {
        font-family: 'Roboto', sans-serif;
        /*font-size: 1rem;*/
        font-weight: 400;
        color: #444;
    }

    #article >>> img {
        max-width: 600px;
    }

    #article >>> h1 {
        font-size: 36px;
        text-transform: uppercase;
        font-weight: 400;
    }

    #article >>> h2 {
        font-size: 30px;
        text-transform: uppercase;
        font-weight: 400;
    }

    #article >>> h3 {
        font-size: 25px;
        text-transform: uppercase;
        font-weight: 400;
        color: #2c3e50;
    }

    #article >>> p {
        margin-top: 0;
        margin-bottom: 0;
    }
    #article >>> .ql-align-center {
        text-align: center;
    }
    #article >>> ul, #article >>> ol {
        margin-bottom: 0;
    }

    #article >>> em {
        font-family: 'EB Garamond', serif;
    }

    #article >>> .videoWrapper {
        position: relative;
        padding-bottom: 56.25%; /* 16:9 */
        padding-top: 25px;
        height: 0;
    }

    #article >>> .videoWrapper iframe {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }

    @media (max-width: 768px) {
        #article >>> img {
            max-width: 100%;
            height: auto;
        }

        #article >>> h1 {
            font-size: 28px;
        }

        #article >>> h2 {
            font-size: 24px;
        }

        #article >>> h3 {
            font-size: 20px;
        }

        .post {
            font-size: 16px;
        }
    }

    @media (max-width: 576px) {
        #article >>> h1 {
            font-size: 24px;
        }

        #article >>> h2 {
            font-size: 20px;
        }

        #article >>> h3 {
            font-size: 18px;
        }

        .post {
            font-size: 14px;
        }
    }


</style>