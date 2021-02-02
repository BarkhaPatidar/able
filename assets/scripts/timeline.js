window.Timeline = function() {
    var timelinePage = {};

    async function createTimelineTemplate() {
        var template;
        var data = "";
        await localforage.getItem("timelineData").then(function (result) {
            data = {
                allPosts : result,
                "convertNum" : function () {
                    return function (text, render) {
                        var num = render(text);
                        return window.NumberFormat().convertNum(num);
                    }
                },
                "convertTime" : function () {
                    return function (text, render) {
                        var vidDate = render(text);
                        return moment(vidDate).fromNow();
                    }
                }
            };
        });
        $.get("./../able/assets/mustache/timeline.mustache", function( ajaxData, status ) {
            template = ajaxData;
            if ( data ) processTimelineTemplate(template, data);
        }); 
        jQuery.ajaxSetup({async:true}); 
    }

    function processTimelineTemplate(template, data) {
        Mustache.parse(template);
        var rendered = Mustache.render(template, data);
        $('#timeline-wrap').html(rendered);
    }


    function likeComShare() {
        $(document).off('click', '.like-com-sh.like');
        $(document).on('click', '.like-com-sh.like', async function() {
            var timelineData = [];
            var likeClass = 'liked';
            var postId = $(this).find('.post-id').text();
            var likeCountElement = '#likes-count-'+postId;
            var heartElement = '#heart-icon-'+postId;
            await localforage.getItem("timelineData").then(async function (result) {
                timelineData = result;
               
                for(var i = 0; i < timelineData.length; i++) {
                    if(timelineData[i].postId == postId) {
                        var likes = $(likeCountElement).text();
                        if($(heartElement).hasClass(likeClass)) {
                            $(heartElement).removeClass(likeClass);
                            var addLike =  parseInt(likes) - 1;
                            $(likeCountElement).text(addLike);
                            timelineData[i].liked = "";
                            timelineData[i].likes = addLike;
                        } else {
                            $(heartElement).addClass(likeClass);
                            var addLike =  parseInt(likes) + 1;
                            $(likeCountElement).text(addLike);
                            timelineData[i].liked = likeClass;
                            timelineData[i].likes = addLike;
                        }
                    }
                }
                await localforage.setItem("timelineData", timelineData).then(async function (data) {
                    createTimelineTemplate();
                    postFormValidation();
                });
            }); 
        });
    }

    function postFormValidation() {
        $(document).on('click', 'button[id^="save-post-btn"]',function() {
            $("#new-post-form").validate({
                errorElement: "span",
                rules : {
                    imageURL : {
                        required : true,
                        url : true
                    },
                    caption : {
                        required : true
                    }
                },
                messages : {
                    imageURL : {
                        required : "Please enter image URL.",
                        url : "Please enter valid URL."
                    },
                    caption : {
                        required : "Please enter caption."
                    },
                },
                submitHandler:function(form)
                {
                    addNewPost();
                    $('#new-post-modal').modal('hide');
                }
            })
        });
    }

    function addNewPost() {
        var timelineData = [];
        var url = $('#imageURL').val();
        var caption = $('#caption').val();
        localforage.getItem("timelineData").then(async function (result) {
            timelineData.push({
                "postId" : Math.floor(Math.random() * 1000),
                "user" : window.sessionStorage.getItem('name'),
                "pic" : url,
                "caption" : caption,
                "time" : new Date(),
                "likes" : 0,
                "comments" : 0,
                "share" : 0,
                "liked" : ""
            });

            result.forEach( prevData => {
                timelineData.push(prevData);
            });
            await localforage.setItem("timelineData", timelineData).then(async function (element) {
                await createTimelineTemplate();
                await window.Profile().userProfileTab();
                await postFormValidation();
                $('#imageURL').val("");
                $('#caption').val("");
            });
        });
    }

    timelinePage.initialize = async function() {
        await createTimelineTemplate();
        await likeComShare();
        await postFormValidation();
    }

    return timelinePage;
}    