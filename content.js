(() => {
    let arrow;
    let _arrowPos = -1;

    // This _selector may change on a regular basis every time Google's HTML changes.
    const _selector = ".r > a,#pnprev,#pnnext";

    // append fake arrow
    const appendArrow = () => {
        _arrow = document.body.appendChild(document.createElement("div"));
        _arrow.classList.add("fake-arrow");
        down();
    };

    const up = () => {
        move(1);
    };

    const down = () => {
        move(-1);
    };

    const moveArrow = node => {
        const appendNode = node.parentNode;

        if (node.id === "pnnext" || node.id === "pnprev") {
            appendNode.style.position = "relative";
        }

        if (node.id === "pnnext") {
            _arrow.classList.add("right");
        } else {
            _arrow.classList.remove("right");
        }

        appendNode.appendChild(_arrow);

        const headerHeight = document
            .querySelector(".sfbg")
            .getBoundingClientRect().height;
        const mypos =
            window.pageYOffset +
            appendNode.getBoundingClientRect().top -
            headerHeight;

        window.scrollTo({
            top: mypos,
            behavior: "smooth"
        });
    };
    const move = no => {
        const nodes = document.querySelectorAll(_selector);
        const nextPos = _arrowPos + no;
        const pos =
            nextPos < 0
                ? 0
                : nextPos > nodes.length - 1
                ? nodes.length - 1
                : nextPos;
        moveArrow(nodes[pos]);
        _arrowPos = pos;
    };

    const open = keyState => {
        const nodes = document.querySelectorAll(_selector);
        if (keyState.ctrl === true) {
            nodes[_arrowPos].setAttribute("target", "_blank");
            nodes[_arrowPos].setAttribute("rel", "noopener");
        } else {
            nodes[_arrowPos].removeAttribute("target");
        }
        if (keyState.shift === true) {
            nodes[_arrowPos];
            chrome.runtime.sendMessage(
                { action: "background", url: nodes[_arrowPos].href },
                response => {
                    //do response
                }
            );
        } else {
            nodes[_arrowPos].click();
        }
    };

    const focus = () => {
        _arrowPos = -1; //reset
        document.querySelector(".gLFyf.gsfi").focus();
    };

    // control
    const keyHandler = event => {
        //console.log(event.key);
        const handleObj = {
            Enter: open,
            j: up,
            k: down,
            "/": focus
        };
        if (event.defaultPrevented) {
            return; // Do nothing if the event was already processed
        }

        const node = event.target;
        if (
            node.nodeType === 1 &&
            !/INPUT|TEXTAREA/.test(node.tagName.toUpperCase()) &&
            typeof handleObj[event.key] === "function"
        ) {
            event.preventDefault();
            handleObj[event.key]({
                ctrl: event.ctrlKey,
                shift: event.shiftKey
            });
        }
    };

    // Entry Point
    document.addEventListener('DOMContentLoaded', appendArrow, false );
    document.addEventListener("keydown", keyHandler, false);
})();
