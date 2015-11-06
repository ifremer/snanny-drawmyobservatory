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

namespace OCA\DrawMyObservatory\Controller;

use OCP\IRequest;
use OCP\AppFramework\Http\TemplateResponse;
use OCP\AppFramework\Http\DataResponse;
use OCP\AppFramework\Controller;

class PageController extends Controller {


	private $userId;

	public function __construct($AppName, IRequest $request, $UserId){
		parent::__construct($AppName, $request);
		$this->userId = $UserId;
	}

	/**
	 * CAUTION: the @Stuff turns off security checks; for this page no admin is
	 *          required and no CSRF check. If you don't know what CSRF is, read
	 *          it up in the docs or you might create a security hole. This is
	 *          basically the only required method to add this exemption, don't
	 *          add it to any other method if you don't exactly know what it does
	 *
	 * @NoAdminRequired
	 * @NoCSRFRequired
	 */
	public function index() {
		$params = ['user' => $this->userId];
		return new TemplateResponse('drawmyobservatory', 'main', $params);  // templates/main.php
	}

	
	/**
	 * Simply method that posts back the payload of the request
	 * @NoAdminRequired
	 */
	public function filecontents($dir, $file, $user) {
		echo "search ".$dir."/".$file;
		if(!empty($file))
		{
			$path="./data//".$user."/files".$dir.'/'.$file;
			$filecontents =  file_get_contents($path);
			
			$encoding = mb_detect_encoding($filecontents."a", "UTF-8, WINDOWS-1252, ISO-8859-15, ISO-8859-1, ASCII", true);
			if ($encoding == "") {
					// set default encoding if it couldn't be detected
					$encoding = 'ISO-8859-15';
				}
				$filecontents = iconv($encoding, "UTF-8", $filecontents);
				return new JSONResponse((['data' => [
						'filecontents' => $filecontents,
						'user'=> $user
						]
					]
				),200);
			} else {
				return new JSONResponse(['data' => ['message' => 'Invalid file path supplied.']], 200);
			}
	}


}