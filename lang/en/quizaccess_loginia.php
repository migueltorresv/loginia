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
 * Strings for the quizaccess_loginia plugin.
 *
 * @package   quizaccess_loginia
 * @copyright 2021, Miguel Torres <migueltorres.mtv@gmail.com>
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */


defined('MOODLE_INTERNAL') || die();


$string['loginiaheader'] = 'Para continuar con el cuestionario deberías validar tu identidad usando la cámara';
$string['loginialabel'] = 'Estoy de acuerdo con el proceso de validación.';
$string['loginiarequired'] = 'Loginia: Validación de identidad por cámara';
$string['loginiarequired_help'] = 'Si tu habilitas esta opción, los estudiantes no estaran habilitados para iniciar el intento a menos que confirmen con el chekbox que conocen las políticas de Loginia.';
$string['loginiarequiredoption'] = 'debe admitirse antes de iniciar un intento';
$string['loginiastatement'] = 'Este examen requiere el proceso de validación de la cámara. Debes permitir a la cámara comparar con tu imagen almacenada <br />(Por favor permite al buscador ó navegador acceder a tu cámara).';
$string['notrequired'] = 'no requerido';
$string['pluginname'] = 'Moodle Loginia';
$string['youmustagree'] = 'Debe aceptar esta declaración antes de comenzar el cuestionario.';
$string['loginiamatchrror'] = 'La imagen de la cámara no coincide con el usuario actual.';
$string['privacy:metadata'] = 'El complemento Loginia no almacena ningún dato personal.';
$string['loginiacamhtml'] = '<video id="videoInput" width="360" height="360" controls muted>Video stream no disponible.</video>';
$string['loginiapercent'] = '<input id="id_percent" type="text" value="Porcentaje" readonly="readonly">';
$string['loginiamessagetext'] = 'Usuario';
$string['loginiafolderrequired'] = 'Loginia: Ubicación de la carpeta de imágenes del salón';
$string['loginiafoldererror'] = 'La dirección de la caperta es erronea.';
