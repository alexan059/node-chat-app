import jQuery from 'jquery';

(function($) {
    $.hexEncode = $.hexEncode || function(str) {
            if (!str) {
                return false;
            }

            let hex = [];

            for (let i = 0; i < str.length; i++) {
                hex.push(str.charCodeAt(i).toString(16));
            }

            return hex.join('');
        };
})(jQuery);