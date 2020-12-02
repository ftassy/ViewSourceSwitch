

/************************************************************************************/
// Functions definition
/************************************************************************************/

// Function that removes the current style sheet
// and set the new one. Called on page load and
// on preference changes.
async function setStylesheet() {
    const getPreferredStyle = await browser.storage.local.get("vssStyle");
    let preferredStyle: string = getPreferredStyle["vssStyle"];
    if (!preferredStyle) {
        preferredStyle = "default";
    }
    const stylesheetPath = "highlightjs/styles/" + preferredStyle + ".css";

    // Create new stylesheet node
    const head: any = document.getElementsByTagName("head")[0];

    let linkNode: any = document.createElement("LINK");
    linkNode.rel = "stylesheet";
    linkNode.href = stylesheetPath;

    // Remove current stylesheets
    const link:any = document.getElementById("vssStylesheet");
    if (link) {
        link.remove();
    }

    // Add the new stylesheet
    linkNode.id = "vssStylesheet";
    head.appendChild(linkNode);

    console.log("View Source Switch tab", window.location.href, "\nInserting CSS", stylesheetPath);
}

// Function that removes the current word wrap 
// CSS rule and set the new one. Called on page 
// load and on preference changes.
async function setWordWrap() {
    const getPreferredWordWrap: any = await browser.storage.local.get("vssWordWrap");
    const preferredWordWrap: boolean = getPreferredWordWrap["vssWordWrap"];

    if (!preferredWordWrap) {
        const wordWrap:any = document.getElementById("vssWordWrap");
        if (wordWrap !== null) {
            wordWrap.remove();
        }
    }

    if (preferredWordWrap) {
        let styleNode: any = document.createElement("STYLE");
        styleNode.id = "vssWordWrap";

        const style: string = "pre { white-space: pre-wrap; word-wrap: break-word; }";
        styleNode.innerText = style;

        const head: any = document.getElementsByTagName("head")[0];
        head.appendChild(styleNode);

        console.log(head);
    }

    console.log("View Source Switch tab", window.location.href, "- updating word wrap.");
}

/************************************************************************************/
// Listeners definition
/************************************************************************************/

// Sets the CSS as per preferences
window.addEventListener("load", setStylesheet);
window.addEventListener("load", setWordWrap);

// Listen to the preference changes
browser.storage.onChanged.addListener(setStylesheet);
browser.storage.onChanged.addListener(setWordWrap);