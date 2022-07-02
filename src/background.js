function injectedFunction() {
  document.body.style.backgroundColor = 'orange';
}

chrome.action.onClicked.addListener((tab) => {});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'color') {
    sendResponse({ tabId: request.tabId });
    if (request.tabId !== undefined) {
      chrome.scripting.executeScript({
        target: { tabId: request.tabId, allFrames: true },
        files: ['scrape.js'],
      });
    }
  }
  if (request.type === 'send-markdown') {
    console.log(request.markdown);

    // Copy to clipboard
    const textarea = document.createElement('textarea');
    textarea.value = request.markdown;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  }
});
