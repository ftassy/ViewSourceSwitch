/************************************************************************************/
// Global variables definition
/************************************************************************************/

let vssUrl: string = window.location.search;

let searchParams: any = new URLSearchParams(vssUrl);
let urlToDisplay: string = searchParams.get("url") ? searchParams.get("url") : "vss.html";

let srcToDisplay: string = "";


/************************************************************************************/
// Functions definition
/************************************************************************************/

// Function that sends a message to background.
async function requestSourceCodeToBackground(e: any) {
    var sending = await browser.runtime.sendMessage({
        request: "From view-source.js: source code needed."
    }).then(handleResponse, handleError);
}

// Function called when backgrounds sends back 
// string reprensation of source code.
// Sets the root element innerText. 
function handleResponse(message: any) {
    srcToDisplay = message.response;
    let vssRootElement: HTMLElement | null = document.getElementById("vssRootElement");
    
    vssRootElement !== null ? vssRootElement.innerText = srcToDisplay : console.error("View Source Switch : Root element not found");

    document.title = urlToDisplay;

    //@ts-ignore
    hljs.highlightBlock(vssRootElement);
}

// Function called when backgrounds scannot sends  
// back the string reprensation of source code.
function handleError(error: any) {
    console.error("View Source Switcher: Error while requestinf source code to background...\n" + error);
}

/************************************************************************************/
// Listeners definition
/************************************************************************************/

// Request source code to display
window.addEventListener("load", requestSourceCodeToBackground);
