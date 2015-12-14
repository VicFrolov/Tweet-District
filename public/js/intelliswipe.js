(function ($) {
    var deleteLi = function (element) {
        $(element).remove();
    }
    var highlight = function (element) {
        $(element).css('background-color', 'yellow');
    }

    var consolePrint = function (value) {
        $("#console").append(value);
    }

    var trackSlide = function (event) {
        $.each(event.changedTouches, function (index, touch) {
            var target = touch.target;
            while (!$(target).is("li")) {
                target = $(target).parent()[0];
            }
            if (target.movingBox) {
                target.movingBox.offset({
                    left: touch.pageX - target.deltaX
                });
                target.lastOffSetX = touch.pageX - target.deltaX
            }
        });
        event.preventDefault();
    }

    var endSlide = function (event) {
        $.each(event.changedTouches, function (index, touch) {
            var target = touch.target;
            while (!$(target).is("li")) {
                target = $(target).parent()[0]
            }
            var startingPos = target.startingPosition;
            var lastPos = target.lastOffSetX;
            var LEFT_BUTTON_WIDTH = $(".left-button").width();
            var RIGHT_BUTTON_WIDTH = $(".left-button").width();
            var smallDrag = Math.abs((lastPos - startingPos)) < 100;
            var leftPos = lastPos;

            if (target.movingBox) {
                if (smallDrag) {
                    leftPos = startingPos;
                } else {
                    if (startingPos < lastPos) {
                        leftPos = startingPos + LEFT_BUTTON_WIDTH;
                    } else if (startingPos > lastPos) {
                        leftPos = startingPos - RIGHT_BUTTON_WIDTH;
                    }
                    target.stackedOut = true;
                }
            }
            target.movingBox.offset({
                left: leftPos
            });            
            target.movingBox = null;
        });
    } 

    var startMove = function (event) {
        offset = $("#list-container").offset();
        $.each(event.changedTouches, function (index, touch) {
            var target = touch.target;
            while (!$(target).is("li")) {
                target = $(target).parent()[0]
            }
            var jThis = $(target),
                startOffset = jThis.offset();
            target.startingPosition = offset.left - $(".left-button").width();
            target.movingBox = jThis;
            target.stackedOut = false;
            target.deltaX = touch.pageX - startOffset.left;
        });
        event.stopPropagation();
    }

    var appendRightButton = function (element) {
        var listItem = $(element);
        listItem.prepend("<div class='right-button'> </div> ");
        var rightButton = listItem.find(".right-button");  
        rightFunction(rightButton, listItem);              
    }

    var appendLeftButton = function (element) {
        var listItem = $(element);
        listItem.prepend("<div class='left-button'> </div> ");
        var leftButton = listItem.find(".left-button");  
        leftFunction(leftButton, listItem);     
    }   


    var rightFunction;
    var leftFunction;

    var deleteButton = function (buttonSide, listItem) {
        buttonSide.click(function () {
            deleteLi(listItem);
        });
        $(".right-button").text("TAP TO DELETE");
    }

    var highlightButton = function (buttonSide, listItem) {
        buttonSide.click(function () {
            highlight(listItem);
        });
        $(".left-button").text("Highlight Me(forever)");
    }

    var saveButton = function () {
        //To be implemented
    }

    $.fn.intelliswipe = function (options) {
        var def = {
            'right-function': deleteButton
            ,'left-function': highlightButton
        };

        jQuery.extend(options, def);
        rightFunction = def['right-function'];
        leftFunction = def['left-function'];
        var ulItems = $(this).children();

        ulItems.each(function (index, element) {
            $(element).width($("#list-container").width() + 300);
            appendRightButton(element);
            appendLeftButton(element);       
            element.addEventListener("touchstart", startMove, false);
            element.addEventListener("touchmove", trackSlide, false);
            element.addEventListener("touchend", endSlide, false);

        });
        $('#list-container').scrollLeft($(".left-button").width());   
    };
}(jQuery));