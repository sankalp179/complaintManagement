var baseUrl = '';
$(function () {
    let t = trimChar(window.location.pathname, '/').split('/').length;
    while (t--) baseUrl += '../';
    baseUrl = baseUrl.substring(1) + '';
    populate_links();
    if (typeof (pname) != "undefined") {
        switch (pname) {
            case 'new': $('textarea').froalaEditor({
                editorClass: 'border border-secondary',
                enter: $.FroalaEditor.ENTER_BR,
                fileAllowedTypes: ['application/pdf', 'application/msword'],
                fileMaxSize: 20 * 1024 * 1024,
                fileUploadMethod: 'POST',
                fileUploadParam: 'file',
                fileUploadParams: {},
                fileUploadURL: '/upload',
                height: 350,
                heightMax: 500,
                imageAllowedTypes: ['jpeg', 'jpg', 'png'],
                imageDefaultDisplay: 'inline',
                imageMaxSize: 5 * 1024 * 1024,
                imageUploadMethod: 'POST',
                imageUploadParam: 'file',
                imageUploadParams: {},
                imageUploadURL: '/upload',
                toolbarButtons: ['fullscreen', 'bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', '|', 'fontFamily', 'fontSize', 'color', 'inlineStyle', 'paragraphStyle', '|', 'paragraphFormat', 'align', 'formatOL', 'formatUL', 'outdent', 'indent', 'quote', '-', 'insertLink', 'insertImage', 'insertVideo', 'embedly', 'insertFile', 'insertTable', '|', 'emoticons', 'specialCharacters', 'insertHR', 'selectAll', 'clearFormatting', '|', 'print', 'spellChecker', 'help', 'html', '|', 'undo', 'redo'],
                toolbarButtonsMD: ['fullscreen', 'bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', '|', 'fontFamily', 'fontSize', 'color', 'inlineStyle', 'paragraphStyle', '|', 'paragraphFormat', 'align', 'formatOL', 'formatUL', 'outdent', 'indent', 'quote', '-', 'insertLink', 'insertImage', 'insertVideo', 'embedly', 'insertFile', 'insertTable', '|', 'emoticons', 'specialCharacters', 'insertHR', 'selectAll', 'clearFormatting', '|', 'print', 'spellChecker', 'help', 'html', '|', 'undo', 'redo'],
                toolbarButtonsSM: ['fullscreen', 'bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', '|', 'fontFamily', 'fontSize', 'color', 'inlineStyle', 'paragraphStyle', '|', 'paragraphFormat', 'align', 'formatOL', 'formatUL', 'outdent', 'indent', 'quote', '-', 'insertLink', 'insertImage', 'insertVideo', 'embedly', 'insertFile', 'insertTable', '|', 'emoticons', 'specialCharacters', 'insertHR', 'selectAll', 'clearFormatting', '|', 'print', 'spellChecker', 'help', 'html', '|', 'undo', 'redo'],
                toolbarButtonsXS: ['fullscreen', 'bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', '|', 'fontFamily', 'fontSize', 'color', 'inlineStyle', 'paragraphStyle', '|', 'paragraphFormat', 'align', 'formatOL', 'formatUL', 'outdent', 'indent', 'quote', '-', 'insertLink', 'insertImage', 'insertVideo', 'embedly', 'insertFile', 'insertTable', '|', 'emoticons', 'specialCharacters', 'insertHR', 'selectAll', 'clearFormatting', '|', 'print', 'spellChecker', 'help', 'html', '|', 'undo', 'redo'],
                videoAllowedTypes: ['mp4', 'webm', 'ogg'],
                videoMaxSize: 50 * 1024 * 1024,
                videoUploadMethod: 'POST',
                videoUploadParam: 'file',
                videoUploadParams: {},
                videoUploadURL: '/upload',
            });
                break;

            case 'home': load_all_complaints(); break;

            case 'login': $('form').on('submit', (e) => {
                e.preventDefault();
                var data = {
                    email: $('#email').val(),
                    password: $('#password').val()
                };
                $.ajax({
                    url: './api/user/login/',
                    data: data,
                    type: 'POST',
                    success: (data) => {
                        if (data.status) {
                            window.location.href = './home'
                        }
                        else {
                            alert(data.msg);
                        }
                    },
                    error: (e) => {
                        // console.log(e)
                        if (typeof e.responseJSON != "undefined" && typeof e.responseJSON.msg != "undefined")
                            alert(e.responseJSON.msg);
                        else
                            alert('An error occured while communicating with server.\n\nTry refreshing the page.');
                    }
                })
            });
                break;

            case 'view': load_complaint();
                break;
        }
    }
    else {
        // Pagename not defined
    }

});

