var lanHostsArray = Array();
var hostsPerLan = Array();

var subnets = [1, 2, 4, 8, 16, 32, 64, 128, 256];
var hosts = [256, 128, 64, 32, 16, 8, 4, 2, 1];
var submask = [24, 25, 26, 27, 28, 29, 30, 31, 32];
var cidrLastOctet = [0, 128, 192, 224, 240, 248, 252, 254, 255];


function availableHosts()
{
    var cidrNo = parseInt(document.getElementById("cidr").value);
    var cidrIndex = submask.indexOf(cidrNo);
    var totalHosts = hosts[cidrIndex] - 2;
    return totalHosts;
}

function networkID()
{
    var cidrNo = parseInt(document.getElementById("cidr").value);
    var cidrIndex = submask.indexOf(cidrNo);
    var cidrLastO = cidrLastOctet[cidrIndex];
    var cidrBinary = cidrLastO.toString(2);
    var fourthOctet = parseInt(document.getElementById("fourthoctet").value);
    var fourthBinary = fourthOctet.toString(2);
    var res = "";
    var forthArray = Array.from(fourthBinary);
    var cidrArray = Array.from(cidrBinary);

    var fourthLength = forthArray.length;
    var cidrLength = cidrArray.length;

    if (fourthLength < 8)
    {
        while (fourthLength < 8)
        {
            forthArray.unshift("0");
            fourthLength++;
        }
    }

    if (cidrLength < 8)
    {
        while (cidrLength < 8)
        {
            cidrArray.unshift("0");
            cidrLength++;
        }
    }

    for (var i = 0; i < 8; i ++)
    {
        if (forthArray[i] == 0 && cidrArray[i] == 0)
        {
            res += "0";
        }
        else if (forthArray[i] == 0 && cidrArray[i] == 1)
        {
            res += "0";
        }
        else if (forthArray[i] == 1 && cidrArray[i] == 0)
        {
            res += "0";
        }
        else if (forthArray[i] == 1 && cidrArray[i] == 1)
        {
            res += "1";
        }
    }

    return parseInt(res, 2).toString(10);
}


function validateForm()
{
    var firstoctet = document.forms["myform"]["first"].value;
    var secondoctet = document.forms["myform"]["second"].value;
    var thirdoctet =  document.forms["myform"]["third"].value;
    var fourthoctet =   document.forms["myform"]["fourth"].value;
    var cidrNo = document.forms["myform"]["cid"].value;

    if ( isNaN(firstoctet) || isNaN(secondoctet) || isNaN(thirdoctet) || isNaN(fourthoctet) ||  secondoctet < 0 ||
        secondoctet > 255 || thirdoctet < 0 || thirdoctet > 255 || fourthoctet < 0 || fourthoctet > 255 ||
        secondoctet == "" || thirdoctet == "" || fourthoctet == "" || isNaN(cidrNo) || cidrNo < 24 || cidrNo > 32
        || sumHosts() < 0 || cidrNo == "" || fourthoctet > 255 || firstoctet < 1 | firstoctet > 255 || firstoctet == "")
    {
        document.getElementById("myform").reset();
        reFresh();
        return false;
    }
    else return true;
}

function resetForm()
{
    document.getElementById("myform").reset();
}

function sumHosts()
{
    var sum = 0;
    var totalAvaleableHosts = 0

    var lans = document.getElementsByName("lan[]");
    for (var i = 0; i < lans.length; i++)
    {
        sum += parseInt(lans[i].value);
    }
    totalAvaleableHosts = availableHosts() - sum;
    return totalAvaleableHosts;
}

function numLans()
{
    var input = document.getElementsByName("lan[]");

    for (var i = 0; i < input.length; i++)
    {
        if (isNaN(input[i].value) || (input[i].value < 0) || (input[i].value == ""))
        {
            alert("You must enter value for network: " + (i + 1) + " and number of hosts must be greater than zero");
            resetForm();
            reFresh();
            $("#calculate").empty();
            $("#readdb").empty();
            $("#introduction").empty();
            $("#calculate").load("vlsm.html");
        }
        else
        {
            lanHostsArray[i] = parseInt(input[i].value);
        }
    }
}

function lanHosts()
{
    for (var j = 0; j < lanHostsArray.length; j++)
    {
        if (lanHostsArray[j] <= 8)
        {
            lanHostsArray[j] += 2;
        }
    }
}

function setHosts()
{
    for (var i = 0; i < lanHostsArray.length; i++)
    {

        for (var index = 0; index < hosts.length; index++)
        {
            if (lanHostsArray[i] <= hosts[index] && lanHostsArray[i] >= hosts[index + 1])
            {
                hostsPerLan[i] = hosts[index];
            }
        }
    }
}

function getSubAndMask()
{
    var innerTable = "";
    hostsPerLan.sort(function (a, b) {
        return a - b;
    });

    hostsPerLan.reverse();

    innerTable += "<table class='table-primary table-striped caption-top'>";
    innerTable += "<thead>";
    innerTable += "<tr>";

    innerTable +=
        "<th scope='col'>Network ID</th><th scope='col'>CIDR</th><th scope='col'>Subnet Mask</th><th scope='col'>Number of Hosts per subnet</th>" +
        "<th scope='col'>LAN</th><th scope='col'>Number of subnets</th><th scope='col'>Range of usable IP addresses</th><th scope='col'>" +
        "Broadcast ID</th></tr></thead>" +
        "<tbody>";

    var firstoctet = parseInt(document.getElementById("firstoctet").value);
    var secondoctet = parseInt(document.getElementById("secondoctet").value);
    var thirdoctet = parseInt(document.getElementById("thirdoctet").value);

    var fourthoctet = parseInt(networkID());

    for (var i = 0; i < hostsPerLan.length; i++)
    {

        var subnetIndex = hosts.indexOf(hostsPerLan[i]);
        var subnetNo = subnets[subnetIndex];
        var subMaskNo = submask[subnetIndex];
        var subnetDecimal = cidrLastOctet[subnetIndex];


        innerTable += "<tr>" + "<td>" + firstoctet + "." + secondoctet + "." + thirdoctet + "." + fourthoctet + "</td>" + "<td>" + "/" +
            subMaskNo + "</td>" + "<td>255.255.255." + subnetDecimal + "</td>" + "<td>" + hostsPerLan[i] + "</td>" + "<td>" + "LAN: " + (i + 1) + "</td>" + "<td>" + subnetNo + "</td>";

        innerTable += "<td>" + firstoctet + "." + secondoctet + "." + thirdoctet + "." + (fourthoctet + 1) + " - " + firstoctet +
            "." + secondoctet + "." + thirdoctet + "." + (fourthoctet + hostsPerLan[i] - 2) + "</td>" + "<td>" + firstoctet +
            "." + secondoctet + "." + thirdoctet + "." + (fourthoctet + hostsPerLan[i] - 1) + "</td>" + "</tr>";

        fourthoctet += hostsPerLan[i];
    }

    innerTable += "</tbody></table>";
    $("#innertable").append(innerTable);
    $("#myModal").modal('show');
}

function test ()
{
    var available = availableHosts();
    if (validateForm() === true)
    {
        sumHosts (); numLans(); lanHosts(); setHosts(); getSubAndMask();
    }

    else
    {
        alert("Octets must be numbers and/or greater than zero and/or less than " + 255 + " or sum of hosts exceeds " +
            "available IP address poll of: " + available);
        resetForm();
    }
}

function reFresh()
{
    window.location = window.location;
    $("#calculate").load("vlsm.html");
}