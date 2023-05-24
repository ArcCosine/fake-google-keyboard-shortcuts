(() => {
    let _arrowPos = -1;

    // This _selector may change on a regular basis every time Google's HTML changes.
    const _selector = "#center_col .g,#pnprev,#pnnext";

    // append fake arrow
    const appendArrow = () => {
        const _arrow = document.body.appendChild(document.createElement("div"));
        _arrow.classList.add("fake-arrow");
    };

    const up = () => {
        move(1);
    };

    const down = () => {
        move(-1);
    };

    const moveArrow = (appendNode) => {
        const _arrow = document.querySelector(".fake-arrow");
        if (appendNode.id === "pnnext" || appendNode.id === "pnprev") {
            appendNode.parentNode.style.position = "relative";
            if (appendNode.id === "pnnext") {
                _arrow.classList.add("right");
            } else {
                _arrow.classList.remove("right");
            }
            appendNode.parentNode.appendChild(_arrow);
        } else {
            appendNode.style.position = "relative";
            _arrow.classList.remove("right");
            appendNode.appendChild(_arrow);
        }

        const headerHeight = document
            .querySelector(".sfbg")
            .getBoundingClientRect().height;
        const mypos =
            window.pageYOffset +
            appendNode.getBoundingClientRect().top -
            headerHeight;

        window.scrollTo({
            top: mypos,
            behavior: "smooth",
        });
    };
    const move = (no) => {
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

    const open = (keyState) => {
        const nodes = document.querySelectorAll(_selector);
        const linkNode =
            nodes[_arrowPos].tagName.toLowerCase() === "a"
                ? nodes[_arrowPos]
                : nodes[_arrowPos].querySelectorAll("a")[0];
        if (keyState.ctrl === true) {

            linkNode.removeAttribute("target");
            chrome.runtime.sendMessage({
                action: "foreground",
                url: linkNode.href
            },
                (response) => {
                    // do response
                    // console.log(response);
                }
            );
        } else if (keyState.shift === true) {
            chrome.runtime.sendMessage(
                { action: "background", url: linkNode.href },
                (response) => {
                    //do response
                    //console.log(response);
                }
            );
        } else {
            linkNode.click();
        }
    };

    // control
    const keyHandler = (event) => {
        const handleObj = {
            Enter: open,
            j: up,
            k: down,
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
                shift: event.shiftKey,
            });
        }
    };

    // Entry Point
    document.addEventListener("DOMContentLoaded", appendArrow, false);
    document.addEventListener("keydown", keyHandler, false);
})();
