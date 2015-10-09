<?php
$form_rule = array(
      'cssSelector' => '#form',
      'rules' => array(
          'user' => array(
              'required' => true,
              'email' => true,
              '_msg' => '',
          ),
      ),
      'beforeSubmit'  => 'test',
      'success' => 'test',
);