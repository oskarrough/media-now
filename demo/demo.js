import { parseUrl, parseTitle, cleanTitle, getMedia, discoverDiscogsUrl } from '../dist/media-now.js'

const formatOutput = (data) => JSON.stringify(data, null, 2)

const setOutput = (id, content, isError = false) => {
  const el = document.getElementById(id)
  el.textContent = content
  el.className = isError ? 'error' : ''
}

const setLoading = (id) => {
  const el = document.getElementById(id)
  el.textContent = 'Loading...'
  el.className = 'loading'
}

// parseUrl - sync
const runParseUrl = () => {
  const input = document.getElementById('parseurl-input').value
  const result = parseUrl(input)
  setOutput('parseurl-output', result === null ? 'null' : formatOutput(result))
}
document.getElementById('parseurl-btn').addEventListener('click', runParseUrl)

// Provider quick-fill buttons for parseUrl
document.querySelectorAll('#parseurl-input').forEach(input => {
  input.closest('section').querySelectorAll('.provider-btns button').forEach(btn => {
    btn.addEventListener('click', () => {
      input.value = btn.dataset.url
      runParseUrl()
    })
  })
})

// Provider quick-fill buttons for getMedia
document.querySelectorAll('#getmedia-input').forEach(input => {
  input.closest('section').querySelectorAll('.provider-btns button').forEach(btn => {
    btn.addEventListener('click', () => {
      input.value = btn.dataset.url
      document.getElementById('getmedia-btn').click()
    })
  })
})

// parseTitle - sync
document.getElementById('parsetitle-btn').addEventListener('click', () => {
  const input = document.getElementById('parsetitle-input').value
  const result = parseTitle(input)
  setOutput('parsetitle-output', formatOutput(result))
})

// cleanTitle - sync
document.getElementById('cleantitle-btn').addEventListener('click', () => {
  const input = document.getElementById('cleantitle-input').value
  const result = cleanTitle(input)
  setOutput('cleantitle-output', formatOutput(result))
})

// getMedia - async
document.getElementById('getmedia-btn').addEventListener('click', async () => {
  const input = document.getElementById('getmedia-input').value
  const btn = document.getElementById('getmedia-btn')
  btn.disabled = true
  setLoading('getmedia-output')
  try {
    const result = await getMedia(input)
    setOutput('getmedia-output', formatOutput(result))
  } catch (err) {
    setOutput('getmedia-output', err.message, true)
  } finally {
    btn.disabled = false
  }
})

// discoverDiscogsUrl - async
document.getElementById('discover-btn').addEventListener('click', async () => {
  const input = document.getElementById('discover-input').value
  const btn = document.getElementById('discover-btn')
  btn.disabled = true
  setLoading('discover-output')
  try {
    const result = await discoverDiscogsUrl(input)
    setOutput('discover-output', result === null ? 'null' : formatOutput(result))
  } catch (err) {
    setOutput('discover-output', err.message, true)
  } finally {
    btn.disabled = false
  }
})
