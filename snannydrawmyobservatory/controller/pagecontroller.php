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

use OC\AppFramework\Http;
use OC\Files\Filesystem;
use OC\Share\Share;
use OCA\SnannyDrawMyObservatory\Util\ScriptUtil;
use OCP\AppFramework\Controller;
use OCP\AppFramework\Http\JSONResponse;
use OCP\AppFramework\Http\TemplateResponse;
use OCP\IRequest;
use OCP\IDb;

class PageController extends Controller
{
    const SENSOR_NANNY_DRAW_ITEM = '.sensorNannyDraw';

    const DRAWMYOBSERVATORY_DIR = '.drawmyobservatory';

    public function __construct($AppName, IRequest $request, $UserId)
    {
        parent::__construct($AppName, $request);
    }

    /**
     * Display index page
     * @NoAdminRequired
     * @NoCSRFRequired
     */
    public function index()
    {
        \OC_Util::addVendorScript('core', 'jquery-migrate/jquery-migrate.min');


        ScriptUtil::loadStyles('core',
            array('icons'));

        ScriptUtil::loadStyles($this->appName,
            array('dropDownButton', 'layout', 'paper',
                'navigator', 'stencil', 'halo', 'selection',
                'toolbar', 'statusbar', 'freetransform',
                'style', 'preLoading', 'oc/oc_drawmyobservatory'));

        ScriptUtil::loadVendorStyles($this->appName,
            array('jquery.datetimepicker', 'joint.all', 'inspector'));

        ScriptUtil::loadScripts($this->appName,
            array('vendor/modernizr-2.8.2.min',
                'vendor/mustache.min', 'vendor/jszip-2.4.0-3.min', 'vendor/FileSaver.min',
                'vendor/Blob', 'vendor/joint', 'vendor/joint.all',  'inspector', 'FuzzySearch.min')
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
            'oc/files_save', 'oc/browser', 'oc/templateutil', 'oc/smldateformat', 'oc/smlvalidator', 'oc/smlgenerator', 'oc/preference','stencil', 'oc/tooltip'));


       
	/** JQUERY modules, beware of the order, general jquery first **/
	//\OC_Util::addVendorScript('core', 'jquery/jquery');        
        \OC_Util::addVendorScript('core', 'jquery-ui/ui/jquery-ui.custom');
        \OC_Util::addVendorScript('core', 'jquery-ui/ui/jquery-ui.custom'); 
        \OCP\Util::addScript('core', 'placeholder'); 
        \OCP\Util::addScript('core', 'jquery.avatar');              
        \OCP\Util::addScript('core', 'jquery.ocdialog');         
        \OCP\Util::addScript('core', 'octemplate');
        \OC_Util::addScript($this->appName, 'vendor/jquery.datetimepicker.full.min');
        \OC_Util::addVendorScript('core', 'handlebars/handlebars');

