var isMobile = false; //initiate as false
// device detection
if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
    || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4)))
    isMobile = true;

var is_iPad = navigator.userAgent.match(/iPad/i) != null;

var user_timezone='Asia/Kolkata';
/*
 ====================
 | Helper Functions |
 ====================
*/

function bool_to_text(a,fls,tr) {
	if (typeof fls == "undefined") {
		fls = 'No';
	}
	if (typeof tr == "undefined") {
		tr = 'Yes';
	}
	if(a=='0'||a==0)
		return fls;
	return tr;
}


function validate_website_name(a)
{
	var web_reg=/^(http:\/\/|https:\/\/)?(www.)?([a-zA-Z0-9]+).[a-zA-Z0-9]*.[a-z]{3}.?([a-z]+)?$/;
	if(!(web_reg.test(a)))
		return false;
	return true;
}
function validate_mobile(a)
{
	var mob_regex=/^[7-9]{1}[0-9]{9}$/;
	if(!(mob_regex.test(a)))
		return false;
	return true;
}

function validate_email(a)
{
	var email_regex=/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	if(!(email_regex.test(a)))
		return false;
	return true;
}

function validate_mobile_international(a)
{
	var mob_regex=/^[0-9\ \-\+]{3,20}$/;
	if(!(mob_regex.test(a)))
		return false;
	return true;
}
function validate_subdomain(a,max)
{
	if (typeof max == "undefined") {
		max = 40;
	}
	var subdomain_regex="^[a-zA-Z0-9\-\_]{1,"+max+"}$";
	subdomain_regex=new RegExp(subdomain_regex);
	if(!(subdomain_regex.test(a)))
		return false;
	return true;
}
function show_error(a)
{
	swal({
		text: a,
	    type: "warning"
	 });
}

//3rd argument true implies show heading of each array
//4th true only if Report tile is JSON

