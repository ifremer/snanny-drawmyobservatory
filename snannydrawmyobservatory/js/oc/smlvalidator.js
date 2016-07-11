/**
 *
 * Validator for Sml generation
 *
 */
(function () {
    /**
     * @namespace
     */
    SMLValidator = {

        isValid: function (cells) {
            var result = {
                valid: true,
                message: ''
            };

            for (var i in cells) {

                if (cells[i].type != "link") {
                    var startTime = cells[i].custom.startTime;
                    var endTime = cells[i].custom.endTime;
                    if (startTime === undefined) {
                        startTime = "";
                    }
                    if (endTime === undefined) {
                        endTime = "";
                    }
                    result.valid = startTime.length > 0 && endTime.length > 0 || startTime.length === 0 && endTime.length === 0;
                    if (!result.valid) {
                        result.message = 'Both or none of the dates of the period must be filled';
                    }
                    if (startTime.length > 0 && endTime.length > 0) {
                        validTimes(startTime, endTime);
                    }
                }

            }
            return result;

            function validTimes(start, end) {
                var formattedStart = OCA.SMLDateFormat.getFormattedTime(start, true);
                var formattedEnd = OCA.SMLDateFormat.getFormattedTime(end, false);

                var isValid = formattedStart != undefined && formattedEnd != undefined;
                if (isValid) {
                    var startDate = new Date(formattedStart);
                    var endDate = new Date(formattedEnd);
                    isValid = endDate.getTime() > startDate.getTime();
                    if (!isValid) {
                        result.message = 'To date must be after from date';
                    }
                } else {
                    result.message = 'One or both date of the valid period is poorly formatted';
                }
                result.valid = isValid;
            }
        }
    };

    OCA = OCA || {};
    OCA.SMLValidator = SMLValidator;
})(jQuery);