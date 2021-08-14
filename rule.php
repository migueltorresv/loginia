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
 * Implementaton of the quizaccess_loginia plugin.
 *
 * @package   quizaccess_loginia
 * @copyright 2021, Miguel Torres <migueltorres.mtv@gmail.com>
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */


defined('MOODLE_INTERNAL') || die();

require_once($CFG->dirroot . '/mod/quiz/accessrule/accessrulebase.php');


/**
 * A rule requiring the student to promise not to cheat.
 *
 * @copyright  2011 The Open University
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class quizaccess_loginia extends quiz_access_rule_base {
    
    public function is_preflight_check_required($attemptid) {
        return empty($attemptid);
    }

    public function add_preflight_check_form_fields(mod_quiz_preflight_check_form $quizform,
            MoodleQuickForm $mform, $attemptid) {
        global $PAGE, $USER, $DB;
        $usersession = $USER->firstname . " " . $USER->lastname;
        $folderaddress = $DB->get_record('quizaccess_loginia', array('quizid' => $this->quiz->id), 'loginiafolderrequired');
        $PAGE->requires->js("/mod/quiz/accessrule/loginia/face-api.min.js", true);
        $PAGE->requires->js_call_amd('quizaccess_loginia/miscript', 'init',array($usersession, $folderaddress->loginiafolderrequired));


        $mform->addElement('header', 'loginiaheader',
                get_string('loginiaheader', 'quizaccess_loginia'));
        $mform->addElement('static', 'loginiamessage', '',
                get_string('loginiastatement', 'quizaccess_loginia'));
        $mform->addElement('static', 'loginiacammessage', '',
                get_string('loginiacamhtml', 'quizaccess_loginia'));
        $mform->addElement('static', 'loginiapercent', 'Similitud',
                get_string('loginiapercent', 'quizaccess_loginia'));
        $mform->addElement('text', 'loginiamessagetext', 
                get_string('loginiamessagetext', 'quizaccess_loginia'), 'readonly="readonly"');
        $mform->setType('loginiamessagetext', PARAM_NOTAGS);
    }

    public function validate_preflight_check($data, $files, $errors, $attemptid) {
        $userforrekog = $data['loginiamessagetext'];
        global $USER;
        $usersession = $USER->firstname . " " . $USER->lastname;
        

        if (strcmp($usersession, $userforrekog) === 0) {
            return $errors; // Password is OK.
        } else {
            $errors['loginiamessagetext'] = get_string('loginiamatchrror', 'quizaccess_loginia');
        }

        return $errors;
    }

    public static function make(quiz $quizobj, $timenow, $canignoretimelimits) {

        if (empty($quizobj->get_quiz()->loginiarequired)) {
            return null;
        }

        return new self($quizobj, $timenow);
    }

    public static function add_settings_form_fields(
            mod_quiz_mod_form $quizform, MoodleQuickForm $mform) {
        $mform->addElement('select', 'loginiarequired',
                get_string('loginiarequired', 'quizaccess_loginia'),
                array(
                    0 => get_string('notrequired', 'quizaccess_loginia'),
                    1 => get_string('loginiarequiredoption', 'quizaccess_loginia'),
                ));
        $mform->addHelpButton('loginiarequired', 'loginiarequired', 'quizaccess_loginia');
        $mform->addElement('text', 'loginiafolderrequired', 
                get_string('loginiafolderrequired', 'quizaccess_loginia'));
        $mform->setType('loginiafolderrequired', PARAM_NOTAGS);
    }

    public static function validate_settings_form_fields(array $errors,
            array $data, $files, mod_quiz_mod_form $quizform) {
            if(!empty($data['loginiarequired'])) {
                if(!empty($data['loginiafolderrequired'])) {
                    return $errors; // is OK.
                }
                else {
                    $errors['loginiafolderrequired'] = get_string('loginiafoldererror', 'quizaccess_loginia');
                }
            }
        return $errors;
    }

    public static function save_settings($quiz) {
        global $DB;
        if (empty($quiz->loginiarequired)) {
            $DB->delete_records('quizaccess_loginia', array('quizid' => $quiz->id));
        } else {
            if (!$DB->record_exists('quizaccess_loginia', array('quizid' => $quiz->id))) {
                $record = new stdClass();
                $record->quizid = $quiz->id;
                $record->loginiarequired = 1;
                $record->loginiafolderrequired = $quiz->loginiafolderrequired;
                $DB->insert_record('quizaccess_loginia', $record);
            }
        }
    }

    public static function delete_settings($quiz) {
        global $DB;
        $DB->delete_records('quizaccess_loginia', array('quizid' => $quiz->id));
    }

    public static function get_settings_sql($quizid) {
        return array(
            'loginiarequired',
            'LEFT JOIN {quizaccess_loginia} loginia ON loginia.quizid = quiz.id',
            array());
    }

    /*public function description() {
        global $PAGE;
        $PAGE->requires->js_call_amd('quizaccess_loginia/miscript', 'init',array());
        
    }*/

    public function setup_attempt_page($page) {
        global $PAGE, $USER;
        $usersession = $USER->firstname . " " . $USER->lastname;
        /*$PAGE->requires->css('/mod/quiz/accessrule/loginia/estilo.css');
        $PAGE->requires->js('/mod/quiz/accessrule/loginia/script2.js');
        $PAGE->requires->js("/mod/quiz/accessrule/loginia/face-api.min.js", true);*/
        $PAGE->requires->js("/mod/quiz/accessrule/loginia/face-api.min.js", true);
        $PAGE->requires->js_call_amd('quizaccess_loginia/miscript', 'setup',array($usersession));
    }
    
}
