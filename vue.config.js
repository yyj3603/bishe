module.exports = {

    //前端Server和接口代理
    devServer:{
        host:'localhost',

        proxy:{
            // '/api/*':{
            //     /*拦截这个请求转发到下面target转发源*/
            //     target:'http://lemall.futurefe.com/'
            // }
                '/goods':{
                    target:'http://localhost:3000' /**访问/goods时，默认转发到这里去 */
                },
                '/goods/*':{
                    target:'http://localhost:3000'
                },
                '/users/*':{
                    target:'http://localhost:3000'
                },
                '/customers':{
                target:'http://localhost:3000'
                },
                '/customers/*':{
                    target:'http://localhost:3000'
                },


        }
    },
    //项目的基本路径
    //publicPath:'/',
    //项目的生成目录,默认为dist
    //outputDir:'',
    //修改index.html的路径，默认为index.html
    // indexPath:'index.html',
    //文件名是否需要hash
    //filenameHashing:true,
    //控制eslint语法检查的开关
    //lintOnSave:false,
    //是否启用sourceMap
    //productionSourceMap:true

}