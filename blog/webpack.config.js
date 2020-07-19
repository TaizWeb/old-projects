const webpack = require('webpack');

module.exports = {
	'entry': {
		'post': './public/post-entry.js',
		'blog': './public/blog-entry.js'
	},
	'output': {
		'path': __dirname,
		'filename': './public/[name]-bundle.js'
	},
	'module': {
		'loaders': [
			{
				'test': /\.scss$/,
				'loader': 'style-loader!css-loader!sass-loader'
			},
			{
				'test': /\.jsx$/,
				'loader': 'babel-loader'
			},
			{
				'test': /\.ttf$/,
				'loader': 'url-loader'
			}
		]
	},
	'plugins': []
};
