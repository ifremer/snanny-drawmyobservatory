<?php
style('drawmyobservatory', 'dropDownButton');
style('drawmyobservatory', 'joint.all');
style('drawmyobservatory', 'layout');
style('drawmyobservatory', 'paper');
style('drawmyobservatory', 'inspector');
style('drawmyobservatory', 'navigator');
style('drawmyobservatory', 'stencil');
style('drawmyobservatory', 'halo');
style('drawmyobservatory', 'selection');
style('drawmyobservatory', 'toolbar');
style('drawmyobservatory', 'statusbar');
style('drawmyobservatory', 'freetransform');
style('drawmyobservatory', 'style');
style('drawmyobservatory', 'dropDownButton');
style('drawmyobservatory', 'preLoading');
style('drawmyobservatory', 'jquery-ui.min');
style('drawmyobservatory', 'jquery.datetimepicker');

?>
<!--<style src="'"http://fonts.googleapis.com/css?family=Source+Sans+Pro:400,700"'"/>-->
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
		
		
		
		<ul class="myMenu">   <li class="new"><span>New </span> </li> </ul>
		<ul class="myMenu">
			<li><span>Open </span>
			<ul>
				<li class="fromowncloud"><span>from owncloud</span></li>			
				<div class="file_button_container" id="fromdevice"><input type="file" id="fileInput" /></div>
			</ul>
		</li>
		
	</ul>
	<ul class="myMenu"><li class="save"><span>Save </span></li></ul>
	<ul class="myMenu">
		<ul class="myMenu">
			<li><span>Save as </span>
			<ul>
				<li class="todevice"><span>to device</span></li>
				<li class="toowncloud"><span>to Owncloud</span></li>
			</ul>
		</li>
		
	</ul>
	<li><span>Export  </span>
	<ul>
		<li class="sensorml"><span>Export SensorML</span></li>
		<li class="png"><span>Export PNG</span></li>
		<li class="svg"><span>Export SVG</span></li>
		<li class="odt"><span>Export ODT</span></li>
		
	</ul>
</li>
</ul>
	<div class="btn-container">
		<button id="btn-undo" class="btn" data-tooltip="Undo"><img src="<?php print_unescaped(
		image_path('drawmyobservatory', 'undo.png'));?>" alt="Undo"/></button>
		<button id="btn-redo" class="btn" data-tooltip="Redo"><img src="<?php print_unescaped(
		image_path('drawmyobservatory', 'redo.png'));?>" alt="Redo"/></button>
		<button id="btn-clear" class="btn" data-tooltip="Clear Paper"><img src="<?php print_unescaped(
		image_path('drawmyobservatory', 'clear.png'));?>" alt="Clear"/></button>
		<button id="btn-print" class="btn" data-tooltip="Open a Print Dialog"><img src="<?php print_unescaped(
		image_path('drawmyobservatory', 'print.png'));?>"alt="Print"/></button>
		<button id="btn-zoom-in" class="btn" data-tooltip="Zoom In"><img src="<?php print_unescaped(
		image_path('drawmyobservatory', 'zoomin.png'));?>" alt="Zoom in"/></button>
		<button id="btn-zoom-out" class="btn" data-tooltip="Zoom Out"><img src="<?php print_unescaped(
		image_path('drawmyobservatory', 'zoomout.png'));?>" alt="Zoom out"/></button>
		<input id="fileName" type="text" value="MarineObservation-1"/>
		<div class="panel">
		<span id="zoom-level">100</span>
		<span>%</span>
		</div>
		<button id="btn-zoom-to-fit" class="btn" data-tooltip="Zoom To Fit"><img src="<?php print_unescaped(
		image_path('drawmyobservatory', 'zoomtofit.png'));?>" alt="Zoom To Fit"/></button>
		<button id="btn-fullscreen" class="btn" data-tooltip="Toggle Fullscreen Mode"><img src="<?php print_unescaped(
		image_path('drawmyobservatory', 'fullscreen.png'));?>" alt="Fullscreen"/></button>
		<button id="btn-layout" class="btn" data-tooltip="Auto-layout Graph">layout</button>
		<label data-tooltip="Change Grid Size">Grid size:</label>
		<input type="range" value="10" min="1" max="50" step="1" id="input-gridsize" />
		<output id="output-gridsize">10</output>
		<label data-tooltip="Enable/Disable Snaplines">Snaplines:</label>
		<input type="checkbox" id="snapline-switch" checked/>
	</div>
