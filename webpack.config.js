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
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: 'asset/resource',
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