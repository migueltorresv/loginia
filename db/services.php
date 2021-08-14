<?php
// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * Services for the quizaccess_loginia plugin.
 *
 * @package    quizaccess_loginia
 * @copyright  2021, Miguel Torres <migueltorres.mtv@gmail.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */


defined('MOODLE_INTERNAL') || die;

$functions = array(
    'quizaccess_loginia_send_camshot' => array(
        'classname' => 'quizaccess_loginia_external',
        'methodname' => 'send_camshot',
        'description' => 'Send a camera snapshot on the given session.',
        'type' => 'write',
        'ajax'        => true,
        'capabilities' => 'quizaccess/loginia:sendcamshot',
        'services'      => array(MOODLE_OFFICIAL_MOBILE_SERVICE)
    ),
    'quizaccess_loginia_get_camshots' => array(
        'classname' => 'quizaccess_loginia_external',
        'methodname' => 'get_camshots',
        'description' => 'Get the list of camera snapshots in the given session.',
        'type' => 'read',
        'ajax'        => true,
        'capabilities' => 'quizaccess/loginia:getcamshots',
        'services'      => array(MOODLE_OFFICIAL_MOBILE_SERVICE)
    ),
);


