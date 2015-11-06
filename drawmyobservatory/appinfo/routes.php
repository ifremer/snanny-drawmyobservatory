<?php
/**
 * ownCloud - drawmyobservatory
 *
 * This file is licensed under the Affero General Public License version 3 or
 * later. See the COPYING file.
 *
 * @author athorel <athorel@asi.fr>
 * @copyright athorel 2015
 */

/**
 * Create your routes in here. The name is the lowercase name of the controller
 * without the controller part, the stuff after the hash is the method.
 * e.g. page#index -> OCA\drawmyobservatory\Controller\PageController->index()
 *
 * The controller class has to be registered in the application.php file since
 * it's instantiated in there
 */
$this->create('DrawMyObservatory_load', '/ajax/loadfile.php')
	->actionInclude('drawmyobservatory/ajax/loadfile.php');
$this->create('DrawMyObservatory_save', 'ajax/savefile.php')
	->actionInclude('drawmyobservatory/ajax/savefile.php');
$this->create('DrawMyObservatory_filecontents', 'ajax/filecontents.php')
	->actionInclude('drawmyobservatory/ajax/filecontents.php');


return [
    'routes' => [
	   ['name' => 'page#index', 'url' => '/', 'verb' => 'GET']
    ]
];