chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'scrape') {
    sendResponse({ tabId: request.tabId });
    if (request.tabId !== undefined) {
      chrome.scripting.executeScript({
        target: { tabId: request.tabId, allFrames: true },
        files: ['scrape.js'],
      });
    } else {
      console.log('No tabId');
    }
  }
  if (request.type === 'send-markdown') {
    console.log(request.markdown);
  }
});
