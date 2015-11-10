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
		//Si la version d'owncloud est suffisante chargement uniquement dans les cas nécessaires
		if(method_exists(\OC::$server, 'getEventDispatcher')){
			$eventDispatcher = \OC::$server->getEventDispatcher();
			$eventDispatcher->addListener('OCA\Files::loadAdditionalScripts', 
				['OCA\DrawMyObservatory\Hooks\WebGraphicHook', "onLoadFilesAppScripts"]);
		}else{
			//Sinon chargement indifférent du script js
			onLoadFilesAppScripts();
		}
	}


	/**
	* Load additional scripts when the files app is visible
	*/
	public static function onLoadFilesAppScripts() {
		Util::addScript('drawmyobservatory', 'files_dashboard');
	}
}