const path = require('path');

module.exports = {
    mode: 'none',
    entry: './src/www/client/js/app.js',
    output: {
        filename: 'app_bundle.js',
        path: path.resolve(__dirname, 'src/www/static'),
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    // Creates `style` nodes from JS strings
                    "style-loader",
                    // Translates CSS into CommonJS
                    "css-loader",
                    // Compiles Sass to CSS
                    "sass-loader",
                ],
            },
            {
                test: /\.(csv|tsv)$/i,
                use: ['csv-loader'],
            },
            {
                test: /\.xml$/i,
                use: ['xml-loader'],
            },
            {
                test: /\.html$/i,
                loader: "html-loader",
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192, // Limit file size to inline as Data URL if it's smaller than 8KB
                            name: 'fonts/[name].[hash:8].[ext]', // Output path and file name pattern
                        }
                    }
                ]
            }
        ],
    },
    resolve: {
        fallback: {
            path: require.resolve("path-browserify")
        }
    },
    devServer: {
        port: process.env.PORT_HTTP
    }
};