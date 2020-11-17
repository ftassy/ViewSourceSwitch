/************************************************************************************/
// Global variables definition
/************************************************************************************/

// @ts-ignore
let browser = browser;

// @ts-ignore
let tabs = tabs;

let currentUrl: string = '';

const prefix: string = "view-source:";

/************************************************************************************/
// Functions definition
/************************************************************************************/

// Function tied to the browser action button.
// Retrieve URL and tab id of the active tab
// Add or remove a "view-source:" prefix to
// this URL.
async function switchUrl() {

    // @ts-ignore
    let currentTab;
    let currentId: number = 0;
    let newUrl: string = "";

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
    } finally {
        setCurrentUrlAndIcon();
    }
}

// Function that set browser action button
// icon depending on the URL in paramater.
function setBrowserIcon(url: string) {
    if (url.startsWith(prefix)) {
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

// Function that update the currentUrl global
// variable and set the browser action button
// accordingly.
async function setCurrentUrlAndIcon() {
    try {
        let tabs = await browser.tabs.query({ currentWindow: true, active: true });
        let currentTab = await tabs[0];
        currentUrl = await currentTab.url;
    } catch (err) {
        console.log("View Source Switcher: Could not retrieve the current tab...\n", err);
    }

    setBrowserIcon(currentUrl);
}

/************************************************************************************/
// Listeners definition
/************************************************************************************/

browser.tabs.onActivated.addListener(setCurrentUrlAndIcon);
browser.tabs.onUpdated.addListener(handleUpdated);
browser.browserAction.onClicked.addListener(switchUrl);