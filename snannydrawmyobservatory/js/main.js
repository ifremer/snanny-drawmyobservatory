var APP_NAME = 'snannydrawmyobservatory';
var APPS_URL = '/apps/' + APP_NAME;
var API_APPS_NAME = 'snannyowncloudapi';
var API_APPS_URL = '/apps/' + API_APPS_NAME;
var DL_APPS_URL = 'apps/files/ajax/download.php';
var tooltipManager;

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? undefined : decodeURIComponent(results[1].replace(/\+/g, " "));
}

var filename = getParameterByName('filename');
var action = getParameterByName('action');
var directory = getParameterByName('dir');

function showStatus(message, type) {

    $('.status').removeClass('info error success').addClass(type).html(message);
    $('#statusbar-container').dequeue().addClass('active').delay(3000).queue(function () {
        $(this).removeClass('active');
    });
};

var ajaxTemplate;

$(document).ready(function () {
    var Rappid = Backbone.Router.extend({

        routes: {
            '': 'home'
        },

        initialize: function (options) {
            this.options = options || {};
            tooltipManager = new TooltipManager();
        },

        home: function () {
            this.initializeEditor();
        },

        initializeEditor: function () {

            this.inspectorClosedGroups = {};

            this.initializePaper();
            this.initializeAjaxRequests();
            this.initializeStencil();
            this.initializeSelection();
            this.initializeHaloAndInspector();
            this.initializeNavigator();
            this.initializeClipboard();
            this.initializeCommandManager();
            this.initializeToolbar();
            // Intentionally commented out. See the `initializeValidator()` method for reasons.
            // Uncomment for demo purposes.
            this.initializeValidator();

            // Commented out by default. You need to run `node channelHub.js` in order to make
            // channels working. See the documentation to the joint.com.Channel plugin for details.
            //this.initializeChannel('ws://jointjs.com:4141');
            if (this.options.channelUrl) {
                this.initializeChannel(this.options.channelUrl);
            }
        },

        // Create a graph, paper and wrap the paper in a PaperScroller.
        initializePaper: function () {


            $.get(OC.filePath(APP_NAME, 'forms', 'model'), function (data) {
                ajaxTemplate = data;
            });

            this.graph = new joint.dia.Graph;

            this.graph.on('add', function (cell, collection, opt) {
                if (opt.stencil) {
                    this.createInspector(cell);
                    this.commandManager.stopListening();
                    this.inspector.updateCell();
                    this.commandManager.listen();
                    this.inspector.$('[data-attribute]:first').focus();
                }
            }, this);

            this.paper = new joint.dia.Paper({
                width: 1000,
                height: 1000,
                gridSize: 10,
                perpendicularLinks: true,
                model: this.graph,
                defaultLink: new joint.dia.Link({
                    attrs: {
                        // @TODO: scale(0) fails in Firefox
                        '.marker-source': {
                            d: 'M 10 0 L 0 5 L 10 10 z',
                            transform: 'scale(0.001)'
                        },
                        '.marker-target': {
                            d: 'M 10 0 L 0 5 L 10 10 z'
                        },
                        '.connection': {
                            stroke: 'black'
                            // filter: { name: 'dropShadow', args: { dx: 1, dy: 1, blur: 2 } }
                        }
                    }
                })
            });

            this.paperScroller = new joint.ui.PaperScroller({
                autoResizePaper: true,
                padding: 50,
                paper: this.paper
            });

            jQuery('.paper-container');
            this.paperScroller.$el.appendTo('.paper-container');

            this.paperScroller.center();

            this.graph.on('add', this.initializeLinkTooltips, this);

            $('.paper-scroller').on('mousewheel DOMMouseScroll', _.bind(function (evt) {

                if (_.contains(KeyboardJS.activeKeys(), 'alt')) {
                    evt.preventDefault();
                    var delta = Math.max(-1, Math.min(1, (evt.originalEvent.wheelDelta || -evt.originalEvent.detail)));
                    var offset = this.paperScroller.$el.offset();
                    var o = this.paperScroller.toLocalPoint(evt.pageX - offset.left, evt.pageY - offset.top);
                    this.paperScroller.zoom(delta / 10, {
                        min: 0.2,
                        max: 5,
                        ox: o.x,
                        oy: o.y
                    });
                }

            }, this));

            this.snapLines = new joint.ui.Snaplines({
                paper: this.paper
            });


            var graphInstance = this.graph;
            if (action === 'edit') {
                $.ajax({
                    url: OC.generateUrl(APPS_URL + '/get?file=' + filename + '&dir=' + directory),
                    success: function (result) {
                        graphInstance.fromJSON(jQuery.parseJSON(result));
                    },
                    async: true
                });
            }
        },

        initializeLinkTooltips: function (cell) {


            if (cell instanceof joint.dia.Link) {
                var linkView = this.paper.findViewByModel(cell);
                new joint.ui.Tooltip({
                    className: 'tooltip small',
                    target: linkView.$('.tool-options'),
                    content: 'Click to open Inspector for this link',
                    left: linkView.$('.tool-options'),
                    direction: 'left'
                });
            }
        },

        // Create and populate stencil.
        initializeStencil: function () {

            this.stencil = new joint.ui.Stencil({
                graph: this.graph,
                paper: this.paper,
                width: 280,
                groups: Stencil.groups,
                search: {
                    '*': ['type', 'attrs/text/text', 'attrs/.label/text'],
                    'org.Member': ['attrs/.rank/text', 'attrs/.name/text']
                }
            });

            $('.stencil').remove()
            $('.stencil-container').append(this.stencil.render().el);

            this.stencil.$el.on('contextmenu', function (evt) {
                evt.preventDefault();
            });

            $('.stencil-paper-drag').on('contextmenu', function (evt) {
                evt.preventDefault();
            });

            var layoutOptions = {
                columnWidth: this.stencil.options.width / 2 - 10,
                columns: 2,
                rowHeight: 90,
                resizeToFit: true,
                dy: 10,
                dx: 10
            };

            _.each(Stencil.groups, function (group, name) {

                this.stencil.load(Stencil.shapes[name], name);
                joint.layout.GridLayout.layout(this.stencil.getGraph(name), layoutOptions);
                this.stencil.getPaper(name).fitToContent(1, 1, 10);

            }, this);

            this.stencil.on('filter', function (graph) {
                joint.layout.GridLayout.layout(graph, layoutOptions);
            });

            $('.stencil-container .btn-expand').on('click', _.bind(this.stencil.openGroups, this.stencil));
            $('.stencil-container .btn-collapse').on('click', _.bind(this.stencil.closeGroups, this.stencil));

            this.initializeStencilTooltips();

        },

        initializeStencilTooltips: function () {



            // Create tooltips for all the shapes in stencil.
            _.each(this.stencil.graphs, function (graph) {

                graph.get('cells').each(function (cell) {
                    var content = "";

                    if (cell.get('attrs').text.name) {
                        content += "<h3>" + cell.get('attrs').text.name + "</h3>";
                    }
                    if (cell.get('custom').classifier[1]) {
                        content += "<p>" + cell.get('custom').classifier[1].value + "</p>";

                    }
                    if (cell.get('custom').identifier[0]) {
                        content += '<a href="' + emsoYellowPage + '/sensor.php?id=' + cell.get('custom').identifier[0].value + '" target="_blank">more information...</a>';
                    }
                    tooltipManager.register('.stencil [model-id="' + cell.id + '"]', cell.id, content);
                });
            });
        },

        initializeSelection: function () {

            this.selection = new Backbone.Collection;
            this.selectionView = new joint.ui.SelectionView({
                paper: this.paper,
                graph: this.graph,
                model: this.selection
            });

            // Initiate selecting when the user grabs the blank area of the paper while the Shift key is pressed.
            // Otherwise, initiate paper pan.
            this.paper.on('blank:pointerdown', function (evt, x, y) {

                if (_.contains(KeyboardJS.activeKeys(), 'shift')) {
                    this.selectionView.startSelecting(evt, x, y);
                } else {
                    this.selectionView.cancelSelection();
                    this.paperScroller.startPanning(evt, x, y);
                }
            }, this);

            this.paper.on('cell:pointerdown', function (cellView, evt) {
                // Select an element if CTRL/Meta key is pressed while the element is clicked.
                if ((evt.ctrlKey || evt.metaKey) && !(cellView.model instanceof joint.dia.Link)) {
                    this.selection.add(cellView.model);
                    this.selectionView.createSelectionBox(cellView);
                }
            }, this);

            this.selectionView.on('selection-box:pointerdown', function (evt) {
                // Unselect an element if the CTRL/Meta key is pressed while a selected element is clicked.
                if (evt.ctrlKey || evt.metaKey) {
                    var cell = this.selection.get($(evt.target).data('model'));
                    this.selection.reset(this.selection.without(cell));
                    this.selectionView.destroySelectionBox(this.paper.findViewByModel(cell));
                }
            }, this);

            // Disable context menu inside the paper.
            // This prevents from context menu being shown when selecting individual elements with Ctrl in OS X.
            this.paper.el.oncontextmenu = function (evt) {
                evt.preventDefault();
            };

            KeyboardJS.on('delete, backspace', _.bind(function (evt, keys) {

                if (!$.contains(evt.target, this.paper.el)) {
                    // remove selected elements from the paper only if the target is the paper
                    return;
                }

                this.commandManager.initBatchCommand();
                this.selection.invoke('remove');
                this.commandManager.storeBatchCommand();
                this.selectionView.cancelSelection();

                // Prevent Backspace from navigating one page back (happens in FF).
                if (_.contains(keys, 'backspace') && !$(evt.target).is("input, textarea")) {

                    evt.preventDefault();
                }

            }, this));
        },

        createInspector: function (cellView) {

            var cell = cellView.model || cellView;

            // No need to re-render inspector if the cellView didn't change.
            if (!this.inspector || this.inspector.options.cell !== cell) {

                if (this.inspector) {

                    this.inspectorClosedGroups[this.inspector.options.cell.id] = _.map(app.inspector.$('.group.closed'), function (g) {
                        return $(g).attr('data-name');
                    });

                    // Clean up the old inspector if there was one.
                    this.inspector.updateCell();
                    this.inspector.remove();
                }

                var inspectorDefs = InspectorDefs[cell.get('type')];

                this.inspector = new joint.ui.Inspector({
                    inputs: inspectorDefs ? inspectorDefs.inputs : CommonInspectorInputs,
                    groups: inspectorDefs ? inspectorDefs.groups : CommonInspectorGroups,
                    cell: cell
                });

                this.initializeInspectorTooltips();

                this.inspector.render();
                $('.inspector-container').html(this.inspector.el);

                if (this.inspectorClosedGroups[cell.id]) {

                    _.each(this.inspectorClosedGroups[cell.id], this.inspector.closeGroup, this.inspector);

                } else {
                    this.inspector.$('.group:not(:first-child)').addClass('closed');
                }
            }
        },

        initializeInspectorTooltips: function () {

            this.inspector.on('render', function () {

                this.inspector.$('[data-tooltip]').each(function () {

                    var $label = $(this);
                    new joint.ui.Tooltip({
                        target: $label,
                        content: $label.data('tooltip'),
                        right: '.inspector',
                        direction: 'right'
                    });
                });

            }, this);
        },

        initializeHaloAndInspector: function () {

            this.paper.on('cell:pointerup', function (cellView, evt) {

                if (cellView.model instanceof joint.dia.Link || this.selection.contains(cellView.model)) return;

                // In order to display halo link magnets on top of the freetransform div we have to create the
                // freetransform first. This is necessary for IE9+ where pointer-events don't work and we wouldn't
                // be able to access magnets hidden behind the div.
                var freetransform = new joint.ui.FreeTransform({
                    graph: this.graph,
                    paper: this.paper,
                    cell: cellView.model
                });
                var halo = new joint.ui.Halo({
                    graph: this.graph,
                    paper: this.paper,
                    cellView: cellView
                });

                // As we're using the FreeTransform plugin, there is no need for an extra resize tool in Halo.
                // Therefore, remove the resize tool handle and reposition the clone tool handle to make the
                // handles nicely spread around the elements.
                halo.removeHandle('resize');
                halo.changeHandle('clone', {
                    position: 'se'
                });

                freetransform.render();
                halo.render();

                this.initializeHaloTooltips(halo);

                this.createInspector(cellView);

                this.selectionView.cancelSelection();
                this.selection.reset([cellView.model]);

            }, this);

            this.paper.on('link:options', function (evt, cellView, x, y) {

                this.createInspector(cellView);
            }, this);
        },

        initializeNavigator: function () {

            var navigator = this.navigator = new joint.ui.Navigator({
                width: 240,
                height: 115,
                paperScroller: this.paperScroller,
                zoomOptions: {
                    max: 5,
                    min: 0.2
                }
            });

            navigator.$el.appendTo('.navigator-container');
            navigator.render();
        },

        initializeHaloTooltips: function (halo) {

            new joint.ui.Tooltip({
                className: 'tooltip small',
                target: halo.$('.remove'),
                content: 'Click to remove the object',
                direction: 'right',
                right: halo.$('.remove'),
                padding: 15
            });
            new joint.ui.Tooltip({
                className: 'tooltip small',
                target: halo.$('.fork'),
                content: 'Click and drag to clone and connect the object in one go',
                direction: 'left',
                left: halo.$('.fork'),
                padding: 15
            });
            new joint.ui.Tooltip({
                className: 'tooltip small',
                target: halo.$('.clone'),
                content: 'Click and drag to clone the object',
                direction: 'left',
                left: halo.$('.clone'),
                padding: 15
            });
            new joint.ui.Tooltip({
                className: 'tooltip small',
                target: halo.$('.unlink'),
                content: 'Click to break all connections to other objects',
                direction: 'right',
                right: halo.$('.unlink'),
                padding: 15
            });
            new joint.ui.Tooltip({
                className: 'tooltip small',
                target: halo.$('.link'),
                content: 'Click and drag to connect the object',
                direction: 'left',
                left: halo.$('.link'),
                padding: 15
            });

            new joint.ui.Tooltip({
                className: 'tooltip small',
                target: halo.$('.rotate'),
                content: 'Click and drag to rotate the object',
                direction: 'right',
                right: halo.$('.rotate'),
                padding: 15
            });
        },

        initializeClipboard: function () {

            this.clipboard = new joint.ui.Clipboard;

            KeyboardJS.on('ctrl + c', _.bind(function () {
                // Copy all selected elements and their associated links.
                this.clipboard.copyElements(this.selection, this.graph, {
                    translate: {
                        dx: 20,
                        dy: 20
                    },
                    useLocalStorage: true
                });
            }, this));

            KeyboardJS.on('ctrl + v', _.bind(function () {

                this.selectionView.cancelSelection();

                this.clipboard.pasteCells(this.graph, {
                    link: {
                        z: -1
                    },
                    useLocalStorage: true
                });

                // Make sure pasted elements get selected immediately. This makes the UX better as
                // the user can immediately manipulate the pasted elements.
                this.clipboard.each(function (cell) {

                    if (cell.get('type') === 'link') return;

                    // Push to the selection not to the model from the clipboard but put the model into the graph.
                    // Note that they are different models. There is no views associated with the models
                    // in clipboard.
                    this.selection.add(this.graph.getCell(cell.id));
                    this.selectionView.createSelectionBox(cell.findView(this.paper));

                }, this);

            }, this));

            KeyboardJS.on('ctrl + x', _.bind(function () {

                var originalCells = this.clipboard.copyElements(this.selection, this.graph, {
                    useLocalStorage: true
                });
                this.commandManager.initBatchCommand();
                _.invoke(originalCells, 'remove');
                this.commandManager.storeBatchCommand();
                this.selectionView.cancelSelection();
            }, this));
        },

        initializeCommandManager: function () {

            this.commandManager = new joint.dia.CommandManager({
                graph: this.graph
            });

            KeyboardJS.on('ctrl + z', _.bind(function () {

                this.commandManager.undo();
                this.selectionView.cancelSelection();
            }, this));

            KeyboardJS.on('ctrl + y', _.bind(function () {

                this.commandManager.redo();
                this.selectionView.cancelSelection();
            }, this));
        },

        initializeValidator: function () {

            // This is just for demo purposes. Every application has its own validation rules or no validation
            // rules at all.

            this.validator = new joint.dia.Validator({
                commandManager: this.commandManager
            });


            this.validator.validate('change:source change:target add', _.bind(function (err, command, next) {
                var loops = false //link loops allowed / denied
                    ,
                    paperPin = true //allow link to pin to paper
                    ,
                    type = 'type' // attribute name in the cell the rules working with


                var link = command.data.attributes || this.graph.getCell(command.data.id).toJSON();

                if (link.type != 'link' && link.type != 'basic.Sensor' && link.type != 'basic.Platform') {


                    joint.dia.Cell.prototype.prop.call(this.graph.getCell(link.id), "attrs/text/text", link.custom.classifier[0].value, undefined);

                }


                //console.log(this.graph.getCell(link).attr("text"));
                if (link.type != 'link') {

                    this.graph.getCell(link.id).get('uuid').push(link.id);

                    this.graph.getCell(link.id);
                }

                if (link.type == 'link') {
                    var sourceId = link.source.id,
                        targetId = link.target.id;


                    if (sourceId && targetId) {
                        this.graph.getCell(targetId).get('ref').push(sourceId);
                        this.graph.getCell(targetId).get('ref');
                        this.graph.getCell(targetId);
                    }


                    return next();
                }
            }, this));


            this.validator.validate('change:source change:target remove', _.bind(function (err, command, next) {
                var type = 'type' // attribute name in the cell the rules working with


                if (this.graph.getCell(command.data.id) == undefined) {
                    var link = command.data.attributes || this.graph.getCell(command.data.id).toJSON();
                    if (link.type == 'link') {
                        var sourceId = link.source.id,
                            targetId = link.target.id;
                        if (sourceId && targetId) {
                            if (this.graph.getCell(targetId) != undefined)
                                this.graph.getCell(targetId).get('ref').splice(this.graph.getCell(targetId).get('ref').indexOf(sourceId), 1);
                        }
                    }
                }
            }, this));
            this.validator.on('invalid', function (message) {
            });
        },
        toJSON: function () {

            var windowFeatures = 'menubar=no,location=no,resizable=yes,scrollbars=yes,status=no';
            var windowName = _.uniqueId('json_output');
            var jsonWindow = window.open('', windowName, windowFeatures);

            jsonWindow.document.write(JSON.stringify(this.graph.toJSON()));
        },


        initializeToolbar: function () {

            $('#btn-undo').on('click', _.bind(this.commandManager.undo, this.commandManager));
            $('#btn-redo').on('click', _.bind(this.commandManager.redo, this.commandManager));


            $('#btn-zoom-in').on('click', _.bind(function () {
                this.paperScroller.zoom(0.2, {
                    max: 5,
                    grid: 0.2
                });
            }, this));
            $('#btn-zoom-out').on('click', _.bind(function () {
                this.paperScroller.zoom(-0.2, {
                    min: 0.2,
                    grid: 0.2
                });
            }, this));
            $("li.sensorml").on('click', _.bind(function () {

                var model = this.graph.toJSON();
                var smlValid = OCA.SMLValidator.isValid(model.cells);
                if (smlValid.valid) {
                    var zip = new JSZip();
                    var name = (fileName) ? filename : 'draw-my-observatory-sml';
                    var items = OCA.SMLConverter.transform(ajaxTemplate, this.graph, model.cells);

                    for (var i in items) {
                        zip.file(items[i].filename, items[i].data);
                    }
                    var content = zip.generate({
                        type: "blob"
                    });
                    saveAs(content, name + ".zip");
                } else {
                    this.showSmlErrorDialog(smlValid.message, []);
                }
            }, this));
            $("li.png").on('click', _.bind(this.paper.openAsPNG, this.paper));
            $("li.svg").on('click', _.bind(this.paper.openAsSVG, this.paper));
            $('#btn-clear').on('click', _.bind(this.graph.clear, this.graph));

            $('#btn-zoom-to-fit').on('click', _.bind(function () {
                this.paperScroller.zoomToFit({
                    padding: 20,
                    scaleGrid: 0.2,
                    minScale: 0.2,
                    maxScale: 5
                });
            }, this));
            $('#btn-print').on('click', _.bind(this.paper.print, this.paper));
            $('#btn-exportJSON').on('click', _.bind(this.toJSON, this));
            $('li.odt').on('click', _.bind(function () {
                var model = this.graph.toJSON();
                for (var i = 0; i < model.cells.length; i++) {
                    if (model.cells[i].type == 'link') {
                        model.cells.splice(i, 1);
                        i--;
                    }


                }

                for (var i = 0; i < model.cells.length; i++) {
                    var imageExtension = model.cells[i].attrs.image["xlink:href"];
                    imageExtension = imageExtension.split(".");
                    if (imageExtension[1] === "png") {
                        model.cells[i].attrs.image["xlink:href"] = imageExternalHost + model.cells[i].attrs.image["xlink:href"];
                        model.cells[i].documentation["link"] = imageExternalHost + model.cells[i].documentation["link"];
                    }
                }


                for (var i in model.cells) {

                    if (model.cells[i].type != "link") {

                        var elem = model.cells[i].id;
                        if (this.graph.getCell(elem).attr('text').text == '') {
                            this.graph.getCell(elem).attr('text').text = "UNNAMEDElement" + i;
                            model.cells[i].attrs.text.text = "UNNAMEDElement" + i;

                        }

                        for (var j in model.cells[i].ref) {
                            var ref = model.cells[i].ref[j];

                            if (this.graph.getCell(ref) != null)
                                model.cells[i].ref[j] = this.graph.getCell(ref).attr('text').text;
                        }
                    }
                }

                model = JSON.stringify(model);

                var callback = function (dataURL) {

                    var imageURL = DL_APPS_URL + '?dir=' + directory + '&files=' + filename + '.png';
                    var defer = $.Deferred();

                    OCA.DrawMyObservatory.FileSave.save({
                        dir: directory,
                        filename: filename + '.png',
                        callback: function (data) {
                            //Envoi des données à un service qui créer le .moe et met en place un tar

                            if (data) {
                                var self = this;
                                $.ajax({
                                    url: OC.generateUrl(APPS_URL + '/save'),
                                    type: 'POST',
                                    dataType: 'json',
                                    data: {
                                        "graphic": dataURL,
                                        "filename": data.filename,
                                        "dir": data.dir
                                    },
                                    success: function (response) {
                                        defer.resolve(response);
                                        OCA.Preferences.save();
                                        if (response.status === 'success') {
                                            OCA.TemplateUtil.showNotificationMessage('File export to ODT', 'Confirmation');
                                        }
                                    },
                                    error: function (jqXHR, textStatus, errorThrown) {
                                        defer.reject({
                                            status: 'error',
                                            message: 'An error occured : ' + errorThrown
                                        });
                                    }
                                });
                            }
                        }
                    });

                    //calling birt server
                    defer.promise().done(function(response){
                        $("#json").attr("value", model);
                        $("#projectName").attr("value", response.filename);
                        $("#overallImage").attr("value", imageURL);
                        $('#birtForm').attr("action", birtserverLink);
                        $('#birtForm').submit();
                    });
                };

                this.paper.toPNG(callback);

            }, this));

            $("li.save").on('click', _.bind(function () {
                var graphicData = JSON.stringify(this.graph.toJSON());
                var model = this.graph.toJSON();

                var smlValid = OCA.SMLValidator.isValid(model.cells);
                if (smlValid.valid) {
                    var toImport = [];

                    $.each(model.cells, function (i, v) {
                        if (v.type != "link") {
                            if (v.custom.imported) {
                                toImport.push(v);
                                OCA.Preferences.add(v.attrs.text.text);
                            } else {
                                OCA.Preferences.remove(v.attrs.text.text);
                            }
                        }
                    });

                    var smls = OCA.SMLConverter.transform(ajaxTemplate, this.graph, model.cells);

                    var oneOrMoreExist = false;
                    var finalMessage = 'The periods proposed overlaps with existing descriptions:\n\n';
                    var finalElements = [];
                    for (var i in model.cells) {
                        var cell = model.cells[i];
                        if (cell.type != "link") {
                            var existResult = this.smlExist(cell.attrs.text.name, cell.id, cell.from, cell.to, directory, filename);
                            if (existResult.exist) {
                                oneOrMoreExist = true;
                                for (var i in existResult.elements) {
                                    finalElements.push(existResult.elements[i]);
                                }

                            }
                        }
                    }

                    if (!oneOrMoreExist) {
                        OCA.DrawMyObservatory.FileSave.save({
                            dir: directory,
                            filename: filename,
                            callback: function (data) {
                                //Envoi des données à un service qui créer le .moe et met en place un tar
                                var defer = $.Deferred();
                                if (data) {
                                    var self = this;
                                    var saveUrl = OC.generateUrl(APPS_URL + '/save');
                                    var dataToSend = {
                                        "graphic": graphicData,
                                        "smls": JSON.stringify(smls),
                                        "cells": JSON.stringify(toImport),
                                        "filename": data.filename,
                                        "dir": data.dir
                                    };


                                    $.ajax({
                                        url: saveUrl,
                                        type: 'POST',
                                        dataType: 'json',
                                        data: dataToSend,
                                        success: function (response) {
                                            defer.resolve(response);
                                            OCA.Preferences.save();
                                            if (response.status === 'success') {
                                                OCA.TemplateUtil.showNotificationMessage('File saved', 'Confirmation');
                                                filename = response.filename;
                                            }
                                        },
                                        error: function (jqXHR, textStatus, errorThrown) {
                                            defer.resolve({
                                                status: 'error',
                                                message: 'An error occured : ' + errorThrown
                                            });
                                        }
                                    });
                                }
                                return defer.promise();
                            }
                        });
                    } else {
                        this.showSmlErrorDialog(finalMessage, finalElements);
                    }
                } else {
                    this.showSmlErrorDialog(smlValid.message, []);
                }
            }, this));


            // toFront/toBack must be registered on mousedown. SelectionView empties the selection
            // on document mouseup which happens before the click event. @TODO fix SelectionView?
            $('#btn-to-front').on('mousedown', _.bind(function (evt) {
                this.selection.invoke('toFront');
            }, this));
            $('#btn-to-back').on('mousedown', _.bind(function (evt) {
                this.selection.invoke('toBack');
            }, this));

            $('#btn-layout').on('click', _.bind(this.layoutDirectedGraph, this));

            $('#input-gridsize').on('change', _.bind(function (evt) {
                var gridSize = parseInt(evt.target.value, 10);
                $('#output-gridsize').text(gridSize);
                this.setGrid(gridSize);
            }, this));

            $('#snapline-switch').change(_.bind(function (evt) {
                if (evt.target.checked) {
                    this.snapLines.startListening();
                } else {
                    this.snapLines.stopListening();
                }
            }, this));

            var $zoomLevel = $('#zoom-level');
            this.paper.on('scale', function (scale) {
                $zoomLevel.text(Math.round(scale * 100));
            });
        },


        toggleFullscreen: function () {

            var el = document.body;

            function prefixedResult(el, prop) {

                var prefixes = ['webkit', 'moz', 'ms', 'o', ''];
                for (var i = 0; i < prefixes.length; i++) {
                    var prefix = prefixes[i];
                    var propName = prefix ? (prefix + prop) : (prop.substr(0, 1).toLowerCase() + prop.substr(1));
                    if (!_.isUndefined(el[propName])) {
                        return _.isFunction(el[propName]) ? el[propName]() : el[propName];
                    }
                }
            }

            if (prefixedResult(document, 'FullScreen') || prefixedResult(document, 'IsFullScreen')) {
                prefixedResult(document, 'CancelFullScreen');
            } else {
                prefixedResult(el, 'RequestFullScreen');
            }
        },

        setGrid: function (gridSize) {

            this.paper.options.gridSize = gridSize;

            var backgroundImage = this.getGridBackgroundImage(gridSize);
            this.paper.$el.css('background-image', 'url("' + backgroundImage + '")');
        },

        getGridBackgroundImage: function (gridSize, color) {

            var canvas = $('<canvas/>', {
                width: gridSize,
                height: gridSize
            });

            canvas[0].width = gridSize;
            canvas[0].height = gridSize;

            var context = canvas[0].getContext('2d');
            context.beginPath();
            context.rect(1, 1, 1, 1);
            context.fillStyle = color || '#AAAAAA';
            context.fill();

            return canvas[0].toDataURL('image/png');
        },

        layoutDirectedGraph: function () {

            this.commandManager.initBatchCommand();

            _.each(this.graph.getLinks(), function (link) {

                // Reset vertices.
                link.set('vertices', []);

                // Remove all the non-connected links.
                if (!link.get('source').id || !link.get('target').id) {
                    link.remove();
                }
            });

            var pad = 0; // padding for the very left and very top element.
            joint.layout.DirectedGraph.layout(this.graph, {
                setLinkVertices: false,
                rankDir: 'LR',
                rankDir: 'TB',
                setPosition: function (cell, box) {
                    cell.position(box.x - box.width / 2 + pad, box.y - box.height / 2 + pad);
                }
            });

            // Scroll to the top-left corner as this is the initial position for the DirectedGraph layout.
            this.paperScroller.el.scrollLeft = 0;
            this.paperScroller.el.scrollTop = 0;

            this.commandManager.storeBatchCommand();
        },


        initializeChannel: function (url) {
            // Example usage of the Channel plugin. Note that this assumes the `node channelHub` is running.
            // See the channelHub.js file for furhter instructions.

            var room = (location.hash && location.hash.substr(1));
            if (!room) {
                room = joint.util.uuid();
                this.navigate('#' + room);
            }

            var channel = this.channel = new joint.com.Channel({
                graph: this.graph,
                url: url || 'ws://localhost:4141',
                query: {
                    room: room
                }
            });
            // console.log('room', room, 'channel', channel.id);

            var roomUrl = location.href.replace(location.hash, '') + '#' + room;
            $('.statusbar-container .rt-colab').html('Send this link to a friend to <b>collaborate in real-time</b>: <a href="' + roomUrl + '" target="_blank">' + roomUrl + '</a>');
        },
        initializeAjaxRequests: function () {


            var rappid = this;
            var modelNames = [];
            var reqModels = [];
            var reqModel = $.ajax({

                //This will retrieve the contents of the folder if the folder is configured as 'browsable'
                url: OC.filePath(APP_NAME, 'models', ''),
                success: function (data) {

                    //Lsit all png file names in the page

                    $(data).find("a").each(function (index) {
                        var filename = this.href.split("/");

                        filename = filename[filename.length - 1];
                        if (filename.substring(0, 1) !== '?')
                            modelNames.push(filename);

                        var modelNamesSplitted = filename.split("_");

                        var type = [];
                        for (var i = 1; i < modelNamesSplitted.length - 1; i++) {

                            type.push(modelNamesSplitted[i]);

                        }
                        var typeName = type.join("_");
                        if (filename.substr(filename.lastIndexOf('.') + 1) === "json") {
                            var urlModel = OC.filePath(APP_NAME, 'models', filename);
                            reqModels[index] = $.ajax({
                                url: urlModel,
                                success: function (a) {
                                    var shape = null;

                                    if (typeof a == 'object') {
                                        shape = a;
                                    } else if (a.substring(0, 4) == '{"do') {
                                        shape = $.parseJSON(a);
                                    }

                                    if (shape != null) {
                                        //Create owncloud link
                                        var link = shape.documentation.link;
                                        var fileName = link.substr(link.lastIndexOf("/") + 1);
                                        shape.documentation.link = OC.filePath(APP_NAME, 'models', filename);

                                        var image = shape.attrs.image['xlink:href'];
                                        var imageFileName = image.substr(image.lastIndexOf("/") + 1);
                                        shape.attrs.image['xlink:href'] = OC.imagePath(APP_NAME, 'models/' + imageFileName);

                                        Stencil.shapes[typeName].push(new joint.shapes.basic.ACOUSTIC_RELEASE(shape));
                                    }
                                },
                                error: function (a) {

                                    console.log("faailed");
                                }


                            });

                        }


                    });

                }

            });

            $.when(reqModel).done(function () {


                $.when.apply($, reqModels).done(function () {
                    rappid.initializeStencil();
                });
                $.when.apply($, reqModels).fail(function () {
                    rappid.initializeStencil();
                });

            });

            var importedData = [];
            var req = [];

            $.when(OCA.Preferences.load(filename)).done(function () {
                var prefs = OCA.Preferences.get();
                if (prefs === null || prefs.length === 0) {
                    $(".se-pre-con").fadeOut("fast");
                } else {
                    for (var i in prefs) {
                        if (prefs[i] !== "") {
                            req[i] = $.ajax({
                                url: OC.generateUrl(APPS_URL + '/model/' + prefs[i]),
                                success: function (a) {
                                    importedData.push($.parseJSON(a));
                                },

                                error: function () {
                                    importedData.push("fail");
                                }
                            });
                        } else {
                            importedData.push("fail");
                        }
                    }

                    
                    $.when.apply($, req).done(function () {
                        for (var i in prefs) {
                            importedData[i].cells.custom.imported = false;
                        }
                        for (var i in prefs) {
                            Stencil.shapes.Imported.push(new joint.shapes.basic.Platform(importedData[i].cells));
                        }
                        rappid.initializeStencil();
                        $(".se-pre-con").fadeOut("fast");
                    });

                    $.when.apply($, req).fail(function () {
                        $(".se-pre-con").fadeOut("fast");
                    });
                }
                if (OCA.Preferences.getPermission()) {
                    document.getElementsByClassName("save")[0].style.display = "none";
                }
            })


        },
        showSmlErrorDialog: function (message, elements) {
            var dialogId = OCA.TemplateUtil.createSmlDialog(
                {
                    smlErrorMsg: message,
                    buttonList: [
                        {
                            text: 'Close',
                            click: function () {
                                var dialog = $(this);
                                dialog.ocdialog('close');
                            },
                            defaultButton: true
                        }]
                }, elements);

            return $(dialogId);
        },
        smlExist: function (name, uuid, startTime, endTime, dir, fileName) {
            var defer = $.Deferred();
            var smlExistUrl = OC.generateUrl(API_APPS_URL + '/smlExist');
            var dataToSend = {
                "uuid": uuid,
                "from": startTime,
                "to": endTime,
                "dir": dir,
                "fileName": fileName
            };
            var result = {
                exist: false,
                elements: []
            };
            $.ajax({
                url: smlExistUrl,
                type: 'POST',
                async: false,
                dataType: 'json',
                data: dataToSend,
                success: function (response) {
                    if (response.length > 0) {
                        result.exist = true;
                        var msg = 'System : ' + name + '\n';
                        var link = '';
                        var linkIcon = null;
                        for (var i in response) {
                            var system = response[i];
                            var startDate = system.from != null ? new Date(system.from * 1000).toUTCString() : 'null';
                            var endDate = system.to != null ? new Date(system.to * 1000).toUTCString() : 'null';
                            msg += 'Overlap with : ' + system.name + ' (' + system.uuid + '), from ' + startDate + ' to ' + endDate + '\n';
                            if (system.isMoe) {
                                link = OC.generateUrl(APPS_URL + '?action=edit&dir=' + system.dir + '&filename=' + system.fileName);
                                linkIcon = OC.imagePath('snannydrawmyobservatory', 'view');
                            } else {
                                link = OC.generateUrl(DL_APPS_URL + '?dir=' + system.dir + '&files=' + system.fileName);
                                linkIcon = OC.imagePath('core', 'actions/download');
                            }
                        }
                        result.elements.push({
                            message: msg,
                            link: link,
                            linkIcon: linkIcon
                        });
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    defer.resolve({
                        status: 'error',
                        message: 'An error occured : ' + errorThrown
                    });
                }
            });
            return result;
        }


    });
    var app = new Rappid;
    Backbone.history.start();
});