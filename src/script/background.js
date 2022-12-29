;(process.env.MANIFEST_VERSION == "3" ? chrome.action.onClicked : chrome.browserAction.onClicked).addListener(async (tab) => {
  if(process.env.MANIFEST_VERSION == "3") {
    return chrome.scripting.executeScript({
      target: {tabId: tab.id},
      files: ["/script/content.js"]
    })
  }

  // mv2
  chrome.tabs.executeScript({ file: "/script/content.js" })
})