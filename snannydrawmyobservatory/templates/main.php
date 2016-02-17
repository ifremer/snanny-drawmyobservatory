<div id="app">
	<div class="birt-report" id="birt-report" >
		
		<form  action="" id="birtForm" target="_blank" method=post >
			<input type="text" name="json" id="json"  />
			<input type="text" name="projectName" id="projectName"   />
			<input type="text" name="overallImage" id="overallImage"  />
		</form>
	</div>
	
	
	<div class="stencil-container">
		<div class="se-pre-con"></div>
		<label>Palette</label>
		<button class="btn-expand" title="Expand all">+</button>
		<button class="btn-collapse" title="Collapse all">-</button>
	</div>
	<div class="paper-container"></div>
	<div class="toolbar-container">
	<ul class="myMenu">
		<li style="width: 280px"><p id="fileName" class="displayableFileName">&nbsp;</p></li>
	</ul>
	<ul class="myMenu"><li class="save"><span>Save </span></li></ul>
	<ul class="myMenu">
		<li><span>Export  </span>
			<ul>
				<li class="sensorml"><span>Export SensorML</span></li>
				<li class="png"><span>Export PNG</span></li>
				<li class="svg"><span>Export SVG</span></li>
				<li class="odt"><span>Export ODT</span></li>
			</ul>
		</li>
	</ul>
	<ul class="myMenu btn-container">
		<button id="btn-undo" class="btn" data-tooltip="Undo"><img src="<?php print_unescaped(
		image_path('snannydrawmyobservatory', 'undo.png'));?>" alt="Undo"/></button>
		<button id="btn-redo" class="btn" data-tooltip="Redo"><img src="<?php print_unescaped(
		image_path('snannydrawmyobservatory', 'redo.png'));?>" alt="Redo"/></button>
		<button id="btn-clear" class="btn" data-tooltip="Clear Paper"><img src="<?php print_unescaped(
		image_path('snannydrawmyobservatory', 'clear.png'));?>" alt="Clear"/></button>
		<button id="btn-print" class="btn" data-tooltip="Open a Print Dialog"><img src="<?php print_unescaped(
		image_path('snannydrawmyobservatory', 'print.png'));?>"alt="Print"/></button>
		<button id="btn-zoom-in" class="btn" data-tooltip="Zoom In"><img src="<?php print_unescaped(
		image_path('snannydrawmyobservatory', 'zoomin.png'));?>" alt="Zoom in"/></button>
		<button id="btn-zoom-out" class="btn" data-tooltip="Zoom Out"><img src="<?php print_unescaped(
		image_path('snannydrawmyobservatory', 'zoomout.png'));?>" alt="Zoom out"/></button>

		<div class="panel">
		<span id="zoom-level">100</span>
		<span>%</span>
		</div>
		<button id="btn-zoom-to-fit" class="btn" data-tooltip="Zoom To Fit"><img src="<?php print_unescaped(
		image_path('snannydrawmyobservatory', 'zoomtofit.png'));?>" alt="Zoom To Fit"/></button>
		<button id="btn-layout" class="btn" data-tooltip="Auto-layout Graph">layout</button>
		<label data-tooltip="Change Grid Size">Grid size:</label>
		<input type="range" value="10" min="1" max="50" step="1" id="input-gridsize" />
		<output id="output-gridsize">10</output>
		<label data-tooltip="Enable/Disable Snaplines">Snaplines:</label>
		<input type="checkbox" id="snapline-switch" checked/>
	</ul>
</div>

<div class="inspector-container"></div>
<div class="navigator-container"></div>
<div class="statusbar-container">
<div class="status"></div>
<span class="rt-colab"></span>
</div>
</div>