<?php 
/**
* @author Arnaud Thorel
* This class allow contains all hooks
*
*/
namespace OCA\DrawMyObservatory\Hooks;

use OCP\Util;

class WebGraphicHook{

	public static function connectHooks(){
		$eventDispatcher = \OC::$server->getEventDispatcher();
		$eventDispatcher->addListener('OCA\Files::loadAdditionalScripts', 
			['OCA\DrawMyObservatory\Hooks\WebGraphicHook', 'onLoadFilesAppScripts']);
	}


	/**
	* Load additional scripts when the files app is visible
	*/
	public static function onLoadFilesAppScripts() {
		Util::addScript('drawmyobservatory', 'files_dashboard');
		Util::addScript('drawmyobservatory', 'configuration');
	}
}