<?php

namespace OCA\SnannyDrawMyObservatory\Util;
use OCP\Util;

/**
 * Created by PhpStorm.
 * User: athorel
 * Date: 15/02/2016
 * Time: 11:36
 */
class ScriptUtil
{

    /**
     * Add full of scripts
     * @param $appName appName
     * @param $scriptsArr list of scripts
     */
    public static function loadScripts($appName, $scriptsArr){
        foreach($scriptsArr as $script){
            \OCP\Util::addScript($appName, $script);
        }
    }

    public static function loadScriptsFromRep($appName, $dir){
        $files = scandir(getcwd().'/apps/'.$appName.'/js/'.$dir);
        foreach($files as $file){
            if(basename($file, ".js") != basename($file)) {
                \OCP\Util::addScript($appName, $dir . '/' . basename($file, ".js"));
            }
        }

    }

    /**
     * Add full of styles
     * @param $appName appName
     * @param $stylesArr list of styles
     */
    public static function loadStyles($appName, $stylesArr){
        foreach($stylesArr as $style){
            \OCP\Util::addStyle($appName, $style);
        }
    }

    /**
     * Add full of styles
     * @param $appName appName
     * @param $stylesArr list of styles
     */
    public static function loadVendorStyles($appName, $stylesArr){
        foreach($stylesArr as $style){
            \OC_Util::addVendorStyle($appName, $style, true);
        }
    }
}