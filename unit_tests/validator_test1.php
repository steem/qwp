<?php
$form_rule = array(
      'selector' => '#form',
      'rules' => array(
          'user' => array(
              'required' => true,
              'email' => true,
              '_msg' => '',
          ),
          'pwd' => array(
              'required' => true,
              'rangelength' => array(6, 32),
          ),
          'pwd1' => array(
              'required' => true,
              'equalTo' => array('#pwd1', 'pwd'),
          ),
          'url' => array(
              'required' => true,
              'url' => true,
          ),
          'd1' => array(
              'required' => true,
              'date' => true,
          ),
          'd2' => array(
              'required' => true,
              'datetime' => true,
          ),
          'age' => array(
              'required' => true,
              'range' => array(18, 100),
          ),
      ),
      'beforeSubmit'  => 'test',
      'success' => 'test',
);