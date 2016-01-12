/**
 * Created by bdilday on 1/11/16.
 */

function pad(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
};

$( "#slider" ).slider({
    min: 0,
    max: 1250,
    animate: 'slow',
    slide: function(event, ui) {
        var img = 'imgs/sportsVU_eigenspectrum_050_025_' + pad(ui.value, 4) + '.png';
        console.log('ui', ui.value, img);
        $('#img-eigen').attr('src', img);
    }
});

