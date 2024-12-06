chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch((error) => console.error(error));

chrome.storage.local.get(['userLocal'], async function () {
    var user = {
        set: "",
        sets: [],
        flashcards: {},
        definitions: {},
        term: "",
        panel: "main"
    }
    await chrome.storage.local.set({userLocal: user}, function () {});
})