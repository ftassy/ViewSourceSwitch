// @ts-ignore
let browser = browser;

// @ts-ignore
let tabs = tabs;

let currentUrl: string = '';

const prefix: string = "view-source:";

async function switchUrl() {

    // @ts-ignore
    let currentTab;
    // let currentUrl: string = ''; TODO remove
    let currentId: number = 0;
    let newUrl: string = "about:newtab";

    try {
        let tabs = await browser.tabs.query({ currentWindow: true, active: true });

        currentTab = tabs[0];
        currentUrl = currentTab.url;
        currentId = currentTab.id;

        if (currentUrl.startsWith(prefix)) {
            newUrl = currentUrl.replace(prefix, '');
        } else {
            newUrl = prefix + currentUrl;
        }
    } catch (err) {
        console.log("View Source Switcher: Could not retrieve the current tab...\n", err);
    }

    try {
        await browser.tabs.update(currentId, { active: true, url: newUrl });
    } catch (err) {
        console.log("View Source Switcher: Could not update the current tab to " + newUrl + "\n", err);
    }

    if (newUrl.startsWith(prefix)) {
        browser.browserAction.setIcon({ path: "icons/icon_on.svg" });
    } else {
        browser.browserAction.setIcon({ path: "icons/icon.svg" });
    }

}

browser.browserAction.onClicked.addListener(switchUrl);


function setBrowserIcon(url: string) {

    if (url.startsWith(prefix)) {
        browser.browserAction.setIcon({ path: "icons/icon_on.svg" });
    } else {
        browser.browserAction.setIcon({ path: "icons/icon.svg" });
    }

}

function handleUpdated(tabId: number, changeInfo: any, tabInfo: any) {
    if (changeInfo.url) {
        console.log("Tab: " + tabId +
            " URL changed to " + changeInfo.url);
        setBrowserIcon(changeInfo.url);
    }
}

browser.tabs.onUpdated.addListener(handleUpdated);

async function setCurrentUrlAndIcon() {

    try {
        let tabs = await browser.tabs.query({ currentWindow: true, active: true });

        let currentTab = await tabs[0];
        currentUrl = await currentTab.url;

        console.log(currentUrl);
    } catch (err) {
        console.log("View Source Switcher: Could not retrieve the current tab...\n", err);
    }

    if (currentUrl.startsWith(prefix)) {
        browser.browserAction.setIcon({ path: "icons/icon_on.svg" });
    } else {
        browser.browserAction.setIcon({ path: "icons/icon.svg" });
    }

}

browser.tabs.onActivated.addListener(setCurrentUrlAndIcon);