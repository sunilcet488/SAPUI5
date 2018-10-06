var tbluser = document.getElementById('customerTable');
var goodstable = document.getElementById('goods');
// For first time make sure use the Set method so that 

var count = 1;


var displayQuotationButton = document.querySelector('#displayQuotation');
if (displayQuotationButton) {
    displayQuotationButton.addEventListener('click', function () {
        console.log("Display customer");
    });
}


// 2 Add Row Button 
var addrow = document.querySelector('#addRow');
if (addrow) {
    addrow.addEventListener('click', function () {
        // Add new Empty Row
        var rowCount = goodstable.rows.length;
        var row = goodstable.insertRow(rowCount);

        var colCount = goodstable.rows[0].cells.length;

        for (var i = 0; i < colCount; i++) {

            var newcell = row.insertCell(i);

            newcell.innerHTML = goodstable.rows[1].cells[i].innerHTML;
            //alert(newcell.childNodes);
            switch (newcell.childNodes[0].type) {
                case "text":
                    newcell.childNodes[0].value = "";
                    break;
                case "checkbox":
                    newcell.childNodes[0].checked = false;
                    break;
                case "select-one":
                    newcell.childNodes[0].selectedIndex = 0;
                    break;
            }
            if (newcell.childNodes[0].type == null) {
                newcell.innerHTML = rowCount;
            }
        }
        // $('#goods').find('tbody').append( "<tr><td></td><td>3</td><td>Universal package</td><td>45458789</td><td>2</td><td>41,7878</td><td>NOS</td><td>59,87878</td></tr>" );

    });
}

// 3 Delete row
var removerow = document.querySelector('#removeRow');
if (removerow) {
    removerow.addEventListener('click', function () {
        try {
            // var table = document.getElementById(tableID);
            var rowCount = goodstable.rows.length;

            for (var i = 1; i < rowCount; i++) {
                var row = goodstable.rows[i];
                // var chkbox = row.cells[0].childNodes[0];
                var chkbox = row.cells[0].getElementsByTagName('input')[0];
                if (chkbox.type == 'checkbox' && chkbox.checked == true) {
                    if (rowCount <= 2) {
                        alert("Cannot delete all the rows.");
                        break;
                    }
                    goodstable.deleteRow(i);
                    rowCount--;
                    i--;
                }
            }
            // after removal : correct the sequence of the Sr number 
            for (var i = 1; i < goodstable.rows.length; i++) {
                goodstable.rows[i].cells[1].innerHTML = i;
            }
        } catch (e) {
            alert(e);
        }
    });

}

// Calculate total Goods
var total = document.querySelector('#total');
if (total) {
    total.addEventListener('click', function () {
        var sum = 0;
        try {
            for (var i = 1; i < goodstable.rows.length; i++) {
                var a = parseFloat(goodstable.rows[i].cells[7].childNodes[0].value);
                sum = sum + a;
            }
            document.getElementById('totallabel').innerHTML = sum;
            if (isNaN(sum)) {
                alert("Please correct the Amount");
            }
        } catch (error) {
            alert(error);
        }
    });

}



// Create database reference
var ref = firebase.database().ref('users/Customers/');
// DataBase reference for the Quotation
var qref = firebase.database().ref('users/Quotations/');


// Submit the data to create the 
var submit = document.querySelector('#submit');
if (submit) {
    submit.addEventListener('click', function () {
        // alert("Submit");
        // Do the Validations
        qref.child('Qcounter').transaction(function (currentValue) {
            return (currentValue || 0) + 1
        }, function (error, committed, obj) {
            if (error) {

            } else if (committed) {
                // Key of the Quotation
                var key = obj.val();
                // Create the object for update
                // Collect the values
                var companyname = document.getElementById("companynameform").value.split("-")[1];
                var location = document.getElementById("locationform").value.split("-")[1];
                var mobile = document.getElementById("mobileform").value.split("-")[1];
                var contact = document.getElementById("contactform").value.split("-")[1];
                var gst = document.getElementById("gstform").value.split("-")[1];

                var total = document.getElementById("totallabel").innerHTML;
                var createdby = "Sunil";
                var createddate  = parseInt(new Date().toJSON().slice(0,10).replace(/-/g,'')); //YYYYMMDD
                var createdtime = new Date().toLocaleTimeString();

                //Prepare the Goods Array
                


                var text = '{ "' + key + '" : { "companyName":"' + companyname +
                    '", "contactPerson":"' + contact +
                    '", "gst":"' + gst +
                    '", "location":"' + location +
                    '", "mobile":' + mobile + '} }';
            }
        });
    });
}

