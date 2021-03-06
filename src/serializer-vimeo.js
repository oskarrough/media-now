const fetch = require('isomorphic-fetch')

const key = process.env.VIMEO_KEY

const buildURL = function (id) {
	return `https://api.vimeo.com/videos/${id}`
}

const fetchData = async function (id) {
	if (!key) {
		throw new Error('A VIMEO_KEY in your .env file is required')
	}
	return fetch(buildURL(id), {
		// Vimeo requires an auth header.
		headers: {
			Authorization: key
		}
	})
}

const serialize = function (json) {
	if (!json || json.error) {
		const msg = json.error || 'No results found'
		throw new Error(msg)
	}

	return {
		provider: 'vimeo',
		id: json.uri.split('/')[2], // No id in the JSON?
		url: json.link,
		title: json.name,
		thumbnail: json.pictures.sizes[0].link,
		duration: json.duration
	}
}

module.exports.fetchData = fetchData
module.exports.serialize = serialize
