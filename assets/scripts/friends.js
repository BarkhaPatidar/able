window.Friends = function() {
    var friendsPage = {};
    const followValue = "Follow";
    const following = "Following";
    const unfollowValue = "Unfollow";
    const unfollowing = "Unfollowing";
    async function createFriendsTemplate() {
        var template;
        var data = "";
        await localforage.getItem("panelData").then(function (result) {
            data = {
                friends : result.friends,
                "checkStatus": function () {
                    return function (text, render) {
                        var status = render(text);
                        if(status == following) {
                            return unfollowValue;
                        } else {
                            return followValue;
                        }
                    }
                }
            };
        });
        $.get("./../able/assets/mustache/friends.mustache", async function( ajaxData, status ) {
            template = ajaxData;
            if ( data ) await processTemplate(template, data);
        }); 
    }

    function processTemplate(template, data) {
        Mustache.parse(template);
        var rendered = Mustache.render(template, data);
        $('#timeline-wrap').html(rendered);
    }

    function unfollow() {
        $(document).on('click', '.unfollow-frnd', async function() {
            var statusValue = $(this).val();
            var userId = $(this).next().text();
            var panelData = [];
            await localforage.getItem("panelData").then(async function (result) {
                panelData = result;
                for(var i = 0; i < panelData.friends.length; i++) {
                    if(panelData.friends[i].userId == userId) {
                        
                        if(statusValue == followValue) {
                            var status = following;
                        } else {
                            var status = unfollowing;
                        }
                        panelData.friends[i].friendStatus = status;
                    }
                }
                await localforage.setItem("panelData", panelData).then(async function (data) {
                    await createFriendsTemplate();
                    await window.Profile().userProfileTab();
                    await unfollow();
                });
            });
        })
    }

    friendsPage.initialize = function() {
        createFriendsTemplate();
        unfollow();
    }

    return friendsPage;
}    