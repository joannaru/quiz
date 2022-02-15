const path = require("path/posix");
const webpack = require('webpack');
const NodemonPlugin = require('nodemon-webpack-plugin')

const postCSSPlugins = [
    require('postcss-import'),
    require('postcss-mixins'),
    require('postcss-simple-vars'),
    require('postcss-nested'),
    require('autoprefixer'),
]

const HTMLWebpackPlugin = require('html-webpack-plugin');
const { htmlWebpackPluginTemplateCustomizer } = require('template-ejs-loader')

const nodeExternals = require('webpack-node-externals');
const StartServerPlugin = require('start-server-webpack-plugin');

const clientConfig = {
    entry: {
        'start': './assets/js/App.js',
        'quiz': './assets/js/AppQuiz.js',
        'edit': './assets/js/AppEdit.js',
        'about': './assets/js/AppAbout.js',
        'list': './assets/js/AppList.js',
    },
    output: {
        publicPath: "/quiz/",// github name
    },


    experiments: {
        topLevelAwait: true,
    },


    devServer: {
        static: {
            directory: path.join(__dirname, 'dist'),
            watch: true,
        },
        liveReload: true,
        hot: true,
        port: 3000,
        host: '0.0.0.0' // allow devices on same network access site
    },
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.ejs$/i,
                use: [

                    { loader: 'html-loader' },
                    { loader: 'template-ejs-loader' },
                ],
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: 'babel-loader'
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
            },

            {
                test: /\.css$/i,//only .css files
                use: ['style-loader', 'css-loader', { loader: 'postcss-loader', options: { postcssOptions: { plugins: postCSSPlugins } } }]
            }
        ]
    },
    optimization: {
        runtimeChunk: 'single'
    },

    plugins: [
        new webpack.ProvidePlugin({
            _: "underscore"
        }),
        new HTMLWebpackPlugin({
            template: htmlWebpackPluginTemplateCustomizer({

                templateEjsLoaderOption: {
                    data: {
                        partial: '../partials/learn'
                    }
                },
                templatePath: './assets/ejs/quiz/quizlet.ejs' // ejs template path 
            }),
            filename: 'quizlet.html',  //destination
            chunks: ['quiz']
        }),
        new HTMLWebpackPlugin({
            template: htmlWebpackPluginTemplateCustomizer({
                templateEjsLoaderOption: {
                    data: {
                        partial: '../partials/list'
                    }
                },
                templatePath: './assets/ejs/quiz/quizlet.ejs' // ejs template path 
            }),
            filename: 'list.html',  //destination
            chunks: ['list']
        }),
        new HTMLWebpackPlugin({
            template: htmlWebpackPluginTemplateCustomizer({
                templateEjsLoaderOption: {
                    data: {
                        partial: '../partials/edit'
                    }
                },
                templatePath: './assets/ejs/quiz/quizlet.ejs' // ejs template path 
            }),
            filename: 'edit.html',  //destination
            chunks: ['edit']
        }),
        new HTMLWebpackPlugin({
            template: htmlWebpackPluginTemplateCustomizer({
                templateEjsLoaderOption: {
                    data: {
                        partial: '../partials/about'
                    }
                },
                templatePath: './assets/ejs/quiz/quizlet.ejs' // ejs template path 
            }),

            filename: 'about.html',  //destination
            chunks: ['about'],


        }),
        new HTMLWebpackPlugin({
            template: './assets/index.html', //source
            filename: 'index.html',  //destination
            chunks: ['start']
        })
    ]
}

module.exports = [clientConfig];
