<?php

/* This is an example on how to log PHP errors and exceptions to JitterBug
 * It is very basic but does the job. You probably want to add some kind of
 * output to show the user. Again please see this as an example.
 *
 * requirements is PHP 5.2 or later with CURL extension
 */
 
class JitterBugErrorHandler {

    public $uri  = null;
    public $user = null;
    public $pass = null;
    
    private $_errortypes = array(
            1 => "E_ERROR",
            2 => "E_WARNING",
            4 => "E_PARSE",
            8 => "E_NOTICE",
            16 => "E_CORE_ERROR",
            32 => "E_CORE_WARNING",
            64 => "E_COMPILE_ERROR",
            128 => "E_COMPILE_WARNING",
            256 => "E_USER_ERROR",
            512 => "E_USER_WARNING",
            1024 => "E_USER_NOTICE",
            2048 => "E_STRICT",
            4096 => "E_RECOVERABLE_ERROR",
            8192 => "E_DEPRECATED",
            16384 => "E_USER_DEPRECATED",
            30719 => "E_ALL"
        );

    // disable creating instances outside of this class
    private function __construct() {}

    // call this function to register the errorhandlers
    public static function register($uri, $user = null, $pass = null) {
        $instance = new self();
        $instance->uri = $uri;
        $instance->user = $user;
        $instance->pass = $pass;
        set_error_handler(array($instance, 'handleError'));
        set_exception_handler(array($instance, 'handleException'));
    }

    // old school errors
    public function handleError($errno, $errstr, $errfile, $errline) {
        $data = array();
        $data['type'] = $this->_errortypes[$errno];
        $data['code'] = $errno;
        $data['message'] = $errstr;
        $data['file'] = $errfile;
        $data['line'] = $errline;
        $data['trace'] = debug_backtrace();
        // first two traces is errorhandler and the same as main file/line
        // doing this to make traces the same as exceptions
        array_shift($data['trace']);
        array_shift($data['trace']);
        
        // add extra info and send
        $this->_send($this->_enhance($data));
    }

    // new school exceptions
    public function handleException($e) {
        $data = array();
        $data['type'] = get_class($e);
        $data['code'] = $e->getCode();
        $data['message'] = $e->getMessage();
        $data['file'] = $e->getFile();
        $data['line'] = $e->getLine();
        $data['trace'] = $e->getTrace();
        
        // add extra info and send
        $this->_send($this->_enhance($data));
    }
    
    private function _enhance($data) {
        $data['unixtime'] = time();
        
        // build resource / application
        if(isset($_SERVER['HTTP_HOST'])) {
            $protocol = (empty($_SERVER['HTTPS'])) ? "http://" : "https://";
            $data['resource'] = $protocol . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];
            $data['application'] = $_SERVER['HTTP_HOST'];
        } else { // must be cli script then
            $data['resource'] = realpath($_SERVER['SCRIPT_FILENAME']);
            $data['application'] = "commandline";
        }
        
        // file content information
        $data['content'] = $this->_content($data['file'], $data['line']);
        $data['language'] = "php";
        
        foreach($data['trace'] as $key => $value) {
            $value['content'] = $this->_content($value['file'], $value['line']);
            $value['language'] = "php";
            $data['trace'][$key] = $value;
        }
        
        // extra data
        $data['data'] = array();
        $data['data']['$_SERVER'] = $_SERVER;
        $data['data']['$_GET'] = $_GET;
        $data['data']['$_POST'] = $_POST;
        $data['data']['$_COOKIE'] = $_COOKIE;
        
        return $data;
    }
    
    private function _content($file, $line, $before = 5, $after = 5) {
        if(!file_exists($file))
            return array();
            
        $lines = file($file);
        
        $start = $line - $before - 1;
        if($start < 1) $start = 1;
        
        $end = $line + $after - 1;
        if($end >= count($lines)) $end = count($lines) - 1;
        
        $return = array();
        for($i=$start;$i<=$end;$i++)
            $return[$i+1] = rtrim($lines[$i]);
            
        return $return;
    }
    
    private function _utf8(array $arr) {
        foreach($arr as $k => $v) {
            if (is_string($v)){
                $arr[$k] = utf8_encode($v);
            } else if(is_array($v)) {
                $arr[$k] = $this->_utf8($v);
            }
        }
        return $arr;
    }
    
    private function _send($data) {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $this->uri);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HEADER, false);
        curl_setopt($ch, CURLOPT_TIMEOUT, 2);
        curl_setopt($ch, CURLOPT_HTTPHEADER, array("Content-type: application/json"));
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($this->_utf8($data)));
        if(!is_null($this->user) && !is_null($this->pass))
            curl_setopt($ch, CURLOPT_USERPWD, $this->user.":".$this->pass);
            
        $result = curl_exec($ch);
        var_dump($result);
    }

}
 
JitterBugErrorHandler::register("http://localhost:5984/jitterbug");