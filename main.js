const downloadBtn = document.getElementById("download")
const loadBtn = document.getElementById("load")
const loadInput = document.getElementById("drop-file")

downloadBtn.onclick = () => injectJs(downloadStorage)
loadInput.onchange = event => {
	const reader = new FileReader()
	reader.readAsText(event.target.files[0])
	reader.onload = event => injectJs(loadStorage, event.target.result)
}

function loadStorage(storageStr) {
	// Delete currest storage
	for (const key of Object.keys(localStorage))
		delete localStorage[key]
	// Set new storage
	Object.assign(localStorage, JSON.parse(storageStr).localStorage)
}

function downloadStorage() {
	const storageStr = JSON.stringify({localStorage})
	
	const element = document.createElement('a')
	element.setAttribute('href', 'data:text/plaincharset=utf-8,' + encodeURIComponent(storageStr))
	element.setAttribute('download', filename)

	document.body.appendChild(element)
	element.click()
	document.body.removeChild(element)
}

function injectJs(func, ...args) {
	(async () => {
		const tabId = (await chrome.tabs.query({ active: true, lastFocusedWindow: true }))[0].id
		chrome.scripting.executeScript({
			target: { tabId },
			func,
			args: args ?? [],
		});
	})()
}