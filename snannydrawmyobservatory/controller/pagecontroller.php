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

namespace OCA\SnannyDrawMyObservatory\Controller;

use OC\Files\Filesystem;
use OCA\SnannyDrawMyObservatory\Util\ScriptUtil;
use OCP\AppFramework\Controller;
use OCP\AppFramework\Http\JSONResponse;
use OCP\AppFramework\Http\TemplateResponse;
use OCP\IRequest;

class PageController extends Controller
{


    private $userId;

    public function __construct($AppName, IRequest $request, $UserId)
    {
        parent::__construct($AppName, $request);
        $this->userId = $UserId;
    }

    /**
     * @NoAdminRequired
     * @NoCSRFRequired
     */
    public function index()
    {
        $params = ['user' => $this->userId];

        \OC_Util::addVendorScript('core', 'jquery-migrate/jquery-migrate.min');

        ScriptUtil::loadStyles('core',
            array('icons'));

        ScriptUtil::loadStyles($this->appName,
            array('dropDownButton', 'layout', 'paper',
                'navigator', 'stencil', 'halo', 'selection',
                'toolbar', 'statusbar', 'freetransform',
                'style', 'preLoading', 'oc/oc_drawmyobservatory'));

        ScriptUtil::loadVendorStyles($this->appName,
            array('joint.all', 'inspector'));

        ScriptUtil::loadScripts($this->appName,
            array('vendor/handlebars-v3.0.3', 'vendor/modernizr-2.8.2.min',
                'vendor/mustache.min', 'vendor/jszip-2.4.0-3.min', 'vendor/FileSaver.min',
                'vendor/Blob', 'vendor/joint', 'vendor/joint.all', 'inspector',)
        );

        ScriptUtil::loadScriptsFromRep($this->appName, 'types',
            array(
                'Platform', 'Sensor', 'ADCP', 'CO2_ANALYSER', 'CONDUCTIVITY',
                'CTD', 'CURRENT_METER', 'DEPTH', 'DO_SENSOR', 'FLOW_METER',
                'FLUOROMETER', 'GEOPHONE', 'HYDROPHONE', 'MAGNETOMETER',
                'MULTIPARAMETER', 'PAH', 'PAR_SENSOR', 'PARTICLE_SIZER',
                'PH_SENSOR', 'PRESSURE_SENSOR', 'REDOX', 'SALINOMETER',
                'SEDIMENT_TRAP', 'TEMPERATURE', 'TILTMETER', 'TURBIDITY',
                'WATER_SAMPLER', 'ACOUSTIC_MODEM', 'ACOUSTIC_RELEASE',
                'CAMERA', 'CONNECTOR', 'LOGGER', 'FLOAT', 'HOUSING', 'LASER',
                'LIGHT', 'MOORING_SYSTEM', 'POSITIONING_EQUIPMENT',
                'UNDERWATER_BATTERY', 'UNDERWATER_CABLE', 'UNDERWATER_SWITCH',
                'IFREMER_RVESSEL'
            ));

        ScriptUtil::loadScripts($this->appName, array('configuration', 'main',
            'drawmyobservatory', 'keyboard',
            'oc/files_save', 'oc/browser', 'oc/templateutil', 'stencil'));


        \OCP\Util::addScript('core', 'placeholder');
        \OCP\Util::addScript('core', 'jquery.avatar');
        \OCP\Util::addScript('core', 'octemplate');

        \OC_Util::addVendorScript('core', 'jquery-ui/ui/jquery-ui.custom');
        \OCP\Util::addScript('core', 'jquery.ocdialog');

        return new TemplateResponse($this->appName, 'main', $params);
    }


    /**
     * Simply method that posts back the payload of the request
     * @NoAdminRequired
     */
    public function filecontents($dir, $file, $user)
    {
        echo "search " . $dir . "/" . $file;
        if (!empty($file)) {
            $path = "./data//" . $user . "/files" . $dir . '/' . $file;
            $filecontents = file_get_contents($path);

            $encoding = mb_detect_encoding($filecontents . "a", "UTF-8, WINDOWS-1252, ISO-8859-15, ISO-8859-1, ASCII", true);
            if ($encoding == "") {
                // set default encoding if it couldn't be detected
                $encoding = 'ISO-8859-15';
            }
            $filecontents = iconv($encoding, "UTF-8", $filecontents);
            return new JSONResponse((['data' => [
                'filecontents' => $filecontents,
                'user' => $user
            ]
            ]
            ), 200);
        } else {
            return new JSONResponse(['data' => ['message' => 'Invalid file path supplied.']], 200);
        }
    }

    /**
     * @NoAdminRequired
     * @NoCSRFRequired
     */
    public function save($graphic, $cell, $filename, $dir)
    {
       
        //Filesystem::file_put_contents($dir.$filename, $graphic);
        //var_dump($folder);
        return new JSONResponse(array('status' => 'error', 'message' => 'not saved', 'values'=>$folder));
    }


}