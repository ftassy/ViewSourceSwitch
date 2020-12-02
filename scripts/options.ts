/************************************************************************************/
// Global variables definition
/************************************************************************************/

const styles: string[] = [
    "a11y-dark",
    "a11y-light",
    "agate",
    "androidstudio",
    "an-old-hope",
    "arduino-light",
    "arta",
    "ascetic",
    "atelier-cave-dark",
    "atelier-cave-light",
    "atelier-dune-dark",
    "atelier-dune-light",
    "atelier-estuary-dark",
    "atelier-estuary-light",
    "atelier-forest-dark",
    "atelier-forest-light",
    "atelier-heath-dark",
    "atelier-heath-light",
    "atelier-lakeside-dark",
    "atelier-lakeside-light",
    "atelier-plateau-dark",
    "atelier-plateau-light",
    "atelier-savanna-dark",
    "atelier-savanna-light",
    "atelier-seaside-dark",
    "atelier-seaside-light",
    "atelier-sulphurpool-dark",
    "atelier-sulphurpool-light",
    "atom-one-dark",
    "atom-one-dark-reasonable",
    "atom-one-light",
    "brown-paper",
    "codepen-embed",
    "color-brewer",
    "darcula",
    "dark",
    "default",
    "docco",
    "dracula",
    "far",
    "foundation",
    "github",
    "github-gist",
    "gml",
    "googlecode",
    "gradient-dark",
    "gradient-light",
    "grayscale",
    "gruvbox-dark",
    "gruvbox-light",
    "hopscotch",
    "hybrid",
    "idea",
    "ir-black",
    "isbl-editor-dark",
    "isbl-editor-light",
    "kimbie.dark",
    "kimbie.light",
    "lightfair",
    "lioshi",
    "magula",
    "mono-blue",
    "monokai",
    "monokai-sublime",
    "night-owl",
    "nnfx",
    "nnfx-dark",
    "nord",
    "obsidian",
    "ocean",
    "paraiso-dark",
    "paraiso-light",
    "pojoaque",
    "purebasic",
    "qtcreator_dark",
    "qtcreator_light",
    "railscasts",
    "rainbow",
    "routeros",
    "school-book",
    "shades-of-purple",
    "solarized-dark",
    "solarized-light",
    "srcery",
    "stackoverflow-dark",
    "stackoverflow-light",
    "sunburst",
    "tomorrow",
    "tomorrow-night-blue",
    "tomorrow-night-bright",
    "tomorrow-night",
    "tomorrow-night-eighties",
    "vs2015",
    "vs",
    "xcode",
    "xt256",
    "zenburn"
];

const head: any = document.getElementsByTagName("head")[0];

const styleSelect: any = document.getElementById("styleSelector");

const wordWrapYes: any = document.getElementById("yes");
const wordWrapNo: any = document.getElementById("no");

/************************************************************************************/
// Functions definition
/************************************************************************************/

// Function that retrieves current style
async function getPreferredStyle() {
    let getPreferredStyle = await browser.storage.local.get("vssStyle");
    let preferredStyle = getPreferredStyle["vssStyle"];

    if (!preferredStyle) {
        preferredStyle = "default";
    }

    return preferredStyle;
}

// Function that retrieves current word wrap preference
async function getPreferredWordWrap() {
    const getPreferredWordWrap: any = await browser.storage.local.get("vssWordWrap");
    let preferredWordWrap: boolean = getPreferredWordWrap["vssWordWrap"];

    if (!preferredWordWrap) {
        preferredWordWrap = false;
    }

    return preferredWordWrap;
}

// Function that sets the extension preferences
// and pre selections.
async function setOptions() {

    // Set style
    let preferredStyle = await getPreferredStyle();

    for (let i: number = 0; i < styles.length; i++) {
        let styleName: string = styles[i];
        let optionNode: any = document.createElement("OPTION");
        optionNode.value = styleName;
        let optionText: Text = document.createTextNode(styleName);
        optionNode.appendChild(optionText);
        if (preferredStyle === styleName) {
            optionNode.selected="selected";
        }
        styleSelect.appendChild(optionNode);
    }

    // Set word wrap
    let preferredWordWrap: boolean = await getPreferredWordWrap();

    if (preferredWordWrap) {
        if (wordWrapYes !== null) {
            wordWrapYes.setAttribute("checked", "true");
        }
    }

    if (!preferredWordWrap) {
        if (wordWrapNo !== null) {
            wordWrapNo.setAttribute("checked", "true");
        }
    }
}

// Function that writes the style value into
// local storage
async function changeStyle(event: any) {
    browser.storage.local.set({ "vssStyle": styleSelect.value });
    setStylesheet();
}

// Function that writes the word wrap value 
// into local storage
async function changeWordWrap(value: boolean) {
    browser.storage.local.set({ "vssWordWrap": value });
    setWordWrap();
}

// Function that sets word wrap value to yes
function setWordWrapToYes() {
    changeWordWrap(true);
}

// Function that sets word wrap value to no
function setWordWrapToNo() {
    changeWordWrap(false);
}

/************************************************************************************/
// Listeners definition
/************************************************************************************/

// Fill in options values and set the 
// previously selected options
window.addEventListener("load", setOptions);

// Listen to option changes
styleSelect.addEventListener("change", changeStyle);
wordWrapYes.addEventListener("change", setWordWrapToYes);
wordWrapNo.addEventListener("change", setWordWrapToNo);

// Start highlighting the code
//@ts-ignore
hljs.initHighlightingOnLoad();