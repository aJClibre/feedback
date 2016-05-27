/************************************************
http://stackoverflow.com/questions/898463/fire-event-each-time-a-dropdownlist-item-is-selected-with-jquery
Function usefull to know the value selected on a
dropdown list when the user clic on it.
Used like this : 
$("#dropdownid").selected(function (e) {
    alert('You selected ' + $(e).val());
});
************************************************/

(function ($) {
    $.fn.selected = function (fn) {
        return this.each(function () {
            $(this).focus(function () {
                this.dataChanged = false;
            }).change(function () {
                this.dataChanged = true;
                fn(this);
            }).blur(function (e) {
                if (!this.dataChanged) {
                    fn(this);
                }
            });
        });
    };
})(jQuery);
