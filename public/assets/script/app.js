var baseUrl = '';
$(function () {
    let t = trimChar(window.location.pathname, '/').split('/').length;
    while (t--) baseUrl += '../';
    baseUrl = baseUrl.substring(1) + '';
    populate_links();
    if (typeof (pname) != "undefined") {
        switch (pname) {
            case 'new': init_frola_editor();
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
                            if(data.user.userType=='user')
                                window.location.href = './home'
                            else
                                window.location.href = './statistics'
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

            case 'view': load_complaint(); init_frola_editor();
                break;

            case 'stats': initStats(); break;
        }
    }
    else {
        // Pagename not defined
    }

});

var init_frola_editor = () => {
    $('textarea').froalaEditor({
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
}

function load_all_complaints() {
    $.ajax({
        url: baseUrl + 'api/complaints/all',
        type: 'GET',
        success: function (data) {
            if (data.status) {
                var m = data.data;
                if (isad) {
                    chead = '<tr><th scope="col">ID</th><th>Objection/ Suggestion</th><th>Type</th><th scope="col">Complainant</th><th scope="col">DateTime</th><th scope="col">DateTime</th><th scope="col">Status</th><th>View</th></tr>';
                    cfoot = '<tr><th scope="col">Complaint ID</th><th>Objection/ Suggestion</th><th>Type</th><th scope="col">Complainant</th><th scope="col">DateTime</th><th scope="col">DateTime</th><th scope="col">Status</th><th>View</th></tr>';
                    $('#cfoot').html(cfoot);
                }
                else {
                    chead = '<tr><th scope="col">#</th><th>Type</th><th scope="col">DateTime</th><th>DateTime-2</th><th scope="col">Status</th><th scope="col">View</th></tr>';
                    cfoot = '';
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
                    $('#ctable').removeClass('d-none');
                }
                else {
                    var ctable = $('#ctable').DataTable({
                        language: {
                            "emptyTable": "No suggestions or objections to show",
                            "infoEmpty": "No suggestions or objections to show",
                            "zeroRecords": "No matching suggestion or objection found"
                        },
                        columnDefs: [{
                            orderable: false,
                            targets: 7
                        }, {
                            orderData: [5],
                            targets: 4
                        }, {
                            visible: false,
                            targets: 5
                        }],
                        initComplete: function () {
                            this.api().columns().every(function () {
                                var column = this;
                                var select = $('<select><option value="">Showing All</option></select>')
                                    .appendTo($(column.footer()).empty())
                                    .on('change', function () {
                                        var val = $.fn.dataTable.util.escapeRegex(
                                            $(this).val()
                                        );

                                        column
                                            .search(val ? '^' + val + '$' : '', true, false)
                                            .draw();
                                    });

                                column.data().unique().sort().each(function (d, j) {
                                    select.append('<option value="' + d + '">' + d + '</option>')
                                });
                            });
                        }
                    });
                    $('#cfoot>tr>th:nth-child(1),#cfoot>tr>th:nth-child(4),#cfoot>tr>th:nth-child(5),#cfoot>tr>th:nth-child(7)').html('')
                    $('#ctable').removeClass('d-none');
                    // Apply the search
                    // ctable.columns().every(function () {
                    //     var that = this;

                    //     $('input', this.footer()).on('keyup change', function () {
                    //         if (that.search() !== this.value) {
                    //             that
                    //                 .search(this.value)
                    //                 .draw();
                    //         }
                    //     });
                    // });
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
            var { complainant, complaintDesc, complaintType, location, objectionOrSuggestion, postedOn, relevantParaClause, status, actionTrail
 } = data;
            $('#c_status').text(status);
            $('#c_desc').html(complaintDesc);
            $('#c_type').text(complaintType);
            $('#c_para').text(relevantParaClause);
            $('#c_location').text(location);
            if(!isad)
                $('#c_complainant').text(complainant.name);
            else
                $('#c_complainant').text(`${complainant.name} - ${complainant.mobile} , ${complainant.email}`);            
            $('#c_head').text(`${objectionOrSuggestion} (ID : ${cno})`);
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

            // SHowing Trail Div
            $('#c_trail_head').text(`${objectionOrSuggestion} Trail`);
            if (actionTrail && actionTrail.length > 0) {
                var itemMarkup = '';
                for (var i = 0; i < actionTrail.length; i++) {
                    var item = actionTrail[i];
                    if (item.remarks && item.remarks.trim()) {
                        replies[item._id]=new Object({
                            content : item.remarks,
                            datetime : item.datetime,
                            user: isad?item.user.name:item.user.userType
                        });
                    }
                    if (isad) {
                        itemMarkup += `
                                        <div class="trail-item my-2 ${item.user.userType == "admin" ? 'right' : ''}">
                                            <div class="trail-info clearfix">
                                                <span class="trail-name float-left">${item.user.name}</span>
                                                <span class="trail-timestamp float-right">${moment(item.datetime).format('Do MMM YY, h:mm a')}</span>
                                            </div>
                                            <div class="trail-text">
                                               ${item.action}
                                               
                                               ${(item.remarks && item.remarks.trim()) ? '<a class="float-right" href="javascript:open_reply(\''+item._id+'\')">View Reply</a>' : ''}
                                            </div>
                                        </div>`;
                    }
                    else {
                        itemMarkup += `
                                        <div class="trail-item my-2 ${item.user.userType == "admin" ? 'right' : ''}">
                                            <div class="trail-info clearfix">
                                                <span class="trail-timestamp float-left">${moment(item.datetime).format('Do MMM YY, h:mm a')}</span>
                                            </div>
                                            <div class="trail-text">
                                               ${item.action}
                                               ${(item.remarks && item.remarks.trim()) ? '<a class="float-right" href="javascript:open_reply(\'${item._id}\')">View Reply</a>' : ''}
                                            </div>
                                        </div>`;
                    }
                }
                $('#trail_list').html(itemMarkup);
                $('#trail_card').removeClass('d-none');
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

var open_reply = (id) => {
    if (typeof replies[id] != "undefined") {
        $('#reply_content').html(replies[id]['content']);
        $('#reply_datetime').html(moment(replies[id]['datetime']).format('Do MMM YY, h:mm a'));
        $('#reply_user').html(replies[id]['user']);
        $('#reply_modal_btn').click();
    }
    else {
        // console.log(id,replies);
        alert('Reply not found');
    }
}

var onStatusChange = () => {
    if ($('#c_new_status').val() != "Replied")
        $('#c_remarks_div').addClass('d-none');
    else
        $('#c_remarks_div').removeClass('d-none');
}

var changeStatus = () => {
    let newStatus = $('#c_new_status').val();
    if (!newStatus) {
        alert('Please select an option')
        return;
    }
    else {
        if ($('#c_new_status').val() == "Replied" && !$('#c_remarks').val().trim()) {
            alert('Please Enter Reply comment.');
            return;
        }
        else {
            var remarks = $('#c_remarks').val();
            $.ajax({
                type: 'POST',
                url: baseUrl + 'api/complaints/updateStatus/' + cno,
                data: { newStatus, remarks },
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
    }
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
    if (pname == "login" || pname == "signup") {
        $('ul.navbar-nav.flex-row').removeClass('d-md-flex').addClass('d-none');
    }
    else {
        $('a.navbar-brand').attr('href', baseUrl + 'home');
        $('a.dropdown-item[href="javascript:goToProfile()"]').addClass('d-none');
        // $('a[href="javascript:goToProfile()"]').attr('href', baseUrl + 'profile');
        $('.navbar-nav-scroll .nav-item:nth-child(1) a').text('Home').attr('href', baseUrl + 'home').removeClass('d-none');
        if (isad) {
            $('.navbar-nav-scroll .nav-item:nth-child(2) a').text('Statistics').attr('href', baseUrl + 'statistics').removeClass('d-none');
        }
        else {
            // $('.navbar-nav-scroll .nav-item:nth-2child(1) a').text('Home').attr('href', baseUrl + 'home').removeClass('d-none');

            $('.navbar-nav-scroll .nav-item:nth-child(2) a').text('New Suggestion/Objection').attr('href', baseUrl + 'new').removeClass('d-none');
        }
    }
}

var initStats = () => {
    window.chartColors = {
        red: 'rgb(255, 99, 132)',
        orange: 'rgb(255, 159, 64)',
        yellow: 'rgb(255, 205, 86)',
        green: 'rgb(75, 192, 192)',
        blue: 'rgb(54, 162, 235)',
        purple: 'rgb(153, 102, 255)',
        grey: 'rgb(201, 203, 207)'
    };

    $.ajax({
        type: 'GET',
        url: './api/complaints/stats',
        success: (data) => {
            console.log(data);
        },
        error: (e) => {
            if (typeof e.responseJSON != "undefined" && typeof e.responseJSON.msg != "undefined")
                alert(e.responseJSON.msg);
            else
                alert('An error occured while communicating with server.\n\nTry refreshing the page.');
        }
    });


    var stat_1_ctx = document.getElementById("stat_1").getContext('2d');
    var stat_1 = new Chart(stat_1_ctx, {
        type: 'bar',
        data: {
            labels: ["Land Use Proposals", "Zoning Acquisition", "Infrastructure Provisions", "Demographic & Population Projections", "Environment Related", "MCA/Control Area/Village Boundary", "Traffic & Transportation", "Others"],
            datasets: [{
                label: 'Suggestions',
                backgroundColor: window.chartColors.red,
                yAxisID: "y-axis-1",
                data: [30, 41, 14, 26, 6, 60, 96, 32]
            }, {
                label: 'Objections',
                backgroundColor: window.chartColors.yellow,
                yAxisID: "y-axis-1",
                data: [33, 25, 75, 40, 49, 86, 79, 68]
            }]

        },
        options: {
            responsive: true,
            title: {
                display: true,
                text: "Objections & Suggestions - Type Wise"
            },
            tooltips: {
                mode: 'index',
                intersect: true
            },
            scales: {
                yAxes: [{
                    type: "linear", // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
                    display: true,
                    position: "left",
                    id: "y-axis-1",
                }],
            },
            hover: {
                animationDuration: 0
            },
            animation: {
                duration: 1,
                onComplete: function () {
                    var chartInstance = this.chart,
                        ctx = chartInstance.ctx;
                    ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize, Chart.defaults.global.defaultFontStyle, Chart.defaults.global.defaultFontFamily);
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'bottom';

                    this.data.datasets.forEach(function (dataset, i) {
                        var meta = chartInstance.controller.getDatasetMeta(i);
                        meta.data.forEach(function (bar, index) {
                            var data = dataset.data[index];
                            ctx.fillText(data, bar._model.x, bar._model.y - 5);
                        });
                    });
                }
            }
        }
    });

    var stat_2_ctx = document.getElementById("stat_2").getContext('2d');
    var stat_2 = new Chart(stat_2_ctx, {
        type: 'doughnut',
        data: {
            "labels": ["Registered", "Under Consideration", "Replied"],
            "datasets": [{
                "label": "Status",
                "data": [65, 59, 80],
                "fill": true,
                "backgroundColor": [window.chartColors.red,
                window.chartColors.orange,
                window.chartColors.green],
                "borderColor": [window.chartColors.red,
                window.chartColors.orange,
                window.chartColors.green],
                "borderWidth": 1
            }]
        },
        "options": {
            responsive: true,
            maintainAspectRatio: true,
            // legend: {
            // position: 'right',
            // },   
            title: {
                display: true,
                text: "Status"
            },
            "layout": {
                padding: {
                    left: 10,
                    right: 10,
                    top: 10,
                    bottom: 10
                }
            }
        }
    });
}