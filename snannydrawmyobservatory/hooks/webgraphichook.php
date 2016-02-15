<?php 
/**
* @author Arnaud Thorel
* This class allow contains all hooks
*
*/
namespace OCA\SnannyDrawMyObservatory\Hooks;

use OCP\Util;

class WebGraphicHook{

	public static function connectHooks(){
		//Si la version d'owncloud est suffisante chargement uniquement dans les cas nécessaires
		if(method_exists(\OC::$server, 'getEventDispatcher')){
			$eventDispatcher = \OC::$server->getEventDispatcher();
			$eventDispatcher->addListener('OCA\Files::loadAdditionalScripts', 
				['OCA\SnannyDrawMyObservatory\Hooks\WebGraphicHook', "onLoadFilesAppScripts"]);
		}else{
			//Sinon chargement indifférent du script js
			onLoadFilesAppScripts();
		}
	}


	/**
	* Load additional scripts when the files app is visible
	*/
	public static function onLoadFilesAppScripts() {
		Util::addScript('snannydrawmyobservatory', 'oc/files_dashboard');
		Util::addStyle('snannydrawmyobservatory', 'oc/files_dashboard');
		
	}
}