$(document).ready(function() {
  $('#go').on('click', function(e) {
    e.preventDefault();
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
        const activity = response.data;
        const contributors = activity.contributors;
        let contributorPeople = [];

        if (Array.isArray(contributors)) {
          contributors.forEach(function(contributor) {
            contributorPeople.push(`
            <li class="d-flex align-items-center">
              ${
                contributor.headshot !== undefined
                ? `<img src=${contributor.headshot[0].url} class="img-thumbnail rounded-circle mr-2" width="80">`
                : ''
              }
              <p>${contributor.name}</p>
            </li>`);
          });
        }
        contributorPeople.join('');
        
        let contributorInfo = `
          <div class="mt-5 mb-2">
            This great idea came from...
            <ul>${contributorPeople}</ul>
          </div>
        `;

        let result = `
          <div id="result" class="row px-3">
            <div class="col-12 col-md-10 offset-md-1">
              <div class="result__container py-3 py-sm-5 mt-2">
                <h1>${activity.title}</h1>
                <p>${activity.description}</p>
                ${
                  (activity.url !== undefined)
                  ? `<a href=${url} target="_blank" class="btn btn-primary btn-sm mt-1">Learn more</a>`
                  : ''
                }

                ${(activity.contributors !== undefined)
                  ? contributorInfo
                  : ''
                }
              </div>
            </div>
          </div>`;

        $(result).appendTo('.fullscreen__container')
          .css('opacity', 0)
          .animate({
            opacity: 1
          });
      }
    });
  });
});