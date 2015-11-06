<?php
/**
 * @author  Hamza Azelmat
 */
header('Access-Control-Allow-Origin: localhost');  
// Set the session key for the file we are about to edit.
$dir = isset($_GET['dir']) ? $_GET['dir'] : '';
$filename = isset($_GET['file']) ? $_GET['file'] : '';
$user = isset($_GET['user'])?$_GET['user']:'';
if(!empty($filename))
{
	$path="./data//".$user."/files".$dir.'/'.$filename;	
	$filecontents =  file_get_contents($path);
	$encoding = mb_detect_encoding($filecontents."a", "UTF-8, WINDOWS-1252, ISO-8859-15, ISO-8859-1, ASCII", true);
	if ($encoding == "") {
		// set default encoding if it couldn't be detected
		$encoding = 'ISO-8859-15';
	}
	$filecontents = iconv($encoding, "UTF-8", $filecontents);
	OCP\JSON::success(array('data' => array(
		'filecontents' => $filecontents,
		
		'user'=> $user
		)
		
		)
	);
} else {
	OCP\JSON::error(array('data' => array( 'message' => 'Invalid file path supplied.')));
}