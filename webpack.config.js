const webpack = require('webpack');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = function (env) {
	const platform = env.platform || 'node';
	const isAdmin = env.isAdmin || 'yes';
	let enableHotModuleReplacement = false;

	const nodeEnv = process.env.NODE_ENV || 'development';
	const isProduction = nodeEnv === 'production';

	if (isProduction || platform !== 'node') {
		enableHotModuleReplacement = false;
	}

	const config = {};

	config.mode = isProduction ? 'production' : 'development';

	config.entry = {
		main: ['babel-polyfill', './src/main.js'],
	};

	config.output = {
		path: path.resolve(__dirname, './public/dist'),
		filename: '[name].js',
		publicPath: '/dist',
		pathinfo: !isProduction,
	};

	config.optimization = {
		namedModules: true, // NamedModulesPlugin()
		noEmitOnErrors: true, // NoEmitOnErrorsPlugin
	};

	if (isProduction) {
		config.optimization.minimizer = [
			new TerserPlugin({
				parallel: true,
				extractComments: false,
				terserOptions: {
					ecma: 6,
					mangle: true,
					output: { comments: false },
				},
			}),
		];
	}

	config.plugins = [
		new webpack.EnvironmentPlugin({
			NODE_ENV: nodeEnv,
			isAdmin: isAdmin,
			platform: platform,
		}),
		new StyleLintPlugin({
			configFile: '.stylelintrc',
			files: '**/*.less',
			failOnError: false,
			quiet: false,
			syntax: 'less',
		}),
	];

	if (enableHotModuleReplacement) {
		config.plugins = config.plugins.concat([
			new webpack.HotModuleReplacementPlugin(),
		]);
	}

	if (platform === 'web_server') {
		config.plugins = config.plugins.concat([
			new MiniCssExtractPlugin({ filename: '[name].css' }),
		]);
	}

	config.module = {};

	const styleLoader = {
		loader: 'style-loader',
	};

	const cssLoader = {
		loader: 'css-loader',
		options: {
			modules: {
				mode: 'local',
				localIdentName: !isProduction
					? '[name]__[local]__[hash:base64:5]'
					: '[hash:base64:5]',
			},
		},
	};

	const postcssLoader = {
		loader: 'postcss-loader',
		options: {
			plugins: function () {
				return [
					require('autoprefixer'),
					require('cssnano')({
						preset: [
							'default',
							{
								discardComments: {
									removeAll: true,
								},
							},
						],
					}),
				];
			},
		},
	};

	const colors = path.join(__dirname, 'src/assets/styles', 'colors.less');

	const lessLoader = {
		loader: 'less-loader',
		options: {
			strictMath: true,
			noIeCompat: true,
			globalVars: {
				colors: `'${colors}'`,
			},
		},
	};

	config.module.rules = [
		{
			test: /\.(js|jsx)$/,
			exclude: /node_modules/,
			use: ['babel-loader', 'webpack-conditional-loader'],
		},
	];

	if (platform === 'node') {
		config.module.rules.push({
			test: /\.less$/,
			exclude: [path.resolve('node_modules')],
			use: [styleLoader, cssLoader, postcssLoader, lessLoader],
		});
	} else {
		config.module.rules.push({
			test: /\.less$/,
			use: [MiniCssExtractPlugin.loader, cssLoader, postcssLoader, lessLoader],
			exclude: [path.resolve('node_modules')],
		});
	}

	config.resolve = {
		modules: [path.resolve(__dirname, 'src'), 'node_modules'],
		extensions: ['.js', '.jsx'],
		symlinks: false,
	};

	//config.devtool =  !isProduction ? 'cheap-module-source-map' : false;
	config.devServer = {
		contentBase: path.join(__dirname, 'public'),
		watchContentBase: true,
		disableHostCheck: true,
		port: 8080,
		hot: enableHotModuleReplacement,
		//host: '192.168.88.18',
		historyApiFallback: {
			index: 'index.html',
		},
	};

	return config;
};
