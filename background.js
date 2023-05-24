(()=>{
    chrome.runtime.onMessage.addListener((msg, sender,sendResponse)=>{
        if( msg.action === "background" ){
            chrome.tabs.create({ url: msg.url, active: false });
            //sendResponse('success');
        }
    });
})();
