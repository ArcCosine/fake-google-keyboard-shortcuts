(function(){
    chrome.runtime.onMessage.addListener(function(msg, sender,sendResponse){
        if( msg.action === "background" ){
            chrome.tabs.create({ url: msg.url, active: false });
        }
    });
})();
