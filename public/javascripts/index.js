$(document).ready(function() {
    $('#go').click(function(e) {
        let type = $('#search-type option:selected').attr('value');
        let audience = $('#search-audience option:selected').attr('value');
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
                $('#result').remove();
                const {
                    activity,
                    is_free,
                    description,
                    url,
                    contributor
                } = response.data;
                
                $(
                    `<div id="result" class="d-flex flex-row">
                        <div id="activity" class="d-block card mt-2">
                            <div class="card-header mt-1>
                                <h1 class="card-title mt-1>${activity}</h1>
                            </div>
                            <div class="card-body">
                                <p class="card-text mt-1">${description}</p>
                                ${
                                    url !== undefined
                                        ? `<a href=${url} target="_blank" class="btn btn-primary mt-1">LINK</a>`
                                        : ''
                                }
                            </div>
                            <div class="card-footer mt-1">${
                                is_free ? 'FREE' : 'NOT FREE'
                            }</div>
                        </div>
                    </div>`
                ).appendTo('form');
            }
        });
    });
});