function load_all_complaints() {
    $.ajax({
        url: baseUrl + 'api/complaints/all',
        type: 'GET',
        success: function (data) {
            if (data.status) {
                var m = data.data;
                if (isad) {
                    chead = '<tr><th scope="col">#</th><th>Objection/ Suggestion</th><th>Type</th><th scope="col">Complainant</th><th scope="col">DateTime</th><th scope="col">DateTime</th><th scope="col">Status</th><th>View</th></tr>';
                }
                else {
                    chead = '<tr><th scope="col">#</th><th>Type</th><th scope="col">DateTime</th><th>DateTime-2</th><th scope="col">Status</th><th scope="col">View</th></tr>';
                }
                $('#chead').html(chead);
                cbody = '';
                for (var i = 0; i < m.length; i++) {
                    let t = m[i];
                    if (!isad) {
                        cbody += `<tr>
                                <td scope="row"> ${t.complaintNumber}</td>
                                <td scope="row"> ${t.complaintType} - ${t.objectionOrSuggestion}</td>
                                <td scope="row"> ${moment(t.postedOn).format("dddd, Do MMM YY, h:mm a")}</td>
                                <td scope="row"> ${t.postedOn}</td>
                                <td scope="row"> ${t.status}</td>
                                <td scope="row"> <a href="./view/${t.complaintNumber}">View</a></td>
                            </tr>`;
                    }
                    else {
                        cbody += `<tr>
                                <td scope="row"> ${t.complaintNumber}</td>
                                <td scope="row"> ${t.objectionOrSuggestion}</td>
                                <td scope="row"> ${t.complaintType} </td>
                                <td scope="row"> ${t.complainant.name} </td>
                                <td scope="row"> ${moment(t.postedOn).format("dddd, Do MMM YY, h:mm a")}</td>
                                <td scope="row"> ${t.postedOn}</td>
                                <td scope="row"> ${t.status}</td>
                                <td scope="row"> <a href="./view/${t.complaintNumber}">View</a></td>
                            </tr>`;
                    }
                }
                $('#cbody').html(cbody);
                if (!isad) {
                    $('#ctable').DataTable({
                        language: {
                            "emptyTable": 'You haven\'t posted any suggestion or objection yet.',
                            "infoEmpty": "No suggestions or objections to show",
                            "zeroRecords": "No matching suggestion or objection found",
                        },
                        columnDefs: [{
                            orderable: false,
                            targets: 5
                        },
                        {
                            orderData: [3],
                            targets: 2
                        },
                        {
                            visible: false,
                            targets: 3
                        }
                        ]
                    });
                }
                else {
                    $('#ctable').DataTable({
                        language: {
                            "emptyTable": "No suggestions or objections to show",
                            "infoEmpty": "No suggestions or objections to show",
                            "zeroRecords": "No matching suggestion or objection found"
                        },
                        columnDefs: [{
                            orderable: false,
                            targets: 7
                        },
                        {
                            orderData: [5],
                            targets: 4
                        },
                        {
                            visible: false,
                            targets: 5
                        }
                        ]
                    });
                }

            }
            else {
                alert(data.msg);
            }
        },
        error: (e) => {
            if (typeof e.responseJSON != "undefined")
                alert(e.responseJSON.msg);
            else
                alert('An error occured while communicating with server.\n\nTry refreshing the page.');
        }
    });
}

function logout() {
    $.ajax({
        url: baseUrl + 'api/user/logout',
        type: 'GET',
        success: (data) => {
            if (data.status) {
                window.location.href = baseUrl + 'login';
            }
            else {
                alert(data.msg);
            }
        },
        error: (e) => {
            if (typeof e.responseJSON != "undefined" && typeof e.responseJSON.msg != "undefined")
                alert(e.responseJSON.msg);
            else
                alert('An error occured while communicating with server.\n\nTry refreshing the page.');
        }
    });
}

function load_complaint() {
    $.ajax({
        url: baseUrl + 'api/complaints/' + cno,
        type: 'GET',
        success: (data) => {
            var { complainant, complaintDesc, complaintType, location, objectionOrSuggestion, postedOn, relevantParaClause, status } = data;

            $('#c_status').text(status);
            $('#c_desc').html(complaintDesc);
            $('#c_type').text(complaintType);
            $('#c_para').text(relevantParaClause);
            $('#c_location').text(location);
            $('#c_complainant').text(complainant.name);
            $('#c_head').text(`${objectionOrSuggestion} (#${cno})`);
            $('#c_posted_on').text(moment(postedOn).format("Do MMM YY, h:mm a"));
            if (isad && typeof data.official != "undefined" && typeof data.official.name != "undefined") {
                $('#c_official').text(data.official.name);
                $('#c_official').parent().parent().parent().removeClass('d-none');
            }
            $('.bs-wizard-step').removeClass('active complete').addClass('disabled');
            $('.bs-wizard-step:first-child').removeClass('disabled').addClass('complete');

            switch (status) {
                case 'Replied':
                    $('.bs-wizard-step').removeClass('active disabled').addClass('complete');
                    break;
                case 'Under Consideration':
                    $('.bs-wizard-step:nth-child(2)').removeClass('disabled').addClass('active');
                    if (isad) {
                        $('#c_new_status').html('<option selected disabled>Select Action</option><option disabled>Under Consideration</option><option value="Replied">Replied</option>');
                        $('#action_div').removeClass('d-none');
                    }
                    break;

                case 'Registered':
                    if (isad) {
                        $('#c_new_status').html('<option selected disabled>Select Action</option><option value="Under Consideration">Under Consideration</option><option value="Replied">Replied</option>');
                        $('#action_div').removeClass('d-none');
                    }
                    break;
            }
            $("#status_steps_div").removeClass('d-none');
        },
        error: (e) => {
            if (typeof e.responseJSON != "undefined" && typeof e.responseJSON.msg != "undefined")
                alert(e.responseJSON.msg);
            else
                alert('An error occured while communicating with server.\n\nTry refreshing the page.');
        }
    })
}

