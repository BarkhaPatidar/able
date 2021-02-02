window.NumberFormat = function() {
    var numberFormat = {};

    numberFormat.convertNum = function (num) {
        var number;
        if(Math.abs(num) > 999999) {
            number = Math.sign(num)*((Math.abs(num)/1000000).toFixed(1)) + 'M'
        } else if(Math.abs(num) > 999) {
            number = Math.sign(num)*((Math.abs(num)/1000).toFixed(1)) + 'K'
        } else {
            number = Math.sign(num)*Math.abs(num)
        }
        return number;
    }

    return numberFormat;
}