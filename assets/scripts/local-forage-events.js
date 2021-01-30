window.localData = function() {
    var localForageData = {};

    function readyLocalForage() {
        localforage.config({
            name: 'Able App'
        });
        localforage.setDriver(localforage.LOCALSTORAGE);
    }

    function storeInLocal() {
        $.get("./../able/assets/data/friends.json", function( panelData, status ) {
            localforage.setItem("panelData", panelData).then(function (result) {
            });
        });
   
        $.get("./../able/assets/data/user.json", function( aboutData, status ) {
            localforage.setItem("aboutData", aboutData).then(function (result) {
            });
        });
    
        $.get("./../able/assets/data/posts.json", function( timelineData, status ) {
            localforage.setItem("timelineData", timelineData).then(function (result) {
            });
        });
    }

    localForageData.initialize = function() {
        readyLocalForage();
        storeInLocal();
    }

    return localForageData;
}    