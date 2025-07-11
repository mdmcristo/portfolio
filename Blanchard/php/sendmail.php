<?php
//Import PHPMailer classes into the global namespace
//These must be at the top of your script, not inside a function
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

//Load Composer's autoloader
require '../vendor/autoload.php';

//Create an instance; passing `true` enables exceptions
$mail = new PHPMailer(true);
$mail->CharSet = 'utf-8';

$name = $_POST['user_name'];
$phone = $_POST['user_phone'];

try {
  //Server settings
  // $mail->SMTPDebug = 0;                                       //Enable verbose debug output
  $mail->isSMTP();                                            //Send using SMTP
  $mail->Host       = 'smtp.timeweb.ru';                        //Set the SMTP server to send through
  $mail->SMTPAuth   = true;                                   //Enable SMTP authentication
  $mail->Username   = 'ebogoba@cx90278.tw1.ru';                //SMTP username
  $mail->Password   = 'p9DXYn4F';                         //SMTP password
  $mail->SMTPSecure = 'tls';                                  //Enable implicit TLS encryption
//   $mail->SMTPOptions = array(
//     'ssl' => array(
//       'verify_peer' => false,
//       'verify_peer_name' => false,
//       'allow_self_signed' => true
//     )
//   );
  $mail->Port       = 2525;                                    //TCP port to connect to; use 587 if you have set `SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS`

  //Recipients
  $mail->setFrom('ebogoba@cx90278.tw1.ru');
  $mail->addAddress('dmitry_musaev@mail.ru');                 //Add a recipient
  // $mail->addAddress('ellen@example.com');                  //Name is optional
  // $mail->addReplyTo('info@example.com', 'Information');
  // $mail->addCC('cc@example.com');
  // $mail->addBCC('bcc@example.com');

  //Attachments
  // $mail->addAttachment('/var/tmp/file.tar.gz');               //Add attachments
  // $mail->addAttachment('/tmp/image.jpg', 'new.jpg');          //Optional name

  //Content
  $mail->isHTML(true);                                        //Set email format to HTML
  $mail->Subject = 'Заявка с сайта Blanchard';
  $mail->Body    = '' . $name . ' оставил заявку<br> Его телефон ' . $phone;
  $mail->AltBody = '';

  $mail->send();
  echo 'Message has been sent';
} catch (Exception $e) {
  echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
}