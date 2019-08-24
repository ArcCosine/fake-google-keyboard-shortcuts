(()=>{
    let _arrow, _arrowPos = -1;

    // TODO
    // This _selector may change on a regular basis every time Google's HTML changes.
    const _selector = '.r > a,#pnprev,#pnnext';

    const up = () => {
        move(1);
    };

    const down = () => {
        move(-1);
    };

    const isInView = (node) => {
        const rect = node.getBoundingClientRect();
        return node === document.elementFromPoint(rect.left, rect.top);
    };

    const moveArrow = (node) => {
        if( !_arrow ){
            _arrow = document.body.appendChild(document.createElement("div"));
            _arrow.classList.add("fake-arrow");
        }
        if( node.id === "pnnext" ){
            _arrow.classList.add("right");
        } else {
            _arrow.classList.remove("right");
        }
        const appendNode = node.id.indexOf("pn") > -1 ? node.parentNode : node.parentNode.parentNode.parentNode.parentNode;
        appendNode.style.position = "relative";
        appendNode.appendChild(_arrow);
        if(!isInView(appendNode)){
            window.scrollTo({
                top: appendNode.offsetTop,
                behavior: 'smooth'
            });
        }
    };
    const move = (no) => {
        const nodes = document.querySelectorAll(_selector);
        const nextPos = _arrowPos+no;
        const pos = nextPos < 0 ? 0 : nextPos > nodes.length-1 ? nodes.length-1 : nextPos;
        moveArrow(nodes[pos]);
        _arrowPos = pos;
    };

    const open = (keyState) => {
        const nodes = document.querySelectorAll(_selector);
        if( keyState.ctrl === true ){
            nodes[_arrowPos].setAttribute("target", "_blank");
            nodes[_arrowPos].setAttribute("rel", "noopener");
        } else {
            nodes[_arrowPos].removeAttribute("target");
        }
        if( keyState.shift === true ){
            nodes[_arrowPos]
            chrome.runtime.sendMessage({"action":"background","url":nodes[_arrowPos].href}, (response) => {
                //do response
            });
        } else {
            nodes[_arrowPos].click();
        }
    };

    const focus = () => {
        _arrowPos = -1;//reset
        document.querySelector(".gLFyf.gsfi").focus();
    };

    // control
    const keyHandler = (event) => {
        //console.log(event.key);
        const handleObj = {
            "Enter" : open,
            "j": up,
            "k": down,
            "/": focus
        };
        if (event.defaultPrevented) {
            return; // Do nothing if the event was already processed
        }

        const node = event.target;
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
