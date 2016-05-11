/**
 * 
 * Enable extensions of file upload
 *
 */
(function() {
	/**
	 * @namespace
	 */
	SMLConverter = {

		transform: function(handlebarTemplate, graph, cells) {
			var result=[];
			for (var i in cells) {
                if (cells[i].type != "link") {
                    var elem = cells[i].id;
                    if (graph.getCell(elem).attr('text').text == '') {
                        graph.getCell(elem).attr('text').text = "UNNAMEDElement" + i;
                        cells[i].attrs.text.text = "UNNAMEDElement" + i;
                    }                     
					
					// replace space in date string with "T" to make date string ISO8601 compliant
                    for (var j in cells[i].custom.event) {
                        var dateStr = cells[i].custom.event[j].date;
                        cells[i].custom.event[j].date = dateStr.replace(" ", "T");
                    }

					cells[i].refStruct = [];
					var nameString;
                    for (var j in cells[i].ref) {
                        var ref = cells[i].ref[j];                        
                        if (graph.getCell(ref) != null){
                        	cells[i].refStruct[j] = {}
                            // generate api URL, for example :localhost/owncloud/index.php/apps/snannyowncloudapi/sml/3a003636-8393-40c9-9cbc-e4ddf40e397c
                            cells[i].refStruct[j].uri = imageExternalHost + "/owncloud/index.php/apps/snannyowncloudapi/sml/" + cells[i].ref[j];
                            // name is used as reference
							nameStr = graph.getCell(ref).attr('text').text;							
                            cells[i].refStruct[j].name = nameStr.replace(/[^A-Za-z0-9\.\-\_]/gm , '_');
                            }
                    }                    
                }
            }
            for (var i in cells) {

                if (cells[i].type != "link") {

                    cells[i].modelType = "plop";
                    cells[i].smlTypeOfUrl = smlTypeOfUrl;
                    if (cells[i].modelType = cells[i].custom.classifier[0] && cells[i].custom.classifier[0].name === "model"){
						cells[i].modelType = cells[i].custom.classifier[0].URI;
                    }

                    cells[i].custom.classifier = cells[i].custom.classifier.filter(function(el) {
                        return el.Ref !== "modelData";
                    });

                    var template = Handlebars.compile(handlebarTemplate);
                    var generated = template(cells[i]);

                    var generatedDecode = $('<textarea />').html(generated).text();
                    var filename = cells[i].attrs.text.text + ".xml";
                    result.push({'filename':filename, 'data':generatedDecode});
                }

            }
            return result;
		}
	};

	OCA = OCA || {};
	OCA.SMLConverter = SMLConverter;
})(jQuery);