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
                    for (var j in cells[i].ref) {
                        var ref = cells[i].ref[j];
                        if (graph.getCell(ref) != null)
                            cells[i].ref[j] = graph.getCell(ref).attr('text').text;
                    }
                }
            }
            for (var i in cells) {

                if (cells[i].type != "link") {

                    cells[i].modelType = "plop";
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