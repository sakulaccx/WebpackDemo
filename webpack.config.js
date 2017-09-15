let _w = require("webpack"); //�������
let _path = require("path");
let HtmlWebpackPlugin = require("html-webpack-plugin"); //�Զ�����HTML�Ĳ��
let ExtractTextPlugin = require("extract-text-webpack-plugin"); //��css����������link��ǩ��ʹ�øò����Ҫ��������"npm install extract-text-webpack-plugin --save-dev", ͬʱ�����rulesҲ�������


module.exports = {
	target: "web", //������ͣ����������ɶ�Ӧƽ̨�ɱ���Ĵ��� web|webworker|node|node-webkit ...
	context: _path.resolve(__dirname, "app"), //����webpack��ȡ������Ҫ����ļ��ĸ�Ŀ¼
	entry: { //����ļ���·��������������context��
		index: "./js/index.js",
		mobile: "./js/mobile.js"
	},
	output: { //output ��������� context û�й�ϵ����������Ϊ����·�������·�����ᱨ��
		path: _path.resolve(__dirname, "dist"), //��������·��
		filename: "js/[name].js", //������JS [name]-[hash]��ÿ�δ�����ɲ�ͬ��hash���������������		
	},
	devtool: "eval-source-map", //source map ����
	devServer: { //��̬ҳ���������
		/*
			contentBase���÷�������Ŀ¼(html����Ŀ¼),
			���HTMLֱ����distĿ¼��,����Ҫ����contentBase
			���HTML����dist/folder�£�����Ҫ����contentBase��Ȼ��������publicPath
			���HTML����dist/folder����ôpublicPath��Ҫ����Ϊ"/"
			����������������ֱ���ܹ���ȡ��ҳ���ҳ�������صľ�̬��Դ�ļ�
		*/
		port: "8099", //�˿ں�
		inline: true, //ʵʱˢ��(����������ֱ��ˢ��)�������HotModuleReplacementPlugin()���һ��ʹ�ã��·�plugin�б�����ø�webpack�Դ��Ĳ��
		historyApiFallback: true, //���е���ʷ���ض�ָ��index.html���ʺϵ�ҳӦ��
		compress: true, //�Ƿ�ѹ��HTML
		contentBase: _path.resolve(__dirname, "dist/view"), //�Զ��������HTML��Ŀ¼		
		publicPath: "/", //���ù��þ�̬�ļ�Ŀ¼Ϊ��Ŀ¼��HTML�е����·���ľ�̬��Դ�Ϳ�����ȷ�����ˣ�����html�����ڸ�Ŀ¼��(dist/index.html)
	},
	module: {
		noParse: function(content) { //��ֹ webpack ������Щ�κ������������ʽ��ƥ����ļ�
			return /jquery|template|underscore-min/.test(content); //|url|flatpickr|iscroll|lodash
		},
		rules: [{ //����JS
				test: /(\.jsx|\.js)$/, //ƥ��loader������ƥ��JS,JSX
				use: ["babel-loader"], //ES6ת����
				exclude: /node_modules/ //�ų�node_modules
			}, { //����CSS
				test: /\.css$/, //ƥ��CSS������
				use: ExtractTextPlugin.extract({
					fallback: "style-loader",
					use: "css-loader"
				}),
				exclude: /node_modules/ //�ų�node_modules
			},
			/*{
				//htmlģ������������Դ������õľ�̬��Դ��Ĭ�����ò���attrs=img:src������ͼƬ��src���õ���Դ
                //���������ã�attrs=img:src img:data-src�Ϳ���һ������data-src���õ���Դ�ˣ�������������
				test: /\.html$/,
                use: "html?attrs=img:src img:data-src"
			},
			{
                //�ļ��������������ļ���̬��Դ
                test: /\.(woff|woff2|ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                use: "file-loader?name=./fonts/[name].[ext]"
            },*/
			{
				//ͼƬ����������ͬfile-loader�����ʺ�ͼƬ�����Խ���С��ͼƬת��base64������http����
				//�������ã���С��8192byte��ͼƬת��base64��
				test: /\.(jpe?g|png|gif|svg)$/i,
				use: [
					"url?limit=8192&name=img/[hash:8].[name].[ext]",
					"image-webpack"
				]
			},
		]
	},
	plugins: [
		new _w.BannerPlugin("webpack test1"), //webpack�Դ��������ɺ��JS��Ӱ�Ȩ��˵���Ĳ��
		new _w.optimize.OccurrenceOrderPlugin(), //����ģ����ô�������ģ�����ids���������õ�ids������̵�id��ʹ��ids��Ԥ�⣬�����ļ���С����ģ���Ƽ�ʹ��
		new _w.optimize.UglifyJsPlugin({ //JS����
			mangle: {
				// ���������б�, �ڻ�������ʱ, �������õı���, ���ᱻ����
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
		new _w.optimize.MinChunkSizePlugin({ //����ѹ��
			compress: {
				warnings: false
			}
		}),
		new ExtractTextPlugin({
			filename: "css/[name].css"
		}), //��CSS��<link>��ǩ��ʽ����ҳ����������ɵ�webpack�����JS�У�����������򲻺õ���
		new _w.ProvidePlugin({ //����һЩ���ò����jQuery
			$: "../common/jquery-3.2.1.min",
			_: "../common/underscore-min",
			url: "../common/url",
			flatpickr: "../common/flatpickr",
			IScroll: "../common/iscroll",
			_Date: "../common/date"
		}),
		new HtmlWebpackPlugin({ //����ģ�����css/js����������HTML
			//favicon: "./src/img/favicon.ico", //favicon·����ͨ��webpack����ͬʱ��������hashֵ
			filename: "./view/index.html", //���ɵ�html���·���������path
			template: "./tpl/index.tpl.html", //htmlģ��·��
			cache: false, //������ҳ��
			inject: "body", //js�����λ�ã�true/"head"/"body"/false
			hash: true, //Ϊ��̬��Դ����hashֵ
			chunks: ["index"], //��Ҫ�����chunk�������þͻ���������ҳ�����Դ
			minify: { //ѹ��HTML�ļ�    
				removeComments: true, //�Ƴ�HTML�е�ע��
				collapseWhitespace: false //ɾ���հ׷��뻻�з�
			}
		}),
		new HtmlWebpackPlugin({ //����ģ�����css/js����������HTML
			//favicon: "./src/img/favicon.ico", //favicon·����ͨ��webpack����ͬʱ��������hashֵ
			filename: "./view/mobile.html", //���ɵ�html���·���������path
			template: "./tpl/mobile.tpl.html", //htmlģ��·��
			cache: false, //������ҳ��
			inject: "body", //js�����λ�ã�true/"head"/"body"/false
			hash: true, //Ϊ��̬��Դ����hashֵ�������Ͳ���Ҫ��output��filename���[hash]������ᵼ��ҳ���ȡ������Ӧ��JS
			chunks: ["mobile"], //��Ҫ�����chunk�������þͻ���������ҳ�����Դ
			minify: { //ѹ��HTML�ļ�    
				removeComments: true, //�Ƴ�HTML�е�ע��
				collapseWhitespace: false //ɾ���հ׷��뻻�з�
			}
		}),

		new _w.HotModuleReplacementPlugin() //�ȸ���
	]
};