        return new TemplateResponse($this->appName, 'main', []);
    }


    /**
     * Simply method that get filecontents (no file locking)
     * @NoAdminRequired
     * @NoCSRFRequired
     */
    public function get($dir, $file)
    {
        \OCP\User::checkLoggedIn();
        \OC::$server->getSession()->close();

        $files_list = json_decode($file);
        if(!is_array($files_list)) {
            $files_list = array($file);
        }

        \OC_Files::get($dir, $files_list, $_SERVER['REQUEST_METHOD'] == 'HEAD');
    }

    /**
     * save the element
     * @NoAdminRequired
     * @NoCSRFRequired
     */
    public function save($graphic, $cells, $smls, $filename, $dir)
    {
        if($dir === null){
            $dir="";
        }
        if(Filesystem::file_exists($dir)){
            $baseName = pathinfo($filename)['filename'];


            $moeFileName = $baseName.'.moe';
            $tarFileName = $baseName.'.tar';
            $tmpTarFileName = $baseName.'.tmp';


            //Get current dir for tmp tar
            $currentDir = \OC::$server->getConfig()->getSystemValue('datadirectory', \OC::$SERVERROOT . '/data/').\OC::$server->getUserFolder()->getFullPath($dir).'/';

            $fileNames = array();

            if(strstr($filename, 'png')) {
                $path = $dir . '/' . $filename;
            } else {
                $path = $dir . '/' . $moeFileName;
            }
            Filesystem::file_put_contents($path, $graphic);
            if($smls) {
                // List of smls
                $smlToSave = json_decode($smls, true);

                $tarFile = new \PharData($currentDir . '/' . $tmpTarFileName);
                if ($smlToSave) {
                    foreach ($smlToSave as $sml) {
                        $fileNames[] = $sml['filename'];
                        $tarFile->addFromString($sml['filename'], $sml['data']);
                    }
                }
                Filesystem::getView()->fromTmpFile($currentDir . '/' . $tmpTarFileName, $dir . '/' . $tarFileName);
            }

            if($cells) {
                //Set exports
                $cellsArr = json_decode($cells, true);
                //Export cells
                Filesystem::getView()->mkdir(self::DRAWMYOBSERVATORY_DIR);
                foreach ($cellsArr as $cell) {
                    $exported = self::DRAWMYOBSERVATORY_DIR . '/' . $cell['attrs']['text']['text'] . '.moe';
                    Filesystem::file_put_contents($exported, '{"cells":' . json_encode($cell) . '}');
                    $fileNames[] = $exported;
                }
            }

            if (Filesystem::file_exists($path)) {
                return new JSONResponse(['status' => 'success', 'filename' => $filename, 'dir' => $dir, 'tarFile'=>$tarFileName, 'path' => $path, 'filenames'=>$fileNames, 'pathInfo'=>pathinfo($filename)]);
            }
            return new JSONResponse(['status' => 'error', 'message' => 'An error occured : unable to write file ' . $path . '. Please contact your administrator']);
        }
        return new JSONResponse(['status' => 'error', 'message' => 'An error occured : folder '.$dir.' doesn\'t exist. Please contact your administrator']);
    }



    /**
     * save the preferences
     * @NoAdminRequired
     * @NoCSRFRequired
     */
    public function savePreferences($preferences)
    {
        Filesystem::getView()->mkdir(self::DRAWMYOBSERVATORY_DIR);
        Filesystem::file_put_contents(self::DRAWMYOBSERVATORY_DIR.'/'.self::SENSOR_NANNY_DRAW_ITEM, json_encode($preferences));
        return new JSONResponse(['status' => 'success', 'saved'=>$preferences]);
    }

    /**
     * get the preferences
     * @NoAdminRequired
     * @NoCSRFRequired
     */
    public function getPreferences($file)
    {
        $currentUser = \OCP\User::getDisplayName();

        if($file) {
            $share = \OC::$server->getDatabaseConnection()->executeQuery('SELECT * FROM *PREFIX*share WHERE file_target LIKE ?', array('%' . $file));
            while ($row = $share->fetch()) {
                if ($row != null && $currentUser == $row['share_with']) {
                    $permission = $row['permissions'];
                }
            }
        }

        $drawPath = self::DRAWMYOBSERVATORY_DIR.'/'.self::SENSOR_NANNY_DRAW_ITEM;
        if (Filesystem::file_exists(self::DRAWMYOBSERVATORY_DIR.'/'.self::SENSOR_NANNY_DRAW_ITEM)) {


            //Get the file without using file locking
            $urn = \OC::$server->getConfig()->getSystemValue('datadirectory', \OC::$SERVERROOT . '/data/') . \OC::$server->getUserFolder()->getFullPath(self::DRAWMYOBSERVATORY_DIR.'/');
            $files = scandir($urn);
            $result = array();
            foreach ($files as $key => $value) {
                if(strrpos($value, '.moe') === strlen($value)-4){
                        array_push($result,  $value);
                }
            }
            return new JSONResponse(array('prefs' => $result, 'permission' => intval($permission)));
            
        }
        return new JSONResponse(array('msg' => 'not found!', 'permission' => intval($permission)), Http::STATUS_NOT_FOUND);
    }


    /**
     * get the preferences
     * @NoAdminRequired
     * @NoCSRFRequired
     */
    public function getModel($name)
    {
        $drawPath = self::DRAWMYOBSERVATORY_DIR.'/'.$name;
        if (Filesystem::file_exists(self::DRAWMYOBSERVATORY_DIR.'/'.self::SENSOR_NANNY_DRAW_ITEM)) {


            //Get the file without using file locking
            $urn = \OC::$server->getConfig()->getSystemValue('datadirectory', \OC::$SERVERROOT . '/data/') . \OC::$server->getUserFolder()->getFullPath($drawPath);
            if (file_exists($urn)) {
                return new JSONResponse($this->read($urn));
            }
        }
        return new JSONResponse(array('msg' => 'not found!'), Http::STATUS_NOT_FOUND);
    }

    public function read($urn){
        $filecontents = file_get_contents($urn);
        $encoding = mb_detect_encoding($filecontents . "a", "UTF-8, WINDOWS-1252, ISO-8859-15, ISO-8859-1, ASCII", true);
        if ($encoding == "") {
            $encoding = 'ISO-8859-15';
        }
        return iconv($encoding, "UTF-8", $filecontents);
    }
}