</div>

<div class="inspector-container">
<img src="<?php print_unescaped(
image_path('drawmyobservatory', 'ifremer.png'));?>"  style="width:240px; height:100px;" />
</div>
<div class="navigator-container"></div>
<div class="statusbar-container">
<div class="status"></div>
<span class="rt-colab"></span>
</div>
<div id="dialog-box" title="Owncloud file saver">
FileName: <input type="text" id="filenameTyped"  style="width: 475px;" value=".moe" />
</div>
<div id="dialog-choice" title="Save Data to">
</div>
</div>
<?php
//Chargement des scripts
script('drawmyobservatory', 'configuration');
script('drawmyobservatory', 'modernizr-2.8.2.min');
script('drawmyobservatory', 'mustache');
script('drawmyobservatory', 'jszip-2.4.0-3.min');
script('drawmyobservatory', 'FileSaver.min');
script('drawmyobservatory', 'Blob');
script('drawmyobservatory', 'joint');
script('drawmyobservatory', 'joint.all');
script('drawmyobservatory', 'keyboard');
script('drawmyobservatory', 'inspector');
script('drawmyobservatory', 'types/Platform');
script('drawmyobservatory', 'types/Sensor');
script('drawmyobservatory', 'types/ADCP');
script('drawmyobservatory', 'types/CO2_ANALYSER');
script('drawmyobservatory', 'types/CONDUCTIVITY');
script('drawmyobservatory', 'types/CTD');
script('drawmyobservatory', 'types/CURRENT_METER');
script('drawmyobservatory', 'types/DEPTH');
script('drawmyobservatory', 'types/DO_SENSOR');
script('drawmyobservatory', 'types/FLOW_METER');
script('drawmyobservatory', 'types/FLUOROMETER');
script('drawmyobservatory', 'types/GEOPHONE');
script('drawmyobservatory', 'types/HYDROPHONE');
script('drawmyobservatory', 'types/MAGNETOMETER');
script('drawmyobservatory', 'types/MULTIPARAMETER');
script('drawmyobservatory', 'types/PAH');
script('drawmyobservatory', 'types/PAR_SENSOR');
script('drawmyobservatory', 'types/PARTICLE_SIZER');
script('drawmyobservatory', 'types/PH_SENSOR');
script('drawmyobservatory', 'types/PRESSURE_SENSOR');
script('drawmyobservatory', 'types/REDOX');
script('drawmyobservatory', 'types/SALINOMETER');
script('drawmyobservatory', 'types/SEDIMENT_TRAP');
script('drawmyobservatory', 'types/TEMPERATURE');
script('drawmyobservatory', 'types/TILTMETER');
script('drawmyobservatory', 'types/TURBIDITY');
script('drawmyobservatory', 'types/WATER_SAMPLER');
script('drawmyobservatory', 'types/ACOUSTIC_MODEM');
script('drawmyobservatory', 'types/ACOUSTIC_RELEASE');
script('drawmyobservatory', 'types/CAMERA');
script('drawmyobservatory', 'types/CONNECTOR');
script('drawmyobservatory', 'types/LOGGER');
script('drawmyobservatory', 'types/FLOAT');
script('drawmyobservatory', 'types/HOUSING');
script('drawmyobservatory', 'types/LASER');
script('drawmyobservatory', 'types/LIGHT');
script('drawmyobservatory', 'types/MOORING_SYSTEM');
script('drawmyobservatory', 'types/POSITIONING_EQUIPMENT');
script('drawmyobservatory', 'types/UNDERWATER_BATTERY');
script('drawmyobservatory', 'types/UNDERWATER_CABLE');
script('drawmyobservatory', 'types/UNDERWATER_SWITCH');
script('drawmyobservatory', 'types/IFREMER_RVESSEL');
script('drawmyobservatory', 'stencil');
script('drawmyobservatory', 'jquery');
script('drawmyobservatory', 'handlebars-v3.0.3');
script('drawmyobservatory', 'jquery-ui');
script('drawmyobservatory', 'jquery.datetimepicker');
script('drawmyobservatory', 'main');
script('drawmyobservatory', 'drawmyobservatory')
?>