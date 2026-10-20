<?php
declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, max-age=0');
header('X-Content-Type-Options: nosniff');
header('Access-Control-Allow-Origin: https://agronom-ryadom.ru');
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {http_response_code(405);header('Allow: POST');echo json_encode(['error'=>'method_not_allowed']);exit;}
$dir=__DIR__.'/.site-data';
if (!is_dir($dir) && !@mkdir($dir,0700,true) && !is_dir($dir)) {http_response_code(503);echo '{"error":"storage_unavailable"}';exit;}
$file=$dir.'/views.json';
$fp=@fopen($file,'c+');
if (!$fp || !flock($fp,LOCK_EX)) {http_response_code(503);echo '{"error":"storage_unavailable"}';exit;}
$raw=stream_get_contents($fp);
$data=json_decode($raw?:'{}',true);
if (!is_array($data)) $data=[];
$total=max(0,(int)($data['total']??0))+1;
$today=gmdate('Y-m-d');
$todayCount=($data['date']??'')===$today?max(0,(int)($data['today']??0))+1:1;
rewind($fp);ftruncate($fp,0);fwrite($fp,json_encode(['total'=>$total,'date'=>$today,'today'=>$todayCount],JSON_UNESCAPED_UNICODE));fflush($fp);flock($fp,LOCK_UN);fclose($fp);
echo json_encode(['total'=>$total,'today'=>$todayCount],JSON_UNESCAPED_UNICODE);
