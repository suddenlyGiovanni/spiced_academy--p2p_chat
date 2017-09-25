const webpack = require( 'webpack' );

const plugins = [
    new webpack.DefinePlugin( {
        "process.env": {
            NODE_ENV: JSON.stringify( "production" )
        }
    } )
];

if ( process.env.NODE_ENV == 'production' ) {
    plugins.push( new webpack.optimize.UglifyJsPlugin( {
        compress: {
            warnings: false
        }
    } ) );
}

const conf = {
    entry: [ 'babel-polyfill', __dirname + '/src/shell.js' ],
    output: {
        path: __dirname + '/public/',
        filename: 'bundle.js'
    },
    plugins: plugins,
    module: {
        loaders: [ {
            test: /\.js$/,
            loader: 'babel-loader',
            query: {
                presets: [ [ 'es2015' ], [ 'react' ], [ 'stage-2' ] ],
                plugins: [ 'transform-async-to-generator' ]
            }
        } ]
    }
};

if ( require.main == module ) {
    webpack( conf, function ( err, info ) {
        if ( err ) {
            console.log( err );
        }
        if ( info && info.compilation.errors.length ) {
            console.log( info.compilation.errors );
        }
    } );
} else {
    module.exports = require( 'webpack-dev-middleware' )( webpack( conf ), {
        watchOptions: {
            aggregateTimeout: 300
        },
        publicPath: '/'
    } );
}
