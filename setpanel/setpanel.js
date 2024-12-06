var currentSet = document.getElementById("current-set")
var returnButton = document.getElementById("return")

function setUp(){
    chrome.storage.local.get(['userLocal'], async function (result) {
        var userLocal = result.userLocal;
        currentSet.innerHTML = userLocal.set

        if (userLocal.panel == "set") {
            for (let e of document.body.querySelectorAll("*")){
                e.style.animationName = "fadein";
                e.style.animationDuration = "250ms";
            }
        }

        currentSet.style.visibility = "visible"
        returnButton.style.visibility = "visible"
    });
}

function return_panels(){
    chrome.storage.local.get(['userLocal'], async function (result) {
        var user = result.userLocal;
        user.set = ""
        user.panel = "main"
        await chrome.storage.local.set({userLocal: user}, function () {});
    });
}

returnButton.onclick = async function(){
    let time = "300ms"

    for (let e of document.body.querySelectorAll("*")){
        e.style.animationName = "fadeout";
        e.style.animationDuration = time;
    }

    await new Promise(resolve => setTimeout(resolve, 250));

    chrome.sidePanel.setOptions({ path: `sidepanel/sidepanel.html` })

    return_panels()
}


var add = document.getElementById("add")
var search = document.getElementById("search")
var close1 = document.getElementById("close1")
var close2 = document.getElementById("close2")
var bottom = document.getElementsByClassName("bottom")[0]
var bottombuttons = document.getElementsByClassName("bottom-buttons")[0]
var bottominputs1 = document.getElementsByClassName("bottom-inputs1")[0]
var bottominputs2 = document.getElementsByClassName("bottom-inputs2")[0]
var termscontainer = document.getElementsByClassName("terms-container")[0]
var searching = document.getElementsByTagName("input")[0]
var adding = document.getElementById("naming")

var terms = []

chrome.storage.local.get(['userLocal'], async function (result) {
    let user = result.userLocal;
    let set = user.set
    let termstoAdd = user.flashcards[set]
    for (let term of termstoAdd){
        let newbutton = document.createElement("button")
        newbutton.setAttribute("class", "term")
        newbutton.innerHTML = term
        termscontainer.appendChild(newbutton)

        newbutton.addEventListener("click", async () => {
            await switch_panels(newbutton.innerHTML);

            for (let e of document.body.querySelectorAll("*")){
                e.style.animationName = "fadeout";
                e.style.animationDuration = "300ms";
            }
            await new Promise(resolve => setTimeout(resolve, 250));
            
            await chrome.sidePanel.setOptions({ path: `termpanel/termpanel.html` })
        })

        terms.push(newbutton)

    }
    setUp()
})

add.onclick = function(){
    add.style.animationName = "grow, fadeout"
    add.style.animationDuration = "500ms"
    add.style.visibility = "hidden"

    search.style.animationName = "shrink, fadeout"
    search.style.animationDuration = "500ms"
    search.style.visibility = "hidden"

    close2.style.animationName = "shrink, fadein"
    close2.style.animationDuration = "500ms"
    close2.style.visibility = "visible"

    adding.style.animationName = "grow, fadein"
    adding.style.animationDuration = "500ms"
    adding.style.visibility = "visible"

    bottom.removeChild(bottominputs2)
    bottom.appendChild(bottominputs2)

    adding.focus()
}

close1.onclick = function(){
    add.style.animationName = "shrink,fadein"
    add.style.animationDuration = "500ms"
    add.style.visibility = "visible"

    search.style.animationName = "grow, fadein"
    search.style.animationDuration = "500ms"
    search.style.visibility = "visible"

    close1.style.animationName = "grow, fadeout"
    close1.style.animationDuration = "500ms"
    close1.style.visibility = "hidden"

    searching.style.animationName = "shrink, fadeout"
    searching.style.animationDuration = "500ms"
    searching.style.visibility = "hidden"

    bottom.removeChild(bottombuttons)
    bottom.appendChild(bottombuttons)
}

close2.onclick = function(){
    add.style.animationName = "shrink,fadein"
    add.style.animationDuration = "500ms"
    add.style.visibility = "visible"

    search.style.animationName = "grow, fadein"
    search.style.animationDuration = "500ms"
    search.style.visibility = "visible"

    close2.style.animationName = "grow, fadeout"
    close2.style.animationDuration = "500ms"
    close2.style.visibility = "hidden"

    adding.style.animationName = "shrink, fadeout"
    adding.style.animationDuration = "500ms"
    adding.style.visibility = "hidden"

    bottom.removeChild(bottombuttons)
    bottom.appendChild(bottombuttons)
}

search.onclick = function(){
    add.style.animationName = "grow,fadeout"
    add.style.animationDuration = "500ms"
    add.style.visibility = "hidden"

    search.style.animationName = "shrink, fadeout"
    search.style.animationDuration = "500ms"
    search.style.visibility = "hidden"

    close1.style.animationName = "shrink, fadein"
    close1.style.animationDuration = "500ms"
    close1.style.visibility = "visible"

    searching.style.animationName = "grow, fadein"
    searching.style.animationDuration = "500ms"
    searching.style.visibility = "visible"

    bottom.removeChild(bottominputs1)
    bottom.appendChild(bottominputs1)

    searching.focus()
}

async function switch_panels(term){
    await chrome.storage.local.get(['userLocal'], async function (result) {
        var user = result.userLocal;
        user.term = term
        user.panel = "term"
        await chrome.storage.local.set({userLocal: user}, function () {});
    });
}

async function updateTerms(term){
    await chrome.storage.local.get(['userLocal'], async function (result) {
        var user = result.userLocal;
        let set = user.set
        user.flashcards[set].push(term)
        console.log(user.sets)
        console.log(user.flashcards)
        await chrome.storage.local.set({userLocal: user}, function () {});
    });
}

async function addTerm(name){
    if(name != "") {
        var newbutton = document.createElement("button")
        newbutton.setAttribute("class", "term")
        newbutton.innerHTML = name
        termscontainer.appendChild(newbutton)
        adding.value = ""

        await updateTerms(name)

        newbutton.addEventListener("click", async () => {
            await switch_panels(newbutton.innerHTML);

            for (let e of document.body.querySelectorAll("*")){
                e.style.animationName = "fadeout";
                e.style.animationDuration = "300ms";
            }
            await new Promise(resolve => setTimeout(resolve, 250));
            
            await chrome.sidePanel.setOptions({ path: `termpanel/termpanel.html` })
        })

        terms.push(newbutton)
    }
}

adding.addEventListener("keydown", (e) => {
    if(e.key == "Enter") {
        addTerm(adding.value)
    }
})