var currentTerm = document.getElementById("current-term")
var returnButton = document.getElementById("return")
var searching = document.getElementsByTagName("input")[0]
var adding = document.getElementById("naming")
var add = document.getElementById("add")
var search = document.getElementById("search")
var close1 = document.getElementById("close1")
var close2 = document.getElementById("close2")
var bottom = document.getElementsByClassName("bottom")[0]
var bottombuttons = document.getElementsByClassName("bottom-buttons")[0]
var bottominputs1 = document.getElementsByClassName("bottom-inputs1")[0]
var bottominputs2 = document.getElementsByClassName("bottom-inputs2")[0]
var definitionscontainer = document.getElementsByClassName("definition-container")[0]

var definitionsList = []

chrome.storage.local.get(['userLocal'], async function (result) {
    let user = result.userLocal;
    let term = user.term

    try {
        let defstoAdd = user.definitions[term]
        for (let def of defstoAdd){
            var newdefinition = document.createElement("p")
            newdefinition.setAttribute("class", "definition")
            newdefinition.innerHTML = def
            definitionscontainer.appendChild(newdefinition)
            adding.value = ""

            definitionsList.push(newdefinition)

        }
        setUp()
    } catch{
        setUp()
    }
})

function setUp(){
    chrome.storage.local.get(['userLocal'], async function (result) {
        let userLocal = result.userLocal;
        console.log(userLocal.term)

        if (userLocal.panel == "term") {
            for (let e of document.body.querySelectorAll("*")){
                e.style.animationName = "fadein";
                e.style.animationDuration = "250ms";
            }
        }

        currentTerm.innerHTML = userLocal.term
    });
}

function return_panels(){
    chrome.storage.local.get(['userLocal'], async function (result) {
        var user = result.userLocal;
        user.panel = "set"
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

    console.log("hola")

    return_panels()
    chrome.sidePanel.setOptions({ path: `setpanel/setpanel.html` })
}

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

async function updateDefinitions(def){
    await chrome.storage.local.get(['userLocal'], async function (result) {
        var user = result.userLocal;
        let term = user.term
        console.log(term)
        console.log(def)
        console.log(user.definitions[term])

        try{
            user.definitions[term].push(def)
        } catch{
            user.definitions[term] = [def]
        }

        await chrome.storage.local.set({userLocal: user}, function () {});
    });
}

async function addDefinition(def){
    if(def != "") {
        var newdefinition = document.createElement("p")
        newdefinition.setAttribute("class", "definition")
        newdefinition.innerHTML = def
        definitionscontainer.appendChild(newdefinition)
        adding.value = ""

        await updateDefinitions(def)

        definitionsList.push(newdefinition)
    }
}

adding.addEventListener("keydown", (e) => {
    if(e.key == "Enter") {
        addDefinition(adding.value)
    }
})