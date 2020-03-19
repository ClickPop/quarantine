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

                $.ajax({
                  type: 'get',
                  url: `/contributors/${contributor}`,
                  success: function(response) {
                      const { name, headshot } = response.data;

                      $('#logo').slideUp('fast');

                      $('.form__container').addClass('bg--salmon')

                      const contributorInfo = `
                        <div class="mt-5 mb-2">
                          This great idea came from...
                        </div>
                        <div class="d-flex align-items-center">
                          ${
                            headshot !== undefined
                            ? `<img src=${headshot[0].url} class="img-thumbnail rounded-circle" width="90">`
                            : ''
                          }
                          <div>
                            ${name}
                          </div>
                      `;

                      $(`
                        <div if="results" class="row px-3">
                          <div class="col-12 col-md-10 offset-md-1">
                            <div class="result__container py-5 mt-2">
                              <h1>
                                ${activity}
                              </h1>
                              <p>
                                ${description}
                              </p>
                              ${
                                url !== undefined
                                ? `<a href=${url} target="_blank" class="btn btn-primary btn-sm mt-1">Learn more</a>`
                                : ''
                              }

                              ${contributor !== undefined
                                ? contributorInfo
                                : ''
                              }

                            </div>
                          </div>
                        </div>
                        `
                      ).appendTo('.fullscreen__container')
                      .css('opacity', 0)
                      .animate(
                        { opacity: 1 }
                      );
                  }
              });

            }
        });
    });
});
