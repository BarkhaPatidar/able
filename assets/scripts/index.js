$(function() {
    readyLocalForage();
    createNavbarTemplate();
    createPostModalTemplate();
    checkSession();
    logEvents();
    timelineMenu();

    function readyLocalForage() {
        localforage.config({
            name: 'Able App'
        });
        localforage.setDriver(localforage.LOCALSTORAGE);
    }

    async function checkSession() {
        await localforage.getItem("isLogin").then(function (result) {
            var stateObject = {};
            if(result) {
                window.Profile().initialize();
                browserPage = '/able/Timeline';
                stateObject = {
                    page : "Timeline"
                };
            } else {
                window.login().initialize();
                window.localData().initialize();
                logEvents();
                loginFormValidation();
                browserPage = '/able/Login';
                stateObject = {
                    page : "Login"
                };
            }
            window.history.pushState(stateObject, null, browserPage);
        });
    }

    function logEvents() {
        $('#login-error').html("");
        logout();
    }

    async function login() {
        var result = await window.login().checkLogin();
        var loginError = '#login-error';
        if(result == false) {
            $(loginError).show();
            $(loginError).text('Your email or password is incorrect.');
            fadeErrorBox();
        } else {
            $('#main-container').html("");
            window.Profile().initialize();
            browserPage = '/able/Timeline';
            var stateObject = {
                page : "Timeline"
            };
            window.history.pushState(stateObject, null, browserPage);
        }
       
    }

    function logout() {
        $(document).on('click', '#logout-btn', async function() {
            await localforage.removeItem('isLogin').then(function() {
                checkSession();
            })
        })
    }

    function loginFormValidation() {
        $(document).on('click', '#login-btn',function() {
            $("#login-form").validate({
                errorElement: "span",
                rules : {
                    email : {
                        required : true,
                        email : true
                    },
                    password : {
                        required : true
                    }
                },
                messages : {
                    email : {
                        required : "Please enter your email.",
                        email : "Please enter valid email."
                    },
                    password : {
                        required : "Please enter your password."
                    },
                },
                submitHandler:function(form)
                {
                    login();
                }
            })
        });
    }

    function fadeErrorBox() {
        $(".error-msg").fadeOut(5000);
    }

    function createNavbarTemplate() {
        var template;
        var data = "";
        $.get("./../able/assets/mustache/navbar-menu.mustache", function( ajaxData, status ) {
            template = ajaxData;
            processTemplate(template, data);
        }); 
    }

    function processTemplate(template, data) {
        Mustache.parse(template);
        var rendered = Mustache.render(template, data);
        $('#navbar-menu').html(rendered);
    }

    function createPostModalTemplate() {
        var template;
        var data = "";
        $.get("./../able/assets/mustache/add-post.mustache", function( ajaxData, status ) {
            template = ajaxData;
            processModalTemplate(template, data);
        }); 
    }

    function processModalTemplate(template, data) {
        Mustache.parse(template);
        var rendered = Mustache.render(template, data);
        $('#new-post-modal').html(rendered);
    }

    function timelineMenu() {
        $(document).on('click', '.timeline-bar li', function() {
            var activeElement = '.timeline-bar li.active';
            var active = 'active';
            $(activeElement).removeClass(active); 
            $(this).addClass(active);
            var activeValue = $(activeElement+' a').text();
            switchActiveMenu(activeValue);
            browserPage = '/able/'+activeValue;
            var stateObject = {
                page : activeValue
            };
            window.history.pushState(stateObject, null, browserPage);
        });
    }

    function switchActiveMenu(activeValue) {
        switch(activeValue) {
            case "Timeline" :
                window.Timeline().initialize();
              break;
            case "About" :
                window.About().initialize();
              break;
            case "Photos" :
                window.Photos().initialize();
              break;  
            case "Friends" :
                window.Friends().initialize();
              break;  
        }
    }

    window.addEventListener('popstate', function(event) {
        var state = event.state;
        if(state) { 
            var page = state.page;
            if(page == "Login") {
                window.Timeline().initialize();
                browserPage = '/able/Timeline';
                var stateObject = {
                    page : "Timeline"
                };
                window.history.pushState(stateObject, null, browserPage);
            } else {
                switchActiveMenu(page);
            }
            $('.timeline-bar li').each(function(index) {
                var activeElement = '.timeline-bar li.active';
                var active = 'active';
                var activeValue = $(this).find('a').text();
                if(activeValue == page) {
                    $(activeElement).removeClass(active);
                    $(this).addClass(active);
                }
            });
        }
    });
});
