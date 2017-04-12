$(function() {
    'use strict'; // Start of use strict

    var main_container = $('#main-container');
    var canvas = $("#canvas");

    // FIXME: Sync cannon barrel and cannon ball initial starting point

    var cannon = $('<img/>', { class: 'cannon', src: "../../assets/img/simple_cannon.png" }).appendTo(main_container);
    cannon.css({ 'transform-origin': 'left' });
    cannon.css({ 'transform': 'rotate(-45deg)' });
    cannon.css({
        'position': 'absolute',
        'left': '0',
        'top': ($(window).height() - cannon.width())
    });
    cannon.show();

    var target = $('<img/>', { class: 'target', src: "../../assets/img/target1.png" }).appendTo(main_container);
    target.velocity({ top: random_top_str(), left: random_left_str() }, { duration: 2000, loop: true })

    var center_x = 0;
    var center_y = 0;
    var v_0 = 200; // arbitrary initial velocity
    var theta = 0; // radians
    var degrees = 0;
    var gravity = 9.81;
    var score = 0;
    var target_is_hit = false;

    function random_number(end) {
        return Math.floor((Math.random() * end));
    }

    function random_left_str() {
        return random_number($(window).width()) + "px";
    }

    function random_top_str() {
        return random_number($(window).height()) + "px";
    }

    function fire_cannon(fire_event) {
        var event_x = fire_event.pageX;
        var event_y = $(window).height() - fire_event.pageY;
        var radians = Math.atan2(event_y, event_x);
        var time = 0;
        var v_x0 = v_0 * Math.cos(radians);
        var v_y0 = v_0 * Math.sin(radians);
        var x = 0;
        var y = $(window).height();

        $('#cannon-sound')[0].play();

        var cannon_ball = $('<img/>', { class: 'cannon-ball', src: "../../assets/img/cannon_ball.png" }).appendTo(main_container);
        cannon_ball.velocity({
            fontSize: 0
        }, {
            duration: 2000,
            easing: "swing",
            progress: function() {
                time = time + .15;
                x = (v_x0 * time);
                y = (((v_y0 * time)) - (.5 * gravity * (Math.pow(time, 2))));
                // Forgive the magic number for the offset
                $(this).css({ left: x - 100, top: $(window).height() - y });
                var hit_target = $(this).collision('.target');
                if (hit_target.length > 0 && !target_is_hit) {
                    $('#boop-sound')[0].play();
                    target_is_hit = true;
                    ++score;
                    $('.score').text(score);
                    hit_target.velocity('stop')
                        .velocity({ rotateX: '360deg' })
                        .velocity("fadeOut");
                }

            },
            complete: function() {
                if (target_is_hit) {
                    $('.target').remove();
                    var target = $('<img/>', { class: 'target', src: "../../assets/img/target1.png" }).appendTo(main_container);
                    target.css({
                        'left': random_left_str(),
                        'top': random_top_str(),
                    });
                    target.velocity({ top: random_top_str(), left: random_left_str() }, { duration: 2000, loop: true })
                    target_is_hit = false;
                }
                $(this).remove();
            }
        });
    }

    // returns theta in radians
    function calculate_theta(event) {
        var cannon_offset = cannon.offset();
        center_x = (cannon_offset.left) + (cannon.width() / 2);
        center_y = (cannon_offset.top) + (cannon.height() / 2);
        var event_x = event.pageX;
        var event_y = event.pageY;
        return Math.atan2(event_y - center_y, event_x - center_x);
    }

    function rotate_cannon(degrees) {
        cannon.css({ 'transform': 'rotate(' + degrees + 'deg)' });
    }


    function mousemoved(event) {
        var radians = calculate_theta(event);
        var degree = (radians * (180 / Math.PI));
        degrees = degree;
        rotate_cannon(degree);
        theta = radians;
    }


    // disables scrolling by arrow keys and page up/down keys
    // TODO: comment this section out when debugging cannon balls
    // TODO: also comment out body & html sections in main.sass (lines 4-9)
    $(window).keydown(function(e) {
        if ([32, 33, 34, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
            e.preventDefault();
        }
    }, false);

    $(document).click(fire_cannon);
    $(document).mousemove(mousemoved);
}); // end of document ready