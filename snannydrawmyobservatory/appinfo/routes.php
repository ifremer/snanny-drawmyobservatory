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
 * e.g. page#index -> OCA\snannydrawmyobservatory\Controller\PageController->index()
 *
 * The controller class has to be registered in the application.php file since
 * it's instantiated in there
 */

return [
    'routes' => [
	   ['name' => 'page#index', 'url' => '/', 'verb' => 'GET'],
	   ['name' => 'page#save', 'url' => '/save', 'verb' => 'POST'],
	   ['name' => 'page#get', 'url'=>'/get', 'verb'=>'GET'],
	   ['name' => 'page#getPreferences', 'url'=>'/preferences/get', 'verb'=>'GET'],
	   ['name' => 'page#savePreferences', 'url'=>'/preferences/save', 'verb'=>'POST'],
	   ['name' => 'page#getModel', 'url'=>'/model/{name}', 'verb'=>'GET']
    ]
];