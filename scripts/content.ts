/************************************************************************************/
// Global variables definition
/************************************************************************************/

let currentPageUrl: string = window.location.href;
let currentPageSource: string = "";

/************************************************************************************/
// Functions definition
/************************************************************************************/

// Function that copy the current page soruce 
// into the currentPageSource global variable.
function setPageSource() {
    const htmlElement = document.getElementsByTagName("html");
    currentPageSource = new XMLSerializer().serializeToString(document);
}

/************************************************************************************/
// Listeners definition
/************************************************************************************/

browser.runtime.onMessage.addListener((request: any) => {
    console.log(request.request);
    setPageSource();
    return Promise.resolve({ response: currentPageSource });
});

