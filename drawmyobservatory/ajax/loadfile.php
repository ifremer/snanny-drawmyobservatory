<?php
/**
 * @author Tom Needham
 * @copyright 2011 Tom Needham contact@tomneedham.com
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
$dir = isset($_GET['dir']) ? $_GET['dir'] : '';
$filename = isset($_GET['file']) ? $_GET['file'] : '';
if(!empty($filename))
{
	$path = $dir.'/'.$filename;;
	
	$user=\OCP\User::getUser();


	OCP\JSON::success(array('data' => array('user'=> $user)));
} else {
	OCP\JSON::error(array('data' => array( 'message' => 'Invalid file path supplied.')));
}