function JSONToCSVConvertor(JSONData, ReportTitle, filename,ShowLabel,showtitle) {
    //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
    var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;

    var CSV = '';
    //Set Report title in first row or line


     //This condition will generate Report Headin from JSON
    if (showtitle) {
    	var arrheading = typeof ReportTitle != 'object' ? JSON.parse(ReportTitle) : ReportTitle;
        var row = ",";

        //This loop will extract the label from 1st index of on array
        for (var index in arrheading[0]) {
            //Now convert each value to string and comma-seprated
            row += index + ',,';
        }

        row = row.slice(0, -1);

        //append Label row with line break
        CSV += row + '\r,,,';
         for (var i = 0; i < arrheading.length; i++) {
        var row = "";

        //2nd loop will extract each column and convert it in string comma-seprated
        for (var index in arrheading[i]) {
            row += '"' + arrheading[i][index] + '",';
        }

        row.slice(0, row.length - 1);

        //add a line break after each row
        CSV += row + '\r\n\n';
    	}
    }
    else
    {
    	CSV += ReportTitle + '\r\n\n';
    }


    //This condition will generate the Label/Header
    if (ShowLabel) {
        var row = "";

        //This loop will extract the label from 1st index of on array
        for (var index in arrData[0]) {

            //Now convert each value to string and comma-seprated
            row += index + ',';
        }

        row = row.slice(0, -1);

        //append Label row with line break
        CSV += row + '\r\n';
    }

    //1st loop is to extract each row
    for (var i = 0; i < arrData.length; i++) {
        var row = "";

        //2nd loop will extract each column and convert it in string comma-seprated
        for (var index in arrData[i]) {
            row += '"' + arrData[i][index] + '",';
        }

        row.slice(0, row.length - 1);

        //add a line break after each row
        CSV += row + '\r\n';
    }

    if (CSV == '') {
        swal({
            				title: "INVALID DATA",
           				    type: "error",
            				closeOnConfirm: true,
      				  });
        return;
    }

    //Generate a file name
    var fileName = filename;


    //Initialize file format you want csv or xls
    var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);

    // Now the little tricky part.
    // you can use either>> window.open(uri);
    // but this will not work in some browsers
    // or you will not get the correct file extension

    //this trick will generate a temp <a /> tag
    var link = document.createElement("a");
    link.href = uri;

    //set the visibility hidden so it will not effect on your web-layout
    link.style = "visibility:hidden";
    link.download = fileName + ".csv";

    //this part will append the anchor tag and remove it after automatic click
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function numeric(name,max,min)
{
	if (typeof max == "undefined") {
		max = '40';
	}
	if (typeof min == "undefined") {
		 min = '1';
	}
	var name_regex="^[0-9]{"+min+","+max+"}$";
	name_regex=new RegExp(name_regex);
    if(!(name_regex.test(name)))
    	return false;
    return true;
}
function alpha_numeric(name,max,min)
{
	if (typeof max == "undefined") {
		max = '40';
	}
	if (typeof min == "undefined") {
		 min = '1';
	}
	var name_regex="^[A-Za-z0-9]{"+min+","+max+"}$";
	name_regex=new RegExp(name_regex);
    if(!(name_regex.test(name)))
    	return false;
    return true;
}
function alphabet(name,max,min)
{
	if (typeof max == "undefined") {
		max = '40';
	}
	if (typeof min == "undefined") {
		 min = '1';
	}
	var name_regex="^[A-Za-z]{"+min+","+max+"}$";
	name_regex=new RegExp(name_regex);
    if(!(name_regex.test(name)))
    	return false;
    return true;
}
function special_chars1(name,max,min)
{
	if (typeof max == "undefined") {
		max = '40';
	}
	if (typeof min == "undefined") {
		 min = '1';
	}
	var name_regex="^[A-Za-z0-9\\.\\-\\ ]{"+min+","+max+"}$";
	name_regex=new RegExp(name_regex);
    if(!(name_regex.test(name)))
    	return false;
    return true;
}
function special_chars2(name,max,min)
{
	if (typeof max == "undefined") {
		max = '40';
	}
	if (typeof min == "undefined") {
		 min = '1';
	}
	var name_regex="^[A-Za-z0-9\\.\// ' ( ) + ! & \\-\\_\\:\\,]{"+min+","+max+"}$";
	name_regex=new RegExp(name_regex);
    if(!(name_regex.test(name)))
    	return false;
    return true;
}
function special_chars2_ml(name,max,min)
{
	if (typeof max == "undefined") {
		max = '40';
	}
	if (typeof min == "undefined") {
		 min = '1';
	}
    //Multi Line I/P allowed.
	var name_regex="^[A-Za-z0-9\\.\// ' ( ) + ! & \\-\\_\\:\\,\s\S\n]{"+min+","+max+"}$";
	name_regex=new RegExp(name_regex);
    if(!(name_regex.test(name)))
    	return false;
    return true;
}
function setCookie(cname, cvalue, exminutes) {
	if (typeof exminutes == "undefined") {
		exminutes = 60;
	}
    var d = new Date();
    d.setTime(d.getTime() + (exminutes*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
function deleteCookie(name){
     document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

function get_page_name() {
    var url=window.location.pathname;
    var index = url.lastIndexOf("/") + 1;
    var filenameWithExtension = url.substr(index);
    var filename = filenameWithExtension.split(".")[0];
    return filename;
}

//this function adds suffix to the numbers for age usage like 1st, 2nd
function ordinal(num,flag) {
	if (typeof flag == "undefined") {
		flag = 0;
	}
    var ord = ['th','st','nd','rd','th','th','th','th','th','th'];
    if (((num % 100) >= 11) && ((num%100) <= 13))
    {
    	if(!flag)
        	return num + 'th';
     	return 'th';
    }
    else
    {
    	if(!flag)
        	return num + ord[num % 10];
        return ord[num % 10];

    }
}

function infoDiv(text) {
  var div = '<blockquote class="row col s12 info-wrap"><div class="info-div">'+ text +'</div></blockquote>';
  return div;
}

function open_processing_ur_request_swal(text){
	if (typeof text == "undefined") {
		text = '';
	}
    if(!text.trim())
    {
        swal({
            html : '<div class="preloader-wrapper big active"> <div class="spinner-layer spinner-blue"> <div class="circle-clipper left"> <div class="circle"></div></div><div class="gap-patch"> <div class="circle"></div></div><div class="circle-clipper right"> <div class="circle"></div></div></div><div class="spinner-layer spinner-red"> <div class="circle-clipper left"> <div class="circle"></div></div><div class="gap-patch"> <div class="circle"></div></div><div class="circle-clipper right"> <div class="circle"></div></div></div><div class="spinner-layer spinner-yellow"> <div class="circle-clipper left"> <div class="circle"></div></div><div class="gap-patch"> <div class="circle"></div></div><div class="circle-clipper right"> <div class="circle"></div></div></div><div class="spinner-layer spinner-green"> <div class="circle-clipper left"> <div class="circle"></div></div><div class="gap-patch"> <div class="circle"></div></div><div class="circle-clipper right"> <div class="circle"></div></div></div></div><p>Processing your request...</p>',
            allowOutsideClick :false,
            allowEscapeKey : false,
            showConfirmButton : false
        });
    }
    else {
        swal({
            html : '<div class="preloader-wrapper big active"> <div class="spinner-layer spinner-blue"> <div class="circle-clipper left"> <div class="circle"></div></div><div class="gap-patch"> <div class="circle"></div></div><div class="circle-clipper right"> <div class="circle"></div></div></div><div class="spinner-layer spinner-red"> <div class="circle-clipper left"> <div class="circle"></div></div><div class="gap-patch"> <div class="circle"></div></div><div class="circle-clipper right"> <div class="circle"></div></div></div><div class="spinner-layer spinner-yellow"> <div class="circle-clipper left"> <div class="circle"></div></div><div class="gap-patch"> <div class="circle"></div></div><div class="circle-clipper right"> <div class="circle"></div></div></div><div class="spinner-layer spinner-green"> <div class="circle-clipper left"> <div class="circle"></div></div><div class="gap-patch"> <div class="circle"></div></div><div class="circle-clipper right"> <div class="circle"></div></div></div></div><p>'+text+'</p>',
            allowOutsideClick :false,
            allowEscapeKey : false,
            showConfirmButton : false
        });
    }
}

function validate_GST(gst_num) {
	var gst = /^[0-9]{2}[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9a-zA-Z]{1}[zZ][0-9a-zA-Z]{1}$/;
	if (!(gst.test(gst_num)))
	 	return false;
	 else
	 	return true;
}

function validate_pincode(pin_code) {
	var pin = /^[1-9][0-9]{5}$/;
	if (!(pin.test(pin_code))) {
		return false;
	} else
		return true;
}

function validate_phone(phone_num) {
	var phone = /^[0-9]{8,12}$/;
	if (!(phone.test(phone_num))) {
		return false;
	} else
		return true;
}

function validate_aadhar(number) {
    // var aadhar_regex = /^[0-9]{12}$/;
    var aadhar_regex = /^\d{4}\s\d{4}\s\d{4}$/;
    var aadhar_regex = /^\d{12}$/;
    return !(aadhar_regex.test(number));
}

// To Compare 2 JS Objects.
function isEquivalent(a, b) {
    // Create arrays of property names
    var aProps = Object.getOwnPropertyNames(a);
    var bProps = Object.getOwnPropertyNames(b);

    // If number of properties is different,
    // objects are not equivalent
    if (aProps.length != bProps.length) {
        return false;
    }

    for (var i = 0; i < aProps.length; i++) {
        var propName = aProps[i];

        // If values of same property are not equal,
        // objects are not equivalent
        if (a[propName] !== b[propName]) {
            return false;
        }
    }
    // If we made it this far, objects
    // are considered equivalent
    return true;
}

$('.truncate').on('keypress',function(e){
    truncate(e.target);
});

function truncate(target){
    if ( $(target).is( "input" )||$(target).is( "textarea" )) {
        var max_length=Number($(target).attr('length')) || Number($(target).attr('max-length')) || Number($(target).attr('data-max-length'))||0;
        if(max_length){
            if($(target).val().length>max_length)
                $(target).val($(target).val().substr(0,max_length));
        }
        else
            console.log('Please specify length attribute to use truncate class.')
    }
}
function trimChar(string, charToRemove) {
    while (string.charAt(0) == charToRemove) {
        string = string.substring(1);
    }

    while (string.charAt(string.length - 1) == charToRemove) {
        string = string.substring(0, string.length - 1);
    }
    return string;
}
