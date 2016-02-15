<?php
/**
 * ownCloud - files_texteditor
 *
 * @author Tom Needham 
 * @copyright 2013 Tom Needham tom@owncloud.com
 * 
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU AFFERO GENERAL PUBLIC LICENSE
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU AFFERO GENERAL PUBLIC LICENSE for more details.
 *
 * You should have received a copy of the GNU Affero General Public
 * License along with this library.  If not, see <http://www.gnu.org/licenses/>.
 *@Modified by Hamza Azelmat for Ifremer.fr 
 */
$filecontents = $_POST['filecontents'];
$filename=$_POST['filename'];
$dir=$_POST['dir'];
$path = $dir.'/'.$filename;
$filemtime = \OC\Files\Filesystem::filemtime($path);

// File same as when opened, save file
$filecontents = iconv(mb_detect_encoding($filecontents), "UTF-8", $filecontents);
\OC\Files\Filesystem::file_put_contents($path, $filecontents);
// Clear statcache
clearstatcache();
// Get new mtime
$newmtime = \OC\Files\Filesystem::filemtime($path);
$newsize = \OC\Files\Filesystem::filesize($path);
OCP\JSON::success(array('data' => array('mtime' => $newmtime, 'size' => $newsize, 'path'=> $path)));