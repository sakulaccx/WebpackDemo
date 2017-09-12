let _w = require("webpack");	//核心组件
let _path = require("path");
let HtmlWebpackPlugin = require("html-webpack-plugin");	//自动生成HTML的插件
let ExtractTextPlugin = require("extract-text-webpack-plugin"); //将css独立引入变成link标签，使用该插件需要独立下载"npm install extract-text-webpack-plugin --save-dev", 同时下面的rules也必须更改


module.exports = {
	target: "web",
	context: _path.resolve(__dirname,"app"),
	entry: {//入口文件
		index: "./js/index.js",
		product: "./js/product.js"
	}, 
	output: {
		path: _path.join(__dirname,"dist"), //打包输出的路径
		//publicPath: "/dist", //添加静态资源(图片), 否则会出现路径错误
		filename: "js/[name]-[hash].js"	//打包后的JS -[hash]在每次打包生成不同的hash，更新浏览器缓存
	},
	devtool: "eval-source-map", //source map 配置
	devServer: {	//静态页面服务配置
		port: "8099",	//端口号
		inline: true,	//实时刷新(不重启服务直接刷新)
		historyApiFallback: true,	//不跳转
		contentBase: _path.join(__dirname,"dist/view/index.html"),	//自动生成入口HTML的目录
		compress: true
	},
	module: {
		noParse: function(content){ //防止 webpack 解析那些任何与给定正则表达式相匹配的文件
			return /jquery|template|underscore-min|lodash/.test(content);
		},
		rules: [
			{//加载JS
				test: /(\.jsx|\.js)$/,	//匹配loader的正则，匹配JS,JSX
				use: ["babel-loader"],	//ES6转换器
				exclude: /node_modules/	//排除node_modules
			},
			{//加载CSS
				test: /\.css$/,	//匹配CSS的正则
				use: ExtractTextPlugin.extract({
					fallback: "style-loader",
					use: "css-loader"
				}),
				exclude: /node_modules/ //排除node_modules
			},
			/*{
				//html模板加载器，可以处理引用的静态资源，默认配置参数attrs=img:src，处理图片的src引用的资源
                //比如你配置，attrs=img:src img:data-src就可以一并处理data-src引用的资源了，就像下面这样
				test: /\.html$/,
                use: "html?attrs=img:src img:data-src"
			},
			{
                //文件加载器，处理文件静态资源
                test: /\.(woff|woff2|ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                use: "file-loader?name=./fonts/[name].[ext]"
            },
			{
				//图片加载器，雷同file-loader，更适合图片，可以将较小的图片转成base64，减少http请求
                //如下配置，将小于8192byte的图片转成base64码
				test: /.(jpg|png|gif|svg)$/, 
				use: ["url-loader?limit=8192&name=./[name].[ext]"]
			},*/
		]
	},
	plugins: [
        new _w.BannerPlugin("webpack test1"),	//webpack自带，给生成后的JS添加版权或说明的插件
        new _w.optimize.OccurrenceOrderPlugin(), //根据模块调用次数，给模块分配ids，常被调用的ids分配更短的id，使得ids可预测，降低文件大小，该模块推荐使用
        new _w.optimize.UglifyJsPlugin(),	//JS压缩插件
        new ExtractTextPlugin({filename: "css/[name].css"}), //CSS插入页面
        new _w.ProvidePlugin({
        	$: "../common/jquery-3.2.1.min",
        	_: "../common/underscore-min",
        	url: "../common/url"
        }), //引入一些插件如jQuery
        new HtmlWebpackPlugin({ //根据模板插入css/js等生成最终HTML
            //favicon: "./src/img/favicon.ico", //favicon路径，通过webpack引入同时可以生成hash值
            filename: "./view/index.html", //生成的html存放路径，相对于path
            template: "./tpl/index.tpl.html", //html模板路径
            inject: "body", //js插入的位置，true/"head"/"body"/false
            hash: true, //为静态资源生成hash值
            chunks: ["index"],//需要引入的chunk，不配置就会引入所有页面的资源
            minify: { //压缩HTML文件    
                removeComments: true, //移除HTML中的注释
                collapseWhitespace: false //删除空白符与换行符
            }
        }),
        new HtmlWebpackPlugin({ //根据模板插入css/js等生成最终HTML
            //favicon: "./src/img/favicon.ico", //favicon路径，通过webpack引入同时可以生成hash值
            filename: "./view/product.html", //生成的html存放路径，相对于path
            template: "./tpl/product.tpl.html", //html模板路径
            inject: "body", //js插入的位置，true/"head"/"body"/false
            hash: true, //为静态资源生成hash值
            chunks: ["product"],//需要引入的chunk，不配置就会引入所有页面的资源
            minify: { //压缩HTML文件    
                removeComments: true, //移除HTML中的注释
                collapseWhitespace: false //删除空白符与换行符
            }
        }),

        new _w.HotModuleReplacementPlugin()  //热插拔
    ]
};