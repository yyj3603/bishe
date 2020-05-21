<template>
    <div>
        <nav-header></nav-header>
        <body>
        <div class="aboutUs_title">
            <div class="aboutUs_title_content">
                <span>威凡健身</span>
            </div>
        </div>

        <div class="content detail">
            <span class="spanP">
                <p>威凡健身作为健身行业的风向标，受邀入驻多个国际商业性建筑：上海中心、环球金融中心、金茂大厦、上海新天地、北京东方新天地、广州IFC、重庆英利•大融城会所、成都太古里等。</p>
                <p>依托可观的体量和丰富的商业业态，威尔仕力图打造更符合国际潮流的健身体验，让您尽享健康、时尚的健身氛围！</p>
                <p>与大型地产/商业中心合作 Will’s 健身身处闹市中心或住宅周边，不论是在大型社区或商业综合体中扮演着不可或缺的角色。</p>
                <p>一直以来，Will’s 都是万科、正大、凯德等商业地产集团的优选合作伙伴。Will’s 总是身处黄金位置或恰好在您身边出现，总是营造时尚健身氛围。让你与健康更近一步。</p>
            </span>

            <div class="video">

                <video id="my-video" class="video-js" controls preload="auto" poster="m.png"
                       data-setup="{}">
                    <source src="http://vjs.zencdn.net/v/oceans.mp4" type="video/mp4">
                    <source src="http://vjs.zencdn.net/v/oceans.webm" type="video/webm">
                    <source src="http://vjs.zencdn.net/v/oceans.ogv" type="video/ogg">
                    <p class="vjs-no-js"> To view this video please enable JavaScript, and consider upgrading to a web
                        browser that <a href="http://videojs.com/html5-video-support/" target="_blank">supports HTML5
                            video</a> </p>
                </video>
            </div>
        </div>
        <div class="aboutUs_title">
            <div class="aboutUs_title_content">
                <span>我们在这里</span>
            </div>
        </div>
        <template>
            <div class="map1">
                <baidu-map :center="center" :zoom="zoom" @ready="handler" map-type="BMAP_HYBRID_MAP"  class="map">
                    <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>
                </baidu-map>
            </div>

        </template>
        </body>
        <nav-footer></nav-footer>
    </div>
</template>

<script>
    import NavHeader from "./../../src/components/NavHeader.vue"; /*头部组件 */
    import NavFooter from "./../../src/components/NavFooter.vue"; /*底部组件 */

    export default {
        data(){
            return {
                center: {lng: 0, lat: 0},
                zoom: 3
            }
        },
        components:{
            NavHeader,
            NavFooter
        },

        methods:{
            handler ({BMap, map}) {
                console.log(BMap, map)
                this.center.lng = 104.936529
                this.center.lat = 33.392702
                this.zoom = 50
            }
        }
    }
</script>

<style scoped>

    .aboutUs_title{
        border-bottom: 1px solid rgba(51, 51, 51, 0.15);
        max-width: 1280px;
        margin: 20px auto;

    }
    .aboutUs_title_content{
        height: 100px;
    }
    .aboutUs_title_content span{
        font-size: xx-large;
    }
         /* 地图容器必须设置宽和高属性 */
     .map {

         margin: auto;

         height: 400px;
         left:50px;
         max-width: 960px;
     }

    .content {
        text-align: center;
        min-height: calc(100% - 80px);

    }
    .spanP{
        font-size: 17px;
        font-weight: 100;
        font-stretch: normal
    }
    @media screen and (max-width: 1024px) {
        html {
            font-size: 10px !important;
        }
        .detail>.title {
            padding-top: 3rem;
            padding-bottom: 1rem;
        }
        /*.spanP {*/
        /*    line-height:1.8rem !important;*/
        /*    margin: 0 0 2px !important;*/
        /*    float: right;*/
        /*}*/
        /*p{*/
        /*    font-size: 17px;*/
        /*    font-weight: 100;*/
        /*    font-stretch: normal*/
        /*}*/

        .video{
            margin-top: 0.3rem;
        }
    }
</style>