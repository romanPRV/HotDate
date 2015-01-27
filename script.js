(function() {
    'use strict';

    $('#signup, #list, #show-full').hide();

    $('body').on('click', '#signinSecondary, #signupTop', function() {
        $('#signupTop, #loginTop, #listTop').parent().removeAttr('class');
        $('#signupTop').parent().addClass('active');
        $('#login, #list, #show-full').hide();
        $('#signup').show();
    }).on('click', '#signupSecondary, #loginTop', function() {
        $('#signupTop, #loginTop, #listTop').parent().removeAttr('class');
        $('#loginTop').parent().addClass('active');
        $('#signup, #list, #show-full').hide();
        $('#login').show();
    }).on('click', '#listTop', function() {
        $('#signupTop, #loginTop, #listTop').parent().removeAttr('class');
        $('#listTop').parent().addClass('active');
        $('#login, #signup, #show-full').hide();
        $('#list').show();
    }).on('click', '#signupSubmit', function(event) {
        event.preventDefault();
        $('<img src="ajax-loader.gif" alt="AJAX loader animation" class="centered-img">' +
        '<div class="centered-div"></div>').appendTo('body');
        $.post('http://api.sudodoki.name:8888/signup',
            {data: {login: $('#signupLogin').val(),
                password: $('#signupPassword').val(),
                passwordConfirmation: $('#signupPasswordConfirmation').val()}
            }).done(function(response) {
                $('form').trigger('reset');
                $('#login, #signup, #show-full').hide();
                $('#list').show();
                if ($('small').length) {
                    $('small').remove();
                    $('.error').toggleClass('error');
                }
                showList($.parseJSON(response).token);
            }).fail(function(response) {
                if ($('small').length) {
                    $('small').remove();
                    $('.error').toggleClass('error');
                }
                var template = Handlebars.compile($('#error-template').html());
                var errorArr = $.parseJSON(response.responseText);
                errorArr.errors.forEach(function(obj) {
                    if (obj.password !== undefined) {
                        $('#signupPassword').toggleClass('error')
                            .after(template({error: obj.password}));
                    } else if (obj.passwordConfirmation !== undefined) {
                        $('#signupPasswordConfirmation').toggleClass('error')
                            .after(template({error: obj.passwordConfirmation}));
                    } else if (obj.login !== undefined) {
                        $('#signupLogin').toggleClass('error')
                            .after(template({error: obj.login}));
                    }
                });
                $('.centered-img, .centered-div').detach();
            });
    }).on('click', '#signinSubmit', function(event) {
        event.preventDefault();
        $('<img src="ajax-loader.gif" alt="AJAX loader animation" class="centered-img">' +
        '<div class="centered-div"></div>').appendTo('body');
        $.post('http://api.sudodoki.name:8888/login',
            {data: {login: $('#signinLogin').val(),
                password: $('#signinPassword').val()}
            }).done(function(response) {
                $('form').trigger('reset');
                $('#login, #signup, #show-full').hide();
                $('#list').show();
                if ($('small').length) {
                    $('small').remove();
                    $('.error').toggleClass('error');
                }
                showList($.parseJSON(response).token);
            }).fail(function(response) {
                if ($('small').length) {
                    $('small').remove();
                    $('.error').toggleClass('error');
                }
                var template = Handlebars.compile($('#error-template').html());
                $('#signinLogin').toggleClass('error')
                    .after(template($.parseJSON(response.responseText)));
                $('.centered-img, .centered-div').detach();
            });
    });

    function showList(token) {
        $('#signupTop').parent().after('<li><a id="listTop" href="#list">List my dates!</a></li>' +
                                        '<li><a href="">Logout</a></li>');
        $.get('http://api.sudodoki.name:8888/users', function(data) {
            var template = Handlebars.compile($('#entry-template').html());
            var html = '';
            data.forEach(function(subj) {
                html += template(subj);
            });
            $('.small-block-grid-3').html(html);
            $('#signupTop, #loginTop, #listTop').parent().removeAttr('class');
            $('#listTop').parent().addClass('active');
        });
        $('.centered-img, .centered-div').detach();
        $('body').on('click', '.url', function(event) {
            event.preventDefault();
            $('<img src="ajax-loader.gif" alt="AJAX loader animation" class="centered-img">' +
            '<div class="centered-div"></div>').appendTo('body');
            $('#login, #signup, #list').hide();
            $('#show-full').show();
            $.ajax({
                type: 'GET',
                beforeSend: function(request)
                {
                    request.setRequestHeader('SECRET-TOKEN', token);
                },
                url: 'http://api.sudodoki.name:8888/user/' + $(this).attr('id')
            }).done(function(data) {
                if ($('#show-full-block').length)  $('#show-full-block').remove();
                var template = Handlebars.compile($('#show-full-template').html());
                $('#show-full').html(template($.parseJSON(data)[0]));
                $('.centered-img, .centered-div').detach();
            });
        });
    }
})();