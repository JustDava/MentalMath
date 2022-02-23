<?php

    $request = $_GET['full_name'];

    $full_name = explode(' ', $request);

    $first_name = $full_name[0];
    $last_name = $full_name[1];

    $json_array = array();
    $link  =  mysqli_connect( 'localhost',  "root",  '',  'mental_math' );
    if (  !$link  )   die("Error");

    $query   =  "SELECT id, first_name, last_name, activity_time, first_exercisebook_wrong_answers, first_exercisebook_right_answers, second_exercisebook_wrong_answers, second_exercisebook_right_answers,third_exercisebook_wrong_answers, third_exercisebook_right_answers FROM mobileapp_student_statistics WHERE first_name = '$first_name' AND last_name = '$last_name'";

    $result  =  mysqli_query( $link,  $query );
    

    while (  $row  =  mysqli_fetch_row($result)  )
    {
        $json_array[] = $row;
    }

    echo json_encode($json_array);

    mysqli_close( $link );

?>