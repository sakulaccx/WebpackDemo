let _w = require("webpack"); //核心组件
let _path = require("path");
let HtmlWebpackPlugin = require("html-webpack-plugin"); //自动生成HTML的插件
let ExtractTextPlugin = require("extract-text-webpack-plugin"); //将css独立引入变成link标签，使用该插件需要独立下载"npm install extract-text-webpack-plugin --save-dev", 同时下面的rules也必须更改


module.exports = {
	target: "web", //打包类型，将代码打包成对应平台可编译的代码 web|webworker|node|node-webkit ...
	context: _path.resolve(__dirname, "app"), //配置webpack读取所有需要打包文件的根目录
	entry: { //入口文件，路径是相对于上面的context的
		index: "./js/index.js",
		mobile: "./js/mobile.js"
	},
	output: { //output 的配置项和 context 没有关系，建议配置为绝对路径（相对路径不会报错）
		path: _path.resolve(__dirname, "dist"), //打包输出的路径
		filename: "js/[name].js", //打包后的JS [name]-[hash]在每次打包生成不同的hash，更新浏览器缓存		
	},
	devtool: "eval-source-map", //source map 配置
	devServer: { //静态页面服务配置
		/*
			contentBase设置服务器根目录(html所在目录),
			如果HTML直接在dist目录下,则不需要配置contentBase
			如果HTML放在dist/folder下，则需要配置contentBase，然后再配置publicPath
			如果HTML放在dist/folder下那么publicPath需要设置为"/"
			这样服务器启动后直接能够读取到页面和页面所加载的静态资源文件
		*/
		port: "8099", //端口号
		inline: true, //实时刷新(不重启服务直接刷新)，需配合HotModuleReplacementPlugin()插件一起使用，下方plugin中必须调用该webpack自带的插件
		historyApiFallback: true, //所有的历史返回都指向index.html，适合单页应用
		compress: true, //是否压缩HTML
		contentBase: _path.resolve(__dirname, "dist/view"), //自动生成入口HTML的目录		
		publicPath: "/", //设置公用静态文件目录为根目录，HTML中的相对路径的静态资源就可以正确引用了，否则html必须在根目录下(dist/index.html)
	},
	module: {
		noParse: function(content) { //防止 webpack 解析那些任何与给定正则表达式相匹配的文件
			return /jquery|template|underscore-min/.test(content); //|url|flatpickr|iscroll|lodash
		},
		rules: [{ //加载JS
				test: /(\.jsx|\.js)$/, //匹配loader的正则，匹配JS,JSX
				use: ["babel-loader"], //ES6转换器
				exclude: /node_modules/ //排除node_modules
			}, { //加载CSS
				test: /\.css$/, //匹配CSS的正则
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
            },*/
			{
				//图片加载器，雷同file-loader，更适合图片，可以将较小的图片转成base64，减少http请求
				//如下配置，将小于8192byte的图片转成base64码
				test: /\.(jpe?g|png|gif|svg)$/i,
				use: [
					"url?limit=8192&name=img/[hash:8].[name].[ext]",
					"image-webpack"
				]
			},
		]
	},
	plugins: [
		new _w.BannerPlugin("webpack test1"), //webpack自带，给生成后的JS添加版权或说明的插件
		new _w.optimize.OccurrenceOrderPlugin(), //根据模块调用次数，给模块分配ids，常被调用的ids分配更短的id，使得ids可预测，降低文件大小，该模块推荐使用
		new _w.optimize.UglifyJsPlugin({ //JS混淆
			mangle: {
				// 配置以下列表, 在混淆代码时, 以下配置的变量, 不会被混淆
				except: [
					'$super',
					'$',
					'exports',
					'require',
					'_',
					//'url',
					//'iscroll',
					//'flatpickr'
				]
			}
		}),
		new _w.optimize.MinChunkSizePlugin({ //代码压缩
			compress: {
				warnings: false
			}
		}),
		new ExtractTextPlugin({
			filename: "css/[name].css"
		}), //将CSS以<link>标签形式插入页面而不是生成到webpack打包的JS中，避免代码出错或不好调试
		new _w.ProvidePlugin({ //引入一些公用插件如jQuery
			$: "../common/jquery-3.2.1.min",
			_: "../common/underscore-min",
			url: "../common/url",
			flatpickr: "../common/flatpickr",
			IScroll: "../common/iscroll",
			_Date: "../common/date"
		}),
		new HtmlWebpackPlugin({ //根据模板插入css/js等生成最终HTML
			//favicon: "./src/img/favicon.ico", //favicon路径，通过webpack引入同时可以生成hash值
			filename: "./view/index.html", //生成的html存放路径，相对于path
			template: "./tpl/index.tpl.html", //html模板路径
			cache: false, //不缓存页面
			inject: "body", //js插入的位置，true/"head"/"body"/false
			hash: true, //为静态资源生成hash值
			chunks: ["index"], //需要引入的chunk，不配置就会引入所有页面的资源
			minify: { //压缩HTML文件    
				removeComments: true, //移除HTML中的注释
				collapseWhitespace: false //删除空白符与换行符
			}
		}),
		new HtmlWebpackPlugin({ //根据模板插入css/js等生成最终HTML
			//favicon: "./src/img/favicon.ico", //favicon路径，通过webpack引入同时可以生成hash值
			filename: "./view/mobile.html", //生成的html存放路径，相对于path
			template: "./tpl/mobile.tpl.html", //html模板路径
			cache: false, //不缓存页面
			inject: "body", //js插入的位置，true/"head"/"body"/false
			hash: true, //为静态资源生成hash值，这样就不需要在output的filename后加[hash]，否则会导致页面读取不到对应的JS
			chunks: ["mobile"], //需要引入的chunk，不配置就会引入所有页面的资源
			minify: { //压缩HTML文件    
				removeComments: true, //移除HTML中的注释
				collapseWhitespace: false //删除空白符与换行符
			}
		}),

		new _w.HotModuleReplacementPlugin() //热更新
	]
};