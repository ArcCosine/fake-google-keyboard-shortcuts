(function(){
    var arrow, arrowPos = -1;

    var up = function(){
        move(1);
    };

    var down = function(){
        move(-1);
    };

    var isInView = function(node){
        var rect = node.getBoundingClientRect();
        return node === document.elementFromPoint(rect.left, rect.top);
    };

    var moveArrow = function(node){
        if( !arrow ){
            arrow = document.body.appendChild(document.createElement("div"));
            arrow.classList.add("fake-arrow");
        }
        var appendNode = node.parentNode.parentNode.parentNode.parentNode;
        appendNode.style.position = "relative";
        appendNode.appendChild(arrow);
        if(!isInView(appendNode)){
            scrollTo( 0, appendNode.offsetTop );
        }
    };
    var move = function(no){
        var nodes = document.querySelectorAll("h3.r a:first-child");
        var nextPos = arrowPos+no;
        var pos = nextPos < 0 ? 0 : nextPos > nodes.length-1 ? nodes.length-1 : nextPos;
        moveArrow(nodes[pos]);
        arrowPos = pos;
    };

    var open = function(keyState){
        var nodes = document.querySelectorAll("h3.r a:first-child");
        if( keyState.ctrl === true ){
            nodes[arrowPos].setAttribute("target" , "_blank" );
        } else {
            nodes[arrowPos].removeAttribute("target" );
        }
        if( keyState.shift === true ){
            nodes[arrowPos]
            chrome.runtime.sendMessage({"action":"background","url":nodes[arrowPos].href}, function(response){
                //do response
            });
        } else {
            nodes[arrowPos].click();
        }
    };

    var focus = function(){
        arrowPos = -1;//reset
        var input = document.getElementById("lst-ib");
        input.focus();
    };

    // control
    var keyHandler = function(event){
        var handleObj = {
            "Enter" : open,
            "j": up,
            "k": down,
            "/": focus
        };
        if (event.defaultPrevented) {
            return; // Do nothing if the event was already processed
        }

        var node = event.target;
        if( node.nodeType === 1 && !/INPUT|TEXTAREA/.test(node.tagName.toUpperCase()) && typeof handleObj[event.key]  === "function"){
            event.preventDefault();
            handleObj[event.key]({
                ctrl: event.ctrlKey,
                shift: event.shiftKey
            });
        }
    };


    // Entry Point
    document.addEventListener("keydown", keyHandler, false );
})();
