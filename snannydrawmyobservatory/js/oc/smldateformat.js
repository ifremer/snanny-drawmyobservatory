/**
 *
 * Date format for Sml generation
 *
 */
(function () {
    /**
     * @namespace
     */
    SMLDateFormat = {

        getFormattedTime: function (time, start) {
            var result = undefined;
            if (time != undefined) {
                var dateComplement = undefined;
                if (time.match(/^[\d]{4}$/)) {
                    if (start) {
                        dateComplement = '-01-01T00:00:00Z';
                    } else {
                        dateComplement = '-12-31T00:00:00Z';
                    }
                    result = time + dateComplement;
                } else if (time.match(/^[\d]{4}-[\d]{2}-[\d]{2}$/)) {
                    dateComplement = 'T00:00:00Z';
                    result = time + dateComplement;
                } else if (time.match(/^[\d]{4}-[\d]{2}-[\d]{2}T[\d]{2}:[\d]{2}:[\d]{2}[Z]{0,1}$/)) {
                    dateComplement = time.indexOf('Z', time.length - 1) !== -1 ? "" : "Z";
                    result = time + dateComplement;
                } else if (time.match(/^[\d]{4}-[\d]{2}-[\d]{2} [\d]{2}:[\d]{2}:[\d]{2}\.[\d]{1}$/)) {
                    result = time.replace(/([\d]{4}-[\d]{2}-[\d]{2}) ([\d]{2}:[\d]{2}:[\d]{2})\.[\d]{1}/, "$1T$2Z");
                }
            }
            return result;
        }

    };

    OCA = OCA || {};
    OCA.SMLDateFormat = SMLDateFormat;
})(jQuery);