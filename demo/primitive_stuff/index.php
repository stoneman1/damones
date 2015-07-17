<?php
	$debug = true;
	$showcontrols = true;
	$length_in_sec = 328; // 5min 28sec
	$demo_song = "30sec";
	$demo_loop = true;
	$demo_loop_begin = 15000;
	$demo_loop_end = 15000 + 1000 * 312;
	$demo_overlay = imageName;
	
	$demo_name = "Asm2015";
	$demo_description = "is";
	$part_dir = '/parts/';

	$demo_part_order = array(
		$part_dir.'particleswithpostpro.js'
	);
	
	

	require_once("../../engine_base.php");
?>
