﻿(function () {
    "use strict";

    var isPrintTaskRequestedHandled = false;
    var printManager = Windows.Graphics.Printing.PrintManager;

    WinJS.UI.Pages.define("/demos/print/toggle/toggle.html", {
        ready: function (element, options) {
            q("#togglePrint").onclick = togglePrint;
        
            updatePrintDisplay() 
        }
    });

    function updatePrintDisplay() {
        q("#printStatus").innerText = isPrintTaskRequestedHandled ? "Registered" : "Unregistered";
    }

    function togglePrint() {
        var printer = printManager.getForCurrentView();
        isPrintTaskRequestedHandled = !isPrintTaskRequestedHandled;
        if (isPrintTaskRequestedHandled) {
            printer.onprinttaskrequested = printDoc;
        } else {
            printer.onprinttaskrequested = null;
        }
        updatePrintDisplay();
    }

    function invokePrint() {
        var printer = printManager.getForCurrentView();
        printer.onprinttaskrequested = printFrag;
        isPrintTaskRequestedHandled = true;
        updatePrintDisplay();
        printManager.showPrintUIAsync();
    }

    function printWithOptions() {
        var printer = printManager.getForCurrentView();
        printer.onprinttaskrequested = printFragWithOptions;
        isPrintTaskRequestedHandled = true;
        updatePrintDisplay();
        printManager.showPrintUIAsync();
    }

    function printDoc(printEvent) {
        var printTask = printEvent.request.createPrintTask("codeShow Print Doc", function (args) {
            args.setSource(MSApp.getHtmlPrintDocumentSource(document));
            // Register the handler for print task completion event
            printTask.oncompleted = printTaskCompleted;
        });
    }

    function printFrag(printEvent) {
        var printTask = printEvent.request.createPrintTask("codeShow Print Frag", function (args) {
            var frag = document.createDocumentFragment();
            frag.appendChild(q(".print #printFromApp").cloneNode(true));
            args.setSource(MSApp.getHtmlPrintDocumentSource(frag));
            // Register the handler for print task completion event
            printTask.oncompleted = printTaskCompleted;
        });
    }

    function printFragWithOptions(printEvent) {
        var printTask = printEvent.request.createPrintTask("codeShow Print Options", function (args) {
            var frag = document.createDocumentFragment();
            var customHeader = document.createElement("h1");
            customHeader.innerText = "CUSTOM PRINTING";
            var customContent = document.createElement("p");
            customContent.innerText = "Blah blah blah blah blah blah blah blah blah blah";
            frag.appendChild(customHeader);
            frag.appendChild(customContent);
            frag.appendChild(customContent.cloneNode(true));
            frag.appendChild(customContent.cloneNode(true));
            frag.appendChild(customContent.cloneNode(true));
            frag.appendChild(customContent.cloneNode(true));
            frag.appendChild(customContent.cloneNode(true));
            frag.appendChild(customContent.cloneNode(true));
            args.setSource(MSApp.getHtmlPrintDocumentSource(frag));
            printTask.options.displayedOptions.clear();
            // printTask.options.displayedOptions.append(Windows.Graphics.Printing.StandardPrintTaskOptions.copies);
            printTask.options.orientation = Windows.Graphics.Printing.PrintOrientation.landscape;
            // Register the handler for print task completion event
            printTask.oncompleted = printTaskCompleted;
        });
    }


    function printTaskCompleted(printEvent) {
        // Notify the user about the failure
        if (printEvent.completion === Windows.Graphics.Printing.PrintTaskCompletion.failed) {
            WinJS.log && WinJS.log("Failed to print.", "sample", "error");
        }
    }
})();