function changeStatus() {
    let newStatus = $('#c_new_status').val();
    if (!newStatus) {
        alert('Please select an option')
        return;
    }
    $.ajax({
        type: 'POST',
        url: baseUrl + 'api/complaints/updateStatus/' + cno,
        data: { newStatus },
        success: (data) => {
            if (data.status) {
                alert('Status Updated Successfully');
                window.location.href = window.location.href;
            }
        },
        error: (e) => {
            if (typeof e.responseJSON != "undefined" && typeof e.responseJSON.msg != "undefined")
                alert(e.responseJSON.msg);
            else
                alert('An error occured while communicating with server.\n\nTry refreshing the page.');
        }
    })
}

var registerUser = () => {
    var name = $('#fullName').val();
    var email = $('#emailAddress').val();
    var mobile = $('#mobileNumber').val();
    var aadharNumber = $('#aadharNumber').val();
    var password = $('#password').val();
    var confirmPassword = $('#confirmPassword').val();
    if (confirmPassword != password) {
        return alert('Confirm Password and Entered Password do not match.');
    }
    else {
        $.ajax({
            type: 'POST',
            url: baseUrl + 'api/user/register',
            data: {
                name,
                email,
                mobile,
                aadharNumber,
                password
            },
            success: (data) => {
                if (data.status) {
                    alert('User Registration Successful');
                    window.location.href = baseUrl + 'home';
                }
                else {
                    alert(data.msg)
                }
            },
            error: (e) => {
                if (typeof e.responseJSON != "undefined" && typeof e.responseJSON.msg != "undefined")
                    alert(e.responseJSON.msg);
                else
                    alert('An error occured while communicating with server.\n\nTry refreshing the page.');
            }
        })
    }
};

var registerComplaint = () => {
    var objectionOrSuggestion = $('#objectionSuggestion').val();
    var complaintType = $('#complaintType').val();
    var location = $('#location').val();
    var relevantParaClause = $('#paraClause').val();
    var paraClauseLink = $('#paraClauseLink').val();
    var complaintDesc = $('#editor').val();

    var data = {
        objectionOrSuggestion,
        complaintType,
        location,
        relevantParaClause,
        paraClauseLink,
        complaintDesc
    };

    $.ajax({
        type: 'POST',
        url: baseUrl + 'api/complaints/new',
        data: data,
        success: (data) => {
            if (data.status) {
                alert(data.msg);
                window.location.href = baseUrl + 'view/' + data.refNo;
            }
            else {
                alert(data.msg);
            }
        },
        error: (e) => {
            if (typeof e.responseJSON != "undefined" && typeof e.responseJSON.msg != "undefined")
                alert(e.responseJSON.msg);
            else
                alert('An error occured while communicating with server.\n\nTry refreshing the page.');
        }
    })

};

var populate_links = () => {
    if(pname == "login" || pname=="signup"){
        $('ul.navbar-nav.flex-row').removeClass('d-md-flex').addClass('d-none');
    }
    else{
        $('a.navbar-brand').attr('href', baseUrl + 'home');
        $('a.dropdown-item[href="javascript:goToProfile()"]').addClass('d-none');
        // $('a[href="javascript:goToProfile()"]').attr('href', baseUrl + 'profile');
        // $('.navbar-nav-scroll .nav-item:nth-child(1) a').text('Home').attr('href', baseUrl + 'home').removeClass('d-none');
        if (isad) {
            // $('.navbar-nav-scroll .nav-item:nth-child(2) a').text('Statistics').attr('href', baseUrl + 'statistics').removeClass('d-none');
        }
        else {
            $('.navbar-nav-scroll .nav-item:nth-child(1) a').text('Home').attr('href', baseUrl + 'home').removeClass('d-none');
            
            $('.navbar-nav-scroll .nav-item:nth-child(2) a').text('New Suggestion/Objection').attr('href', baseUrl + 'new').removeClass('d-none');
        }
    }
}