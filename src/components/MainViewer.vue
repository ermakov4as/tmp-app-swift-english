<template>
    <div id="article">
        <div v-for="(block, index) in content">
            <div class="card mb-2" v-if="block.text" :class="{'last': index===content.length-1}">
                <div v-if="block.media">
                    <div class="row">
                        <div class="col-sm-3 mb-sm-0 mb-3" :class="{'order-sm-12': index % 2}">
                            <div class="img-wrapper d-flex justify-content-center align-items-center">
                                <img v-if="block.media.content" :src="block.media.content"/>
                            </div>
                        </div>
                        <div class="col-sm-9 ">
                            <div v-html="block.text.content"></div>
                        </div>
                    </div>
                </div>
                <div v-else>
                    <div class="card mb-2">
                        <div class="col-sm-9 ">
                            <div v-html="block.text.content"></div>
                        </div>
                    </div>
                </div>
            </div>
            <!--блок ютуба -->
            <div v-else>
                <div class="row">
                    <div class="col">
                        <div class="videoWrapper">
                            <div v-html="block.media.content" v-if="block.media.content"></div>
                            <div v-html="DEFAULT_YOUTUBE_URL" v-else></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!--<div class="m-1">-->
        <!--<div v-if="block.type===contentType.IMAGE">-->
        <!--<img v-if="block.content" class="img-fluid" :src="block.content"/>-->
        <!--<img v-else class="img-fluid" :src="DEFAULT_IMAGE_URL"/>-->
        <!--</div>-->
        <!--<div v-else-if="block.type===contentType.YOUTUBE">-->
        <!--<div v-html="block.content" v-if="block.content"></div>-->
        <!--<div v-html="DEFAULT_YOUTUBE_URL" v-else></div>-->
        <!--</div>-->
        <!--<div v-else-if="block.type===contentType.LABELED_TEXT" :class="block.type">-->
        <!--<div class="labeled_emoji" v-if="block.emoji">-->
        <!--<emoji :emoji="block.emoji" :size="40"/>-->
        <!--</div>-->
        <!--<div class="labeled_content">-->
        <!--<div v-html="block.content"></div>-->
        <!--</div>-->
        <!--</div>-->
        <!--<div :class="block.type" v-else>-->
        <!--<div v-html="block.content"></div>-->
        <!--</div>-->
        <!--</div>-->
    </div>
</template>

<script>
    import { Picker, Emoji } from 'emoji-mart-vue'

    export default {
        name: "main-viewer",
        components: {
            Emoji,
            Picker
        },
        props: ['blocks'],
        data() {
            return {
                DEFAULT_IMAGE_URL: "http://www.independentmediators.co.uk/wp-content/uploads/2016/02/placeholder-image.jpg",
                DEFAULT_YOUTUBE_URL: "<iframe width=\"560\" height=\"315\" src=\"https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0&amp;showinfo=0\" frameborder=\"0\" allow=\"autoplay; encrypted-media\" allowfullscreen></iframe>",
                contentType: {
                    IMAGE: "image",
                    GOALS: "goals",
                    EXAMPLE: "example",
                    TEXT: "text",
                    LABELED_TEXT: "labeled_text",
                    YOUTUBE: "youtube"
                },
            }
        },
        computed: {
            content() {
                let content = [];
                let cont_blocks = this.blocks;
                let index = 0;
                while (index < cont_blocks.length) {
                    if (cont_blocks[index].type === this.contentType.YOUTUBE) {
                        content.push({
                            "media": cont_blocks[index]
                        });
                        index += 1;
                    }
                    else {
                        // cont_blocks[index].type === this.contentType.TEXT)
                        let content_block = {
                            "text": cont_blocks[index]
                        };
                        index += 1;
                        if (cont_blocks[index].type === this.contentType.IMAGE) {
                            content_block['media'] = cont_blocks[index];
                            index += 1
                        }
                        content.push(content_block);
                    }
                }
                return content
            }
        }
    }
</script>

<style scoped>
    .goals {
        border-radius: .25rem;
        background: rgb(255, 242, 204);
        border: 1px solid rgba(0, 0, 0, .125);
        margin: 10px 0px;
        padding: 5px;
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
        margin: 10px 0px;
        padding: 5px;
        display: flex;
    }

    .labeled_emoji {
        width: 60px;
    }

    .card {
        padding: 1.5rem;
        border-left: 0;
        border-right: 0;
        border-top: 0;
        border-radius: 0;
    }

    .last {
        border-bottom: 0;
    }

    #article {
        font-family: 'Roboto', sans-serif;
        font-size: 1rem;
        font-weight: 300;
        color: #0D2D44;
    }

    #article >>> strong {
        color: #D10000;
    }

    /*#article >>>  img {*/
    /*width: 100%;*/
    /*}*/

    #article >>> h1 {
        font-size: 3rem;
        text-transform: uppercase;
        font-weight: 900;
    }

    #article >>> h2 {
        font-size: 1.8rem;
        text-transform: uppercase;
        font-weight: 900;
        /*margin-bottom: 20px;*/
        /*border-top: 15px;*/
    }

    #article >>> h3 {
        font-size: 1.4rem;
        text-transform: uppercase;
        font-weight: 900;
        color: #2c3e50;
    }

    #article >>> p {
        margin-bottom: 0;
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

    .img-wrapper {
        height: 100%;
    }

    .card img {
        max-width: 50%;
        max-height: 100%;
    }

    @media (max-width: 968px) {
        .card img {
            max-width: 100%;
            max-height: 100%;
        }
    }

    @media (max-width: 576px) {
        .card {
            padding-left: 0;
            padding-right: 0;
            font-size: 16px;
            line-height: 22px;
        }

        .col, .col-sm-9, .col-sm-3 {
            padding-left: 0;
            padding-right: 0;
        }

        #article >>> h2 {
            /*font-size: 28px;*/
            /*margin-top: 30px;*/
        }

        .card img {
            max-width: 50%;
            max-height: 50%;
        }

        .img-wrapper {
            height: inherit;
            /*width: 50%;*/

        }

    }
</style>