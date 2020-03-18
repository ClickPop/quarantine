$(document).ready(function() {
    $('#go').click(function(e) {
        let type = $('#search-type option:selected').text();
        let audience = $('#search-audience option:selected').text();
        let free = $('#search-free').is(':checked');
        $.ajax({
            type: 'post',
            url: '/search',
            data: {
                type,
                audience,
                free
            },
            dataType: 'json',
            success: function(response) {
                console.log(response.data);
            }
        });
    });
});
