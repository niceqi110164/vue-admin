/**Created by xiaoqi on 2019/3/22*/
const path = require('path')

function resolve(dir) {
    return path.join(__dirname, './', dir)
}

module.exports={
    baseUrl:'./',
    // 生产环境是否生成 sourceMap 文件
    productionSourceMap:false,

    chainWebpack:config=>{
        //svg ruke loader
        const svgRule = config.module.rule('svg') //找到svg-loader
        // 清除已有的所有 loader。
        // 如果你不这样做，接下来的 loader 会附加在该规则现有的 loader 之后。
        svgRule.uses.clear()
        svgRule.exclude.add(/node_modules/) //正则匹配派出node_modules目录
        svgRule // 添加svg新的loader处理
            .test(/\.svg$/)
            .use('svg-sprite-loader')
            .loader('svg-sprite-loader')
            .options({
                symbolId: 'icon-[name]'
            })
        //修改 images loader 添加svg处理
        const imagesRule = config.module.rule('images')
        imagesRule.exclude.add(resolve('src/icons'))
        config.module
            .rule('images')
            .test(/\.(png|jpe?g|gif|svg)(\?.*)?$/)

    }

    /**反响代理
    devServer:{
        proxy:{
            '/api':{
                target:'http://jsonplaceholder.typicode.com',
                changeOrigin:true,
                pathRewrite:{
                    'api':''
                }
            }
        },
        '/ms':{
            target: 'https://www.easy-mock.com/mock/592501a391470c0ac1fab128',
            changeOrigin:true
        }
    }*/
};