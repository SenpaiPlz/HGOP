import inject from "common/framework/inject";

window.console.debug=window.console.log;

window.iit = function(testName, tf){
    console.log("Ignoring test <" + testName + ">")
}; // Use to ignore tests

window.inject = inject;