var addcustomerButton = document.querySelector('#addCustomer');
var dialog = document.querySelector('#customerdialog');
if (!dialog.showModal) {
    dialogPolyfill.registerDialog(dialog);
}
addcustomerButton.addEventListener('click', function () {
    dialog.showModal();
});
dialog.querySelector('#dialogcancel').addEventListener('click', function () {
    dialog.close();
});
dialog.querySelector('#dialogsave').addEventListener('click', function () {
    // write the function for saving the customer details in the database
    var companyname = document.getElementById('companyname').value;
    var location = document.getElementById('location').value;
    var mobile = document.getElementById('mobile').value;
    var contact = document.getElementById('contact').value;
    var gst = document.getElementById('gst').value;
    // Get the Last Number Key From the table
    // ref.limitToLast(1).on("value", function (data) {
    //     console.log(data.val());
    // }, function (error) {
    //     console.log("Error: " + error.code);
    // });
    ref.child('counter').transaction(function (currentValue) {
        return (currentValue || 0) + 1
    }, function (error, committed, obj) {
        if (error) {

        } else if (committed) {
            var key = obj.val();
            // Create the JSON Object 
            var text = '{ "' + key + '" : { "companyName":"' + companyname +
                '", "contactPerson":"' + contact +
                '", "gst":"' + gst +
                '", "location":"' + location +
                '", "mobile":' + mobile + '} }';
            var customerObj = JSON.parse(text);
            ref.update(customerObj, function (error) {
                if (error) {
                    // Write the error message
                    alert("Error :" + error);
                } else {
                    // Add to table that entry added 
                    var max = tbluser.rows.length;
                    var row = tbluser.insertRow(max);
                    var custId = row.insertCell(0);
                    var companyNameobj = row.insertCell(1);
                    var locationobj = row.insertCell(2);
                    var mobileobj = row.insertCell(3);
                    var contactPersonobj = row.insertCell(4);
                    var gstobj = row.insertCell(5);

                    custId.appendChild(document.createTextNode(key));
                    companyNameobj.appendChild(document.createTextNode(companyname));
                    locationobj.appendChild(document.createTextNode(location));
                    mobileobj.appendChild(document.createTextNode(mobile));
                    contactPersonobj.appendChild(document.createTextNode(contact));
                    gstobj.appendChild(document.createTextNode(gst));
                    // Write success - notification Toast
                    alert("Customer Added :" + key);
                }
                // dialog.close();
            });
        }
        dialog.close();
    });
});


// Display perticular Div 
// Event to display customer from the database and show the div
function show_div(toShow) {
    if (toShow == 'customer') {

        var show = document.getElementById(toShow);
        show.style.display = "";
        // Call the function to refresh the customer table
        refreshCustomer();
        // Hide other div
        document.getElementById('quotation').style.display = 'none';

    } else if (toShow == 'quotation') {
        var show = document.getElementById(toShow);
        show.style.display = "";
        // Hide other div
        // fill the 
        document.getElementById('customer').style.display = 'none';

    }
}

// Function to refresh the customer Table
function refreshCustomer() {
    if (tbluser.rows.length > 1) {
        return;
    }
    var rowIndex = 1;
    // var ref = firebase.database().ref('users/Customers/');
    ref.once('value', function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
            var childKey = childSnapshot.key;
            // Skip the counter value 
            if (childKey == 'counter') {
                return;
            }
            // if the Key is already there then come out from the function
            // var tr = tbluser.getElementsByTagName("tr");
            // for (let i = 0; i < tr.length; i++) {
            //   var custkey = tr[i].getElementsByTagName("td")[0].innerHTML;
            //     if (tr[i].getElementsByTagName("td")[0].innerHTML == childKey) {
            //         //  Raise exception 
            //         throw "exit";
            //     }
            // }

            var childData = childSnapshot.val();

            var row = tbluser.insertRow(rowIndex);
            var custId = row.insertCell(0);
            var companyName = row.insertCell(1);
            var location = row.insertCell(2);
            var mobile = row.insertCell(3);
            var contactPerson = row.insertCell(4);
            var gst = row.insertCell(5);

            custId.appendChild(document.createTextNode(childKey));
            companyName.appendChild(document.createTextNode(childData.companyName));
            location.appendChild(document.createTextNode(childData.location));
            mobile.appendChild(document.createTextNode(childData.mobile));
            contactPerson.appendChild(document.createTextNode(childData.contactPerson));
            gst.appendChild(document.createTextNode(childData.gst));

            rowIndex = rowIndex + 1;
        });
    });
}

// --------------------Get the customer data from table and fill the list----------------
// var customerlist = document.querySelector('#customerList');
// customerlist.querySelector('#customerList').addEventListener('click', function () {
//     console.log("test");
// });
// var fillcustomer = 
function fillCustomerData() {

}

function fillData(data) {
    console.log(data);
}



// Create Quotation 

// 1. Auto complete Drop Down

document.getElementById("companynameform").disabled = true;
document.getElementById("locationform").disabled = true;
document.getElementById("mobileform").disabled = true;
document.getElementById("contactform").disabled = true;
document.getElementById("gstform").disabled = true;


$(function () {
    var alreadyFilled = false;
    // -----------------Add the customer in the drop down --------------------------
    // first refresh the customer
    refreshCustomer();
    var states = [];
    //--------------- End customer drop down -------------------------------------
    function initDialog() {
        clearDialog();
        for (var i = 0; i < states.length; i++) {
            $('.dialog').append('<div>' + states[i] + '</div>');
        }
    }

    function clearDialog() {
        $('.dialog').empty();
    }
    $('.autocomplete input').click(function () {
        if (!alreadyFilled) {
            // Before opening the dialog fill the state and push 
            // refreshCustomer();
            if (states.length == 0) {
                // var ocustomer = getCustomer();
                var length = tbluser.rows.length;
                if (length > 1) {
                    for (let index = 1; index < length; index++) {
                        var oCells = tbluser.rows.item(index).cells;
                        var customerId = oCells.item(0).innerHTML;
                        var customerName = oCells.item(1).innerHTML;
                        var ostring = customerName + '-' + customerId;
                        states.push(ostring);
                    }
                    for (var i = 0; i < states.length; i++) {
                        $('.dialog').append('<div>' + states[i] + '</div>');
                    }
                } else {
                    // for (var i = 0; i < ocustomer.length; i++) {
                    //     $('.dialog').append('<div>' + ocustomer[i] + '</div>');
                    // }
                }
            }

            $('.dialog').addClass('open');
        }

    });
    $('body').on('click', '.dialog > div', function () {
        $('.autocomplete input').val($(this).text()).focus();
        $('.autocomplete .close').addClass('visible');
        alreadyFilled = true;
    });
    $('.autocomplete .close').click(function () {
        alreadyFilled = false;
        $('.dialog').addClass('open');
        $('.autocomplete input').val('').focus();
        $(this).removeClass('visible');
    });

    function match(str) {
        str = str.toLowerCase();
        clearDialog();
        for (var i = 0; i < states.length; i++) {
            if (states[i].toLowerCase().startsWith(str)) {
                $('.dialog').append('<div>' + states[i] + '</div>');
            }
        }
    }
    $('.autocomplete input').on('input', function () {
        $('.dialog').addClass('open');
        alreadyFilled = false;
        match($(this).val());
    });
    $('body').click(function (e) {
        if (!$(e.target).is("input, .close")) {
            $('.dialog').removeClass('open');
        }
    });
    initDialog();
    $('#fill').click(function () {
        // alert('fill clicked');
        collectcustomerdata();
    });
    // Table event to calculate the Amount 
    $('#goods').on('keyup', (function () {
        // alert("Tbale Click");
        var sum = 0;
        try {
            for (var i = 1; i < goodstable.rows.length; i++) {
                var a = parseFloat(goodstable.rows[i].cells[5].childNodes[0].value);
                var b = parseFloat(goodstable.rows[i].cells[4].childNodes[0].value);
                sum = a * b;
                if (!isNaN(sum)) {
                    goodstable.rows[i].cells[7].childNodes[0].value = sum;
                }
            }
            // document.getElementById('totallabel').innerHTML = sum;
            // if (isNaN(sum)) {
            //     alert("Please correct the Amount");
            // }
        } catch (error) {
            alert(error);
        }
    }));
});

function collectcustomerdata() {
    // alert(document.getElementById("customerSearch").value);
    var value = document.getElementById("customerSearch").value;
    // Split to get the customer number 
    var result = value.split("-");
    var customerId = result[1];
    // read the record from the database
    return firebase.database().ref('/users/Customers/' + customerId).once('value').then(function (snapshot) {
        var companyname = (snapshot.val().companyName) || ' ';
        var location = (snapshot.val().location) || ' ';
        var contactPerson = (snapshot.val().contactPerson) || ' ';
        var gst = (snapshot.val().gst) || ' ';
        var mobile = (snapshot.val().mobile) || ' ';
        // Hide the Labels
        document.getElementById("companynamelabel").style.display = 'none';
        document.getElementById("locationlabel").style.display = 'none';
        document.getElementById("mobilelabel").style.display = 'none';
        document.getElementById("Contactlabel").style.display = 'none';
        document.getElementById("gstlabel").style.display = 'none';

        document.getElementById("companynameform").value = 'Company Name:-' + companyname;
        document.getElementById("locationform").value = 'Location:-' + location;
        document.getElementById("mobileform").value = 'Mobile:-' + mobile;
        document.getElementById("contactform").value = 'Contact Person:-' + contactPerson;
        document.getElementById("gstform").value = 'GST:-' + gst;
    });
}
// ------------------Get the customer name and company in an array-----------------
// function getCustomer() {
//     var rowIndex = 1;
//     var customer = [];
//     var ref = firebase.database().ref('users/Customers/');
//     ref.once('value', function (snapshot) {
//         snapshot.forEach(function (childSnapshot) {
//             var childKey = childSnapshot.key;
//             // Skip the counter value 
//             if (childKey == 'counter') {
//                 return customer;
//             }
//             var childData = childSnapshot.val();
//             var ostring = childData.companyName + '-' + childKey;
//             customer.push(ostring);
//             rowIndex = rowIndex + 1;
//         });
//     });
//     return customer;
// }
// ------------------End of Get customer-------------------------------------------
// -----------------Reference------------------------------------------------------------

function save_user() {
    var user_name = document.getElementById('user_name').value;

    var uid = firebase.database().ref().child('users').push().key;

    var data = {
        user_id: uid,
        user_name: user_name
    }

    var updates = {};
    updates['/users/' + uid] = data;
    firebase.database().ref().update(updates);

    alert('The user is created successfully!');
    reload_page();

}

function update_user() {
    var user_name = document.getElementById("user_name").value;
    var user_id = document.getElementById('user_id').value;

    var data = {
        user_id: user_id,
        user_name: user_name
    }

    var updates = {};
    updates['/users/' + user_id] = data;
    firebase.database().ref().update(updates);

    alert('The user is updated successfully!');

    reload_page();

}

function delete_user() {
    var user_id = document.getElementById('user_id').value;
    firebase.database().ref().child('/users/' + user_id).remove();
    alert('The user is deleted successfully!');
    reload_page();
}

function reload_page() {
    window.location.reload();
}
