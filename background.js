(function(){
    chrome.runtime.onConnect.addListener(function(port){
        port.onMessage.addListener(function(msg){
            if( msg.action === "background" ){
                chrome.tabs.create({ url: msg.url, active: false });
            }
        });
    });
})();
