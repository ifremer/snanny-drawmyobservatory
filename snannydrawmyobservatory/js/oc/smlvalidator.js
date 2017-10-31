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
                var cell = cells[i];
                if (cell.type != "link") {
                    var currentMessage = '';
                    var name = cell.attrs.text.name;
                    if(name === undefined) {
                        name = cell.attrs.text.text;
                    }
                    //Checking start / end date
                    var startTime = cell.custom.startTime;
                    var endTime = cell.custom.endTime;
                    if (startTime === undefined) {
                        startTime = "";
                    }
                    if (endTime === undefined) {
                        endTime = "";
                    }
                    var isValid = startTime.length > 0 && endTime.length > 0 || startTime.length === 0 && endTime.length === 0;
                    if (!isValid) {
                        currentMessage += 'Both or none of the dates of the period must be filled\n';
                    }
                    if (startTime.length > 0 && endTime.length > 0) {
                        currentMessage += validTimes(startTime, endTime);
                    }

                    //Checking event date
                    for(var i=0; i < cell.custom.event.length; i++){
                        var event = cell.custom.event[i];
                        var eventTime = Date.parse(event.date);
                        if(isNaN(eventTime)) {
                            currentMessage += 'Date format is invalid for event '+ event.description+'.\n';
                        } else if(Date.now() >= eventTime){
                            currentMessage += 'Date for event ' + event.description + ' should be posterior to current date.\n';
                        }
                    }

                    //Checking output names
                    for(var j=0; i < cell.custom.output.length; j++){
                        var output = cell.custom.output[j];
                        if(output.name.match(/[\w\-. ]+/) === null){
                            currentMessage += 'Output name '+ output.name + ' is incorrect. Only alphanumeric, dash, underscore and point characters.\n';
                        }
                    }

                    if(currentMessage.length > 0) {
                        result.message += name + ' : \n';
                        result.message += currentMessage + '\n';
                        result.valid = false;
                    }
                }

            }
            return result;

            function validTimes(start, end) {
                var timeMessage = '';
                var formattedStart = OCA.SMLDateFormat.getFormattedTime(start, true);
                var formattedEnd = OCA.SMLDateFormat.getFormattedTime(end, false);

                var isValid = formattedStart != undefined && formattedEnd != undefined;
                if (isValid) {
                    var startDate = new Date(formattedStart);
                    var endDate = new Date(formattedEnd);
                    isValid = endDate.getTime() > startDate.getTime();
                    if (!isValid) {
                        timeMessage += 'To date must be after from date\n';
                    }
                } else {
                    timeMessage += 'One or both date of the valid period is poorly formatted\n';
                }
                result.valid = result.valid && isValid;
                return timeMessage;
            }
        }
    };

    OCA = OCA || {};
    OCA.SMLValidator = SMLValidator;
})(jQuery);