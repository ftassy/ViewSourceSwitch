/************************************************************************************/
// Global variables definition
/************************************************************************************/

// @ts-ignore
let browser = browser;

let currentUrl: string = '';
let currentId: number = 0;
let currentSource: string;

const prefix: string = "view-source:";

/************************************************************************************/
// Functions definition
/************************************************************************************/

// Function tied to the browser action button.
// Retrieve URL and tab id of the active tab
// Add or remove a "view-source:" prefix to
// this URL.
async function switchUrl() {

    let currentTab: any;
    let newUrl: string = "";
    let goToVSS: boolean = false;

    try {
        let tabs: any = await browser.tabs.query({ currentWindow: true, active: true });
        currentTab = tabs[0];
        currentUrl = currentTab.url;
        currentId = currentTab.id;

        // Tab is already in "view-source" mode -> Go back to regular view
        if (currentUrl.startsWith(prefix)) {
            newUrl = currentUrl.replace(prefix, '');
        }
        // Tab is already in "VSS" mode -> Go back to regular view
        else if (currentUrl.startsWith("moz-extension://") && currentUrl.indexOf("vss.html") > -1) {
            const parsedUrl: URL = new URL(currentUrl);
            const originUrl: string | null = parsedUrl.searchParams.get("url");
            originUrl ? newUrl = originUrl : newUrl = currentUrl;
        }
        // Page will go to VSS mode
        else {
            newUrl = "vss.html?url=" + currentUrl;
            goToVSS = true;
        }
    } catch (err) {
        console.error("View Source Switch: Could not retrieve the current tab...\n", err);
    }

    try {
        if (goToVSS) {
            await requestSourceCodeToTabs(currentId);
        }

        await browser.tabs.update(currentId, { active: true, url: newUrl });
    } catch (err) {
        console.error("View Source Switch: Could not update the current tab to " + newUrl + "\n", err);
    } finally {
        setCurrentUrlAndIcon();
    }
}

// Function that update the currentUrl global
// variable and set the browser action button
// accordingly.
async function setCurrentUrlAndIcon() {
    try {
        let tabs = await browser.tabs.query({ currentWindow: true, active: true });
        let currentTab = await tabs[0];
        currentUrl = await currentTab.url;
        currentId = await currentTab.id;
    } catch (err) {
        console.error("View Source Switch: Could not retrieve the current tab...\n", err);
    } finally {
        setBrowserIcon(currentUrl);
    }
}

// Function that set browser action button
// icon depending on the URL in paramater.
function setBrowserIcon(url: string) {
    if (url.startsWith(prefix) || (url.startsWith("moz-extension://") && url.indexOf("vss.html") > -1)) {
        browser.browserAction.setIcon({ path: "icons/icon_on.svg" });
    } else {
        browser.browserAction.setIcon({ path: "icons/icon.svg" });
    }
}

// Function called back when a tab is updated
function handleUpdated(tabId: number, changeInfo: any, tabInfo: any) {
    if (changeInfo.url) {
        setBrowserIcon(changeInfo.url);
    }
}

// Function that request the source code of a 
// tab given as parameter.
// Updates the value of global variable 
// currentSource.
function requestSourceCodeToTabs(tabs: any) {
    console.log("Requesting source code of tab", currentId);
    browser.tabs.sendMessage(
        tabs,
        { request: "From background.js: source code needed." }
    ).then((response: any) => {
        currentSource = response.response;
    }).catch(onRequestError);
}

// Function called back if a tab did not send 
// back a response.
function onRequestError(error: any) {
    console.error("View Source Switch error in 'requestSourceCodeToTabs' function :\n", error);
}

// Function called when background script  
// receives a message from a tab.
// Sends the content of currentSource to 
// the requesting tab.
function handleVSSMessage(request: any, sender: any, sendResponse: any) {
    sendResponse({ response: currentSource });
}

/************************************************************************************/
// Listeners definition
/************************************************************************************/

browser.tabs.onActivated.addListener(setCurrentUrlAndIcon);
browser.tabs.onUpdated.addListener(handleUpdated);
browser.browserAction.onClicked.addListener(switchUrl);
browser.runtime.onMessage.addListener(handleVSSMessage);
