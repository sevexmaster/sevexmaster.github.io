<?php 
    $secretaria = json_encode(array(
        array( "label" => "Secretaria Geral", "title" => true),
        array( "u" => "secretary/student/write-student",  "label" => "Escrever alunos")
    ));

    $academico = json_encode(array(
        array( "label" => "Serviços academicos", "title" => true)
    ));

    $company = json_encode(array(
        array( "icon" => 'icon-shopping-cart', "label" => "Administração", "title" => true),
        array( "icon" => 'icon-shopping-cart', "u" => hostname."company/user",  "label" => "Gestão de Utilizadores"),
        array( "icon" => 'icon-shopping-cart', "u" => "secretary/student/write-student",  "label" => "Perfis e Permissões"),
        array( "icon" => 'icon-shopping-cart', "u" => "secretary/student/write-student",  "label" => "Empresa e Filias"),
        array( "icon" => 'icon-shopping-cart', "u" => "secretary/student/write-student",  "label" => "Departamenros"),
        array( "icon" => 'icon-shopping-cart', "u" => "secretary/student/write-student",  "label" => "Ano Lectivo"),
        array( "icon" => 'icon-shopping-cart', "u" => "secretary/student/write-student",  "label" => "Logs")
    ));
?>