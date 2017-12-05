var baseUrl = '';
$(function () {
    let t = trimChar(window.location.pathname, '/').split('/').length;
    while (t--) baseUrl += '../';
    baseUrl = baseUrl.substring(1) + '';

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
                videoAllowedTypes: ['webm', 'jpg', 'ogg'],
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
                        if (typeof e.responseJSON.msg != "undefined")
                            alert(e.responseJSON.msg);
                        else
                            alert('An error occured while communicating with server');
                    }
                })
            });
            break;

            case 'view': load_complaint();break;
        }
    }
    else{
        // Pagename not defined
    }

});

function load_all_complaints() {
    $.ajax({
        url: baseUrl + 'api/complaints/all',
        type: 'GET',
        success : function(data){
            if(data.status){
                var m=data.data;
                if(isad){
                    chead ='<tr><th scope="col">#</th><th>Complaint Type</th><th scope="col">Complainant</th><th>Official</th><th scope="col">DateTime</th><th scope="col">Status</th></tr>';
                }
                else{
                    chead ='<tr><th scope="col">#</th><th>Complaint Type</th><th scope="col">DateTime</th><th scope="col">Status</th><th scope="col">View</th></tr>';
                }
                $('#chead').html(chead);
                cbody = '';
                for(var i=0;i<m.length;i++){
                    let t=m[i];
                    if(!isad){
                        cbody += `<tr>
                                <td scope="row"> ${t.complaintNumber}</td>
                                <td scope="row"> ${t.complaintType} - ${t.objectionOrSuggestion}</td>
                                <td scope="row"> ${moment(t.postedOn).format("dddd, Do MMM YY, h:mm a")}</td>
                                <td scope="row"> ${t.status}</td>
                                <td scope="row"> <a href="./view/${t.complaintNumber}">View</a></td>
                            </tr>`;
                        switch (t.status){
                            case 'Posted' : break;
                            case 'Under Consideration' : break;
                            case 'Replied' : break;
                        }
                        $('#action').html('')
                    }
                    else{

                    }
                }
                $('#cbody').html(cbody);
            }
            else{
                alert(data.msg);
            }
        },
        error: (e) => {
            if (typeof e.responseJSON != "undefined")
                alert(e.responseJSON.msg);
            else
                alert('An error occured while communicating with server');
        }
    });
}

function logout(){
    $.ajax({
        url: baseUrl+'api/user/logout',
        type : 'GET',
        success : (data)=>{
            if(data.status){
                window.location.href = baseUrl+'login';
            }
            else{
                alert(data.msg);
            }
        },
        error : (e)=>{
            if (typeof e.responseJSON.msg != "undefined")
                alert(e.responseJSON.msg);
            else
                alert('An error occured while communicating with server');
        }
    });
}

function load_complaint(){
    $.ajax({
        url : baseUrl +'api/complaints/'+cno,
        type : 'GET',
        success : (data)=>{
            var { complaintDesc, complaintType, location, objectionOrSuggestion, postedOn, relevantParaClause, status}=data;
            var complainant = data.complainant.name;

            $('#c_status').text(status);
            $('#c_desc').html(complaintDesc);
            $('#c_type').text(complaintType);
            $('#c_para').text(relevantParaClause);
            $('#c_location').text(location);
            $('#c_objectionOrSuggestion').text(objectionOrSuggestion);
            $('#c_posted_on').text(moment(postedOn).format("dddd, Do MMM YY, h:mm a"));
        },
        error: (e) => {
            if (typeof e.responseJSON.msg != "undefined")
                alert(e.responseJSON.msg);
            else
                alert('An error occured while communicating with server');
        }
    })
}

function changeStatus(){

}