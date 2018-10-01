(function(){
    var _arrow, _arrowPos = -1;

    // TODO
    // This _selector may change on a regular basis every time Google's HTML changes.
    var _selector = '.r > a:first-child,#pnprev,#pnnext';

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
        if( !_arrow ){
            _arrow = document.body.appendChild(document.createElement("div"));
            _arrow.classList.add("fake-arrow");
        }
        if( node.id === "pnnext" ){
            _arrow.classList.add("right");
        } else {
            _arrow.classList.remove("right");
        }
        var appendNode = node.id.indexOf("pn") > -1 ? node.parentNode : node.parentNode.parentNode.parentNode.parentNode;
        appendNode.style.position = "relative";
        appendNode.appendChild(_arrow);
        if(!isInView(appendNode)){
            window.scrollTo({
                top: appendNode.offsetTop,
                behavior: 'smooth'
            });
        }
    };
    var move = function(no){
        var nodes = document.querySelectorAll(_selector);
        var nextPos = _arrowPos+no;
        var pos = nextPos < 0 ? 0 : nextPos > nodes.length-1 ? nodes.length-1 : nextPos;
        moveArrow(nodes[pos]);
        _arrowPos = pos;
    };

    var open = function(keyState){
        var nodes = document.querySelectorAll(_selector);
        if( keyState.ctrl === true ){
            nodes[_arrowPos].setAttribute("target", "_blank");
        } else {
            nodes[_arrowPos].removeAttribute("target");
        }
        if( keyState.shift === true ){
            nodes[_arrowPos]
            chrome.runtime.sendMessage({"action":"background","url":nodes[_arrowPos].href}, function(response){
                //do response
            });
        } else {
            nodes[_arrowPos].click();
        }
    };

    var focus = function(){
        _arrowPos = -1;//reset
        document.getElementById("lst-ib").focus();
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
