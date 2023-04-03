 drivencare-api   hljs.configure({ tabReplace: ' ', }); hljs.initHighlightingOnLoad(); body { position: relative; } h1 { margin-top: 5px; } h1, h2, h3, h4 { color: #2b2b2b; } h2:after { content: ' '; } h5 { font-weight: bold; } h1 a, h2 a, h3 a, h4 a, h5 a, h6 a { display: none; position: absolute; margin-left: 8px; } h1:hover a, h2:hover a, h3:hover a, h4:hover a, h5:hover a, h6:hover a { color: #a5a5a5; display: initial; } .nav.nav-tabs > li > a { padding-top: 4px; padding-bottom: 4px; } .tab-content { padding-top: 8px; } .table { margin-bottom: 8px; } pre { border-radius: 0px; border: none; } pre code { margin: -9.5px; } .request { margin-top: 12px; margin-bottom: 24px; } .response-text-sample { padding: 0px !important; } .response-text-sample pre { margin-bottom: 0px; } #sidebar-wrapper { z-index: 1000; position: fixed; left: 250px; width: 250px; height: 100%; margin-left: -250px; overflow-y: auto; overflow-x: hidden; background: #2b2b2b; padding-top: 20px; } #sidebar-wrapper ul { width: 250px; } #sidebar-wrapper ul li { margin-right: 10px; } #sidebar-wrapper ul li a:hover { background: inherit; text-decoration: none; } #sidebar-wrapper ul li a { display: block; color: #ECF0F1; padding: 6px 15px; } #sidebar-wrapper ul li ul { padding-left: 25px; } #sidebar-wrapper ul li ul li a { padding: 1px 0px; } #sidebar-wrapper ul li a:hover, #sidebar-wrapper ul li a:focus { color: #e0c46c; border-right: solid 1px #e0c46c; } #sidebar-wrapper ul li.active > a { color: #e0c46c; border-right: solid 3px #e0c46c; } #sidebar-wrapper ul li:not(.active) ul { display: none; } #page-content-wrapper { width: 100%; position: absolute; padding: 15px 15px 15px 250px; }

*   [General notes](#doc-general-notes)
*   [API detail](#doc-api-detail)
*   [doctors](#folder-doctors)
    *   [sign-up](#request-doctors-sign-up)
    *   [index](#request-doctors-index)
*   [user\_roles](#folder-user-roles)
    *   [show](#request-user-roles-show)
    *   [index](#request-user-roles-index)
    *   [create](#request-user-roles-create)
*   [specialties](#folder-specialties)
    *   [index](#request-specialties-index)
    *   [show](#request-specialties-show)
    *   [create](#request-specialties-create)
*   [users](#folder-users)
    *   [sign-in](#request-users-sign-in)
    *   [me](#request-users-me)
*   [patients](#folder-patients)
    *   [sign-up](#request-patients-sign-up)
    *   [index](#request-patients-index)

drivencare-api
==============

General notes[](#doc-general-notes)
-----------------------------------

API detail[](#doc-api-detail)
-----------------------------

### doctors[](#folder-doctors)

#### sign-up[](#request-doctors-sign-up)

*   [Curl](#request-doctors-sign-up-example-curl)
*   [HTTP](#request-doctors-sign-up-example-http)

    curl -X POST -d '{
        "licenseNumber": "1322-SP",
        "specialties": [
            {
                "slug": "nutritionist",
                "monthsOfExperience": 12
            }
        ],
        "name": "Kevin Alves",
        "email": "kevin.alves.dev@gmail.com",
        "password": "12345678",
        "document": "23439201002",
        "phone": "12977777378"
    }' "{{host}}/doctors/sign_up"

    POST %7B%7Bhost%7D%7D/doctors/sign_up HTTP/1.1
    Host:

    {
        "licenseNumber": "1322-SP",
        "specialties": [
            {
                "slug": "nutritionist",
                "monthsOfExperience": 12
            }
        ],
        "name": "Kevin Alves",
        "email": "kevin.alves.dev@gmail.com",
        "password": "12345678",
        "document": "23439201002",
        "phone": "12977777378"
    }

* * *

#### index[](#request-doctors-index)

*   [Curl](#request-doctors-index-example-curl)
*   [HTTP](#request-doctors-index-example-http)

    curl -X GET "{{host}}/doctors"

    GET %7B%7Bhost%7D%7D/doctors HTTP/1.1
    Host:

* * *

### user\_roles[](#folder-user-roles)

#### show[](#request-user-roles-show)

*   [Curl](#request-user-roles-show-example-curl)
*   [HTTP](#request-user-roles-show-example-http)

    curl -X GET "{{host}}/user_roles/:slug"

    GET %7B%7Bhost%7D%7D/user_roles/:slug HTTP/1.1
    Host:

* * *

#### index[](#request-user-roles-index)

*   [Curl](#request-user-roles-index-example-curl)
*   [HTTP](#request-user-roles-index-example-http)

    curl -X GET "{{host}}/user_roles"

    GET %7B%7Bhost%7D%7D/user_roles HTTP/1.1
    Host:

* * *

#### create[](#request-user-roles-create)

*   [Curl](#request-user-roles-create-example-curl)
*   [HTTP](#request-user-roles-create-example-http)

    curl -X POST -d '{
        "slug": "patient",
        "name": "Paciente"
    }' "{{host}}/user_roles"

    POST %7B%7Bhost%7D%7D/user_roles HTTP/1.1
    Host:

    {
        "slug": "patient",
        "name": "Paciente"
    }

* * *

### specialties[](#folder-specialties)

#### index[](#request-specialties-index)

*   [Curl](#request-specialties-index-example-curl)
*   [HTTP](#request-specialties-index-example-http)

    curl -X GET "{{host}}/specialties"

    GET %7B%7Bhost%7D%7D/specialties HTTP/1.1
    Host:

* * *

#### show[](#request-specialties-show)

*   [Curl](#request-specialties-show-example-curl)
*   [HTTP](#request-specialties-show-example-http)

    curl -X GET "{{host}}/specialties/:slug"

    GET %7B%7Bhost%7D%7D/specialties/:slug HTTP/1.1
    Host:

* * *

#### create[](#request-specialties-create)

*   [Curl](#request-specialties-create-example-curl)
*   [HTTP](#request-specialties-create-example-http)

    curl -X POST -d '{
        "name": "Nutricionista",
        "slug": "nutritionist"
    }' "{{host}}/specialties"

    POST %7B%7Bhost%7D%7D/specialties HTTP/1.1
    Host:

    {
        "name": "Nutricionista",
        "slug": "nutritionist"
    }

* * *

### users[](#folder-users)

#### sign-in[](#request-users-sign-in)

*   [Curl](#request-users-sign-in-example-curl)
*   [HTTP](#request-users-sign-in-example-http)

    curl -X POST -d '{
        "email": "kevin.alves.dev@gmail.com",
        "password": "12345678"
    }' "{{host}}/users/sign_in"

    POST %7B%7Bhost%7D%7D/users/sign_in HTTP/1.1
    Host:

    {
        "email": "kevin.alves.dev@gmail.com",
        "password": "12345678"
    }

* * *

#### me[](#request-users-me)

*   [Curl](#request-users-me-example-curl)
*   [HTTP](#request-users-me-example-http)

    curl -X GET "{{host}}/users/me"

    GET %7B%7Bhost%7D%7D/users/me HTTP/1.1
    Host:

* * *

### patients[](#folder-patients)

#### sign-up[](#request-patients-sign-up)

*   [Curl](#request-patients-sign-up-example-curl)
*   [HTTP](#request-patients-sign-up-example-http)

    curl -X POST -d '{
        "name": "Ivane Alves",
        "email": "vilma@gmail.com",
        "password": "77777777",
        "document": "18540469017",
        "phone": "11944448877",
        "allergies": "boredom!",
        "emergencyContactName": "Joao",
        "emergencyContactPhone": "1244773343"
    }' "{{host}}/patients/sign_up"

    POST %7B%7Bhost%7D%7D/patients/sign_up HTTP/1.1
    Host:

    {
        "name": "Ivane Alves",
        "email": "vilma@gmail.com",
        "password": "77777777",
        "document": "18540469017",
        "phone": "11944448877",
        "allergies": "boredom!",
        "emergencyContactName": "Joao",
        "emergencyContactPhone": "1244773343"
    }

* * *

#### index[](#request-patients-index)

*   [Curl](#request-patients-index-example-curl)
*   [HTTP](#request-patients-index-example-http)

    curl -X GET "{{host}}/patients"

    GET %7B%7Bhost%7D%7D/patients HTTP/1.1
    Host:

* * *

$(document).ready(function() { $("table:not(.table)").addClass('table table-bordered'